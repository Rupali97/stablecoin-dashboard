import React, { useState, useEffect, useMemo } from 'react'
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  MenuItem,
} from "@material-ui/core";
import {useMediaQuery} from "react-responsive";
import Web3 from 'web3';
import { useNetwork } from 'wagmi'
import { formatToBN, getBalance } from '../../../utils/formatBalance';
import useCore from '../../../hooks/useCore';
import ConfirmationStep from '../../../components/ConfirmationStep';
import { useWallet } from 'use-wallet';
import { BigNumber, ethers, utils } from 'ethers';
import useGetOwners from '../../../hooks/useGetOwners';
import useSubmitTransaction from '../../../hooks/useSubmitTransaction';
import { useAllTransactions, useClearAllTransactions } from '../../../state/transactions/hooks';
import useGetAllMultiSigTxns from '../../../hooks/useGetAllMultiSigTxns';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import useSubmit from '../../../hooks/tron/useSubmit';
import useGetAllTronTxns from '../../../hooks/tron/useGetAllTronTxns';
import { useGetActiveBlockChain, useGetActiveChainId } from '../../../state/chains/hooks';
import Textfield from '../../../components/Textfield';
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks';
import Test from '../Test';
import { tronStableCoins } from '../../../utils/constants';
import useGetTronOwners from '../../../hooks/tron/useGetTronOwners';
import _ from 'lodash';

function Mint({ethTxns, tronTxns}) {

  const core = useCore()
  const {myAccount, provider, _activeNetwork, tokens, contracts } = core

  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()
  const { chain: chainName} = useNetwork()
  const isMobile = useMediaQuery({maxWidth: '600px'});

  const chain = useGetActiveBlockChain()
  const chaindId = useGetActiveChainId()
  const fetchOwners = useGetTronOwners()

  const [address, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [allTransactions, setAllTransactions] = useState<any>([])
  const [finalTxns, setFinalTxns] = useState<any>([])
  const [finalEthTxns, setFinalEthTxns] = useState<any>([])
  const [finalTronTxns, setFinalTronTxns] = useState<any>([])
  // let allTx = Object.entries(allTransactions)?.map((key) => key[1])?.filter((tx) => tx.txDetail._typeOfTx == 0)
  // let allTronTxns = useGetAllTronTxns()
  // allTronTxns = allTronTxns.filter((tx) => tx._typeOfTx.toNumber() == 0)

  const contractOwners: any = useGetOwners()
  const tronContractOwners = useGetTronOwners()
 
  useEffect(() => {
    sortTransactions()
  }, [ethTxns, tronTxns, chain])


  const sortTransactions = async () => {
    let ethTxnsArr: any[] = [], tronTxnsArr: any[] = []
    ethTxns.forEach((item) => {
      if (item.submitResponse.input.includes("40c10f19")) {
        ethTxnsArr.push({...item, typeOfTxn: "Mint"})
      }
    })

     console.log("ethTxnsArr", ethTxnsArr)

    setFinalEthTxns(ethTxnsArr)

    tronTxns.forEach(async (item) => {
      if (item.submitResponse.input.includes("40c10f19")) {
        tronTxnsArr.push({...item, typeOfTxn: "Mint"})
      }
    })

    setFinalTronTxns(tronTxnsArr)

  }

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const mintTokenAction = useSubmitTransaction("mint", address, amount, stableCoin)
  const submitTronTxnAction = useSubmit("mint", address, amount, stableCoin)

  const submitTx = async() => {
    updateLoader(true)
    if(chain == 'Goerli'){
      mintTokenAction(() => {},() => {})
    }

    if(chain == 'Nile') {
      submitTronTxnAction()
    }
  }

  const disableMint = address && (chain == "Goerli" ? ethers.utils.isAddress(address) :  window.tronWeb?.isAddress(address)) && amount && stableCoin && chain && (chain == "Goerli" ? contractOwners?.includes(myAccount) : tronContractOwners?.includes(window.tronWeb?.defaultAddress.base58))

  // console.log("finalTxns", _.uniqWith(finalEthTxns, (arrVal: any, othVal: any) => arrVal.index == othVal.index), finalTronTxns)
  console.log("Mint", ethTxns, tronTxns)

  return (
    <div style={{marginLeft: isMobile ? "20px" : '260px', marginRight: '20px', position: 'relative',}}>      
      <Card style={{marginBottom: '30px'}}>
        <CardContent className='p15'>
          <Textfield
            text={'Mint the Stablecoin'}
            fontSize={'24px'}
            fontWeight={'bold'}
            className={'m-b-15'}
            />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                helperText="This is the address to which token to be minted"
                required
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAddress(e.target.value)}
                value={address}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid  xs={12} md={6}>
              <TextField
                helperText="This is the amount of token to be minted"
                required
                label="Amount"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAmount(e.target.value)}
                value={amount}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid  xs={12} md={6}>
                <TextField
                  helperText="This is the token to be minted"
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
            <Grid  xs={12} md={6}></Grid>
            <Grid item md={9}>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                onClick={submitTx}
                variant="contained"
                color="primary"
                fullWidth
                disabled={!disableMint}
                style={{position: 'relative'}}
              >
                <div>Submit</div>

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

export default Mint

