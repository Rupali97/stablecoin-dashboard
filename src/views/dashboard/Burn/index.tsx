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

import { formatToBN, getBalance } from '../../../utils/formatBalance';
import { chains, stableCoins } from '../Mint';
import ConfirmationStep from '../../../components/ConfirmationStep';
import useSubmitTransaction from '../../../hooks/useSubmitTransaction';
import useGetAllMultiSigTxns from '../../../hooks/useGetAllMultiSigTxns';
import useGetOwners from '../../../hooks/useGetOwners';
import useCore from '../../../hooks/useCore';
import { BigNumber } from 'ethers';
import useGetAllTronTxns from '../../../hooks/tron/useGetAllTronTxns';
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import useSubmit from '../../../hooks/tron/useSubmit';
import Textfield from '../../../components/Textfield';
import { useAllTransactions } from '../../../state/transactions/hooks';
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks';
import useGetTokenBalance from '../../../hooks/useGetTokenBalance';
import useGetTokenDetails from '../../../hooks/useGetTokenDetails';

function Burn({ burnTxns }) {
  const { tokens, _activeNetwork } = useCore()
  const { chain: chainName } = useNetwork()

  // const { myAccount } = core
  const { address: myAccount } = useAccount()

  console.log("BurnmyAccount", myAccount)
  const chain = useGetActiveBlockChain()

  let contractOwners: any = useGetOwners()
  // let allTx = Object.entries(allTransactions)?.map((key) => key[1])?.filter((tx) => tx.txDetail._typeOfTx == 1)
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()

  // let allTronTxns = useGetAllTronTxns()
  // allTronTxns = allTronTxns.filter((tx) => tx._typeOfTx.toNumber() == 1)

  const [adddress, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [stableCoinDetails, setStableCoinDetails] = useState<any>()

  const burnTokenAction = useSubmitTransaction("burn", adddress, amount, stableCoin)
  const submitTronTxnAction = useSubmit(adddress, formatToBN(amount), stableCoin, BigNumber.from('1'))
  const { fetchData } = useGetTokenBalance();

  useEffect(() => {
    if (adddress.length > 0 && stableCoin.length > 0)
      getTokenDetails()
  }, [stableCoin, adddress])

  useEffect(() => {
    console.log("useEffectBurnburnTxns", burnTxns)
  }, [burnTxns])

  const submitTx = async () => {
    updateLoader(true)

    if (chain == 'MaticMumbai') {
      burnTokenAction(() => { }, () => { })
    }
    if (chain == "Neil") {
      submitTronTxnAction()
    }
  }

  const handleCoinChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const getTokenDetails = async () => {
    console.log("getTokenDetails stableCoin", stableCoin, adddress)
    let tokenDetails = await fetchData(adddress, stableCoin)
    console.log("getTokenDetails", tokenDetails)
    setStableCoinDetails(tokenDetails)
  }

  const disableSubmitBtn = amount && Number(amount) <= Number(stableCoinDetails) && !!stableCoin && chain && contractOwners?.includes(myAccount)


  // console.log("burnTxns", burnTxns)

  console.log("stableCoinDetails", stableCoinDetails)

  return (
    <div style={{ marginLeft: '260px', marginRight: '20px' }}>

      <Card style={{ marginBottom: '15px' }}>
        <CardContent className='p15'>
          <Textfield
            text={'Burn the Stablecoin'}
            fontSize={'24px'}
            fontWeight={'bold'}
            className={'m-b-15'}
          />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                helperText="This is the address to which token to be burned"
                required
                id="outlined-email"
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e: any) => setAddress(e.target.value)}
                value={adddress}
                fullWidth
                size='small'
              // variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
                {Object.entries(tokens[chainName?.id || _activeNetwork]).map((option) => (
                  <MenuItem key={option[1].symbol} value={option[1].symbol}>
                    {option[1].symbol}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={9}></Grid>
            <Grid item xs={3}>
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

      <ConfirmationStep allTransactions={burnTxns} />

    </div>
  )
}

export default Burn
