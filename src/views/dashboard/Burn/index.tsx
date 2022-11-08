import React, { useEffect, useState } from 'react'
import {
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Snackbar,
  Grid,
  MenuItem,
} from "@material-ui/core";
import { useAccount, useNetwork } from 'wagmi'
import {useMediaQuery} from "react-responsive";

import { formatToBN, getBalance } from '../../../utils/formatBalance';
import ConfirmationStep from '../../../components/ConfirmationStep';
import useSubmitTransaction from '../../../hooks/useSubmitTransaction';
import useGetAllMultiSigTxns from '../../../hooks/useGetAllMultiSigTxns';
import useGetOwners from '../../../hooks/useGetOwners';
import useCore from '../../../hooks/useCore';
import { BigNumber, ethers } from 'ethers';
import useGetAllTronTxns from '../../../hooks/tron/useGetAllTronTxns';
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import useSubmit from '../../../hooks/tron/useSubmit';
import Textfield from '../../../components/Textfield';
import { useAllTransactions } from '../../../state/transactions/hooks';
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks';
import useGetTokenBalance from '../../../hooks/useGetTokenBalance';
import useGetTokenDetails from '../../../hooks/useGetTokenDetails';
import useGetTronOwners from '../../../hooks/tron/useGetTronOwners';
import { tronStableCoins } from '../../../utils/constants';
import useGetTronTokenBalance from '../../../hooks/tron/useGetTronTokenBalance';
import _ from 'lodash';

function Burn({ ethTxns, tronTxns }) {
  const isMobile = useMediaQuery({maxWidth: '768px'});
  const { tokens, _activeNetwork, tronWeb } = useCore()
  const { chain: chainName } = useNetwork()

  // const { myAccount } = core
  const { address: myAccount } = useAccount()
  const chain = useGetActiveBlockChain()

  let contractOwners: any = useGetOwners()
  const tronContractOwners = useGetTronOwners()

  // let allTx = Object.entries(allTransactions)?.map((key) => key[1])?.filter((tx) => tx.txDetail._typeOfTx == 1)
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()

  // let allTronTxns = useGetAllTronTxns()
  // allTronTxns = allTronTxns.filter((tx) => tx._typeOfTx.toNumber() == 1)

  const [address, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [stableCoinDetails, setStableCoinDetails] = useState<any>()
  const [allTransactions, setAllTransactions] = useState<any>([])
  const [finalEthTxns, setFinalEthTxns] = useState<any>([])
  const [finalTronTxns, setFinalTronTxns] = useState<any>([])

  const burnTokenAction = useSubmitTransaction("burn", address, amount, stableCoin)
  const submitTronTxnAction = useSubmit("burn", address, amount, stableCoin)
  const { fetchData } = useGetTokenBalance();
  const { fetchTronTokenBal } = useGetTronTokenBalance();

  useEffect(() => {
    if (address.length > 0 && stableCoin.length > 0)
      getTokenDetails()
  }, [stableCoin, address])

  useEffect(() => {
    sortTransactions()
  }, [ethTxns, tronTxns, chain])

  const sortTransactions = async () => {
    let ethTxnsArr: any[] = [], tronTxnsArr: any[] = []
    ethTxns.forEach(async (item) => {
      if (item.submitResponse.input.includes("9dc29fac")) {
        ethTxnsArr.push({...item, typeOfTxn: "Burn"})
      }
    })

    setFinalEthTxns(ethTxnsArr)

    tronTxns.forEach(async (item) => {
      if (item.submitResponse.input.includes("9dc29fac")) {
        tronTxnsArr.push({...item, typeOfTxn: "Burn"})
      }
    })

    setFinalTronTxns(tronTxnsArr)

  }

  const submitTx = async () => {
    updateLoader(true)

    if (chain == 'Goerli') {
      burnTokenAction(() => { }, () => { })
    }
    if (chain == "Nile") {
      submitTronTxnAction()
    }
  }

  const handleCoinChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const getTokenDetails = async () => {
    let tokenDetails
    if(chain == "Goerli"){
      tokenDetails = await fetchData(address, stableCoin)
    }else {
      tokenDetails = await fetchTronTokenBal(address, stableCoin)
    }
    setStableCoinDetails(tokenDetails)
  }

  console.log("Burn tronTxns", tronTxns)

  const disableSubmitBtn = address && (chain == "Goerli" ? ethers.utils.isAddress(address) : tronWeb.isAddress(address)) 
    && amount && Number(amount) <= Number(stableCoinDetails) && !!stableCoin && chain && 
    (chain == "Goerli" ? contractOwners?.includes(myAccount) : tronContractOwners?.includes(tronWeb.defaultAddress.base58))

  return (
    <div style={{ marginLeft: isMobile ? "20px" : '260px', marginRight: '20px' }}>

      <Card style={{ marginBottom: '15px' }}>
        <CardContent className='p15'>
          <Textfield
            text={'Burn the Stablecoin'}
            fontSize={'24px'}
            fontWeight={'bold'}
            className={'m-b-15'}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <TextField
                helperText="This is the token to be burned"
                required
                select
                label="Stablecoin"
                value={stableCoin}
                onChange={handleCoinChange}
                fullWidth
                // variant="outlined"
                size='small'
              >

                {
                    chain == "Nile" ? 
                      tronStableCoins?.map((coin) => 
                        (<MenuItem
                          key={coin.symbol}
                          value={coin.contractAdrs}>
                            {coin.symbol}
                        </MenuItem>)
                      ) 
                      :

                      tokens[chainName?.id || _activeNetwork] ? Object.entries(tokens[chainName?.id || _activeNetwork])?.map((option) => (
                        <MenuItem key={option[1].symbol} value={option[1].symbol}>
                          {option[1].symbol}
                        </MenuItem>
                      ))
                      : <MenuItem>No coins available on this chain</MenuItem>
                  }
              </TextField>
            </Grid>
            <Grid item md={1}></Grid>
            <Grid item xs={12} md={6}>
              <TextField
                helperText={`This is the amount of token to be burned. ${stableCoin && `Max value: ${stableCoinDetails}`} `}
                required
                label="Amount"
                // margin="dense"
                type="text"
                onChange={(e: any) => setAmount(e.target.value)}
                value={amount}
                fullWidth
                size='small'
              // variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                helperText="This is the address to which token to be burned"
                required
                id="outlined-email"
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e: any) => setAddress(e.target.value)}
                value={address}
                fullWidth
                size='small'
              // variant="outlined"
              />
            </Grid>
            <Grid item md={9}></Grid>
            <Grid item xs={12} md={3}>
              <Button
                disabled={!disableSubmitBtn}
                onClick={submitTx}
                variant="contained"
                color="primary"
                fullWidth
                style={{ position: 'relative' }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>


        </CardContent>

      </Card>

      {
        chain == "Goerli" ? 
        <ConfirmationStep allTransactions={_.uniqWith(finalEthTxns, (arrVal: any, othVal: any) => arrVal.index == othVal.index)} /> :
        <ConfirmationStep allTransactions={finalTronTxns} /> 
      }

    </div>
  )
}

export default Burn
