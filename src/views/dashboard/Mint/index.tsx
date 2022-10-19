import React, { useState, useEffect, useMemo } from 'react'
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  MenuItem
} from "@material-ui/core";
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
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import Textfield from '../../../components/Textfield';
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks';
import Test from '../Test';

export const stableCoins = [
  // {
  //   label: 'Token',
  //   chain: 'MaticMumbai'
  // },
  // {
  //   label: 'Token2',
  //   chain: 'MaticMumbai'
  // },
  {
    label: 'USD-A',
    chain: 'MaticMumbai',
    address: "0x125eDC5cd0eA0453D0485153F7F200C323882B4e"
  },
  {
    label: "T20",
    chain: 'Neil',
    contractAdrs: 'TQFw44XRvTyZ9VqxiQwcJ8udYMJ4p5MWUE'
  }
]

export const chains = [
  {
    label: 'MaticMumbai',
    chainID: 'MaticMumbai'
  },
  {
    label: "Neil",
    chainID: 'Neil',
  }
]

function Mint({mintTxns}) {

  const core = useCore()
  const {myAccount, provider, _activeNetwork, tokens } = core

  // const allTransactions = useAllTransactions()
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()
  const { chain: chainName} = useNetwork()

  const chain = useGetActiveBlockChain()

  const multiSigTxns = useGetAllMultiSigTxns()

  console.log('multiSigTxns', multiSigTxns)
  console.log('mintTxns', mintTxns)

  // const {clearAllTransactions} = useClearAllTransactions();
  // clearAllTransactions()

  const [adddress, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')

  // let allTx = Object.entries(allTransactions)?.map((key) => key[1])?.filter((tx) => tx.txDetail._typeOfTx == 0)
  // let allTronTxns = useGetAllTronTxns()
  // allTronTxns = allTronTxns.filter((tx) => tx._typeOfTx.toNumber() == 0)

  let contractOwners: any = useGetOwners()

  console.log('contractOwners', contractOwners)

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const mintTokenAction = useSubmitTransaction("mint", adddress, amount, stableCoin)
  const submitTronTxnAction = useSubmit(adddress, formatToBN(amount), stableCoin, BigNumber.from('0'))

  const submitTx = async() => {
    updateLoader(true)
    if(chain == 'MaticMumbai'){
      mintTokenAction(() => {},() => {})
    }

    if(chain == 'Neil') {
      submitTronTxnAction()
    }
  }

  const disableMint = adddress && amount && stableCoin && chain && contractOwners?.includes(myAccount) && !currentLoaderState

  return (
    <div style={{marginLeft: '260px', marginRight: '20px', position: 'relative',}}>
      <Test />
      
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
                value={adddress}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid item xs={6}>
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
            <Grid item xs={6}>
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
                  {Object.entries(tokens[chainName?.id || _activeNetwork]).map((option) => (
                    <MenuItem key={option[1].symbol} value={option[1].address}>
                      {option[1].symbol}
                    </MenuItem>
                  ))}
                </TextField>           
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={3}>
            </Grid>
            <Grid item xs={3}>
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
            {/* <Grid item xs={4}></Grid> */}
          </Grid>
          
        </CardContent>

      </Card>
    

      {/* <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Transaction History
          </Typography>
        </CardContent>
      </Card> */}
      {/* {
        chain == "MaticMumbai" ?
        <ConfirmationStep allTx={Object.entries(allTransactions).map((key) => key[1])} /> :
        <ConfirmationStep allTx={allTronTxns} />

      } */}
      <ConfirmationStep allTransactions={mintTxns} /> 
    </div>
  )
}

export default Mint

