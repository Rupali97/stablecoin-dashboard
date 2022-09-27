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
import {Puff} from "react-loader-spinner"
import { formatToBN, getBalance } from '../../../utils/formatBalance';
import useCore from '../../../hooks/useCore';
import ConfirmationStep from '../../../components/ConfirmationStep';
import { useWallet } from 'use-wallet';
import { BigNumber, utils } from 'ethers';
import useGetOwners from '../../../hooks/useGetOwners';
import useMultiSig from '../../../hooks/useMultiSig';
import { useAllTransactions, useClearAllTransactions } from '../../../state/transactions/hooks';
import useGetAllMultiSigTxns from '../../../hooks/useGetAllMultiSigTxns';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import useSubmit from '../../../hooks/tron/useSubmit';
import useGetAllTronTxns from '../../../hooks/tron/useGetAllTronTxns';
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import Textfield from '../../../components/Textfield';
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks';

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
    label: 'Token3',
    chain: 'MaticMumbai'
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

function Mint() {

  const core = useCore()
  const {myAccount } = core
  const allTransactions = useAllTransactions()
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()

  const chain = useGetActiveBlockChain()

  const [adddress, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')

  let allTx = Object.entries(allTransactions)?.map((key) => key[1])?.filter((tx) => tx.txDetail._typeOfTx == 0)
  // let allTronTxns = useGetAllTronTxns()
  // allTronTxns = allTronTxns.filter((tx) => tx._typeOfTx.toNumber() == 0)

  let contractOwners: any = useGetOwners()

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const mintTokenAction = useMultiSig(adddress, formatToBN(amount), stableCoin, BigNumber.from('0'))
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

  console.log('currentLoaderState', currentLoaderState)

  const disableMint = adddress && amount && stableCoin && chain && contractOwners?.includes(myAccount) && !currentLoaderState

  return (
    <div style={{marginLeft: '260px', marginRight: '20px', position: 'relative',}}>
       <Textfield
          text={'Mint the Stablecoin'}
          fontSize={'24px'}
          fontWeight={'bold'}
          className={'m-b-15'}
          />
      <Card style={{marginBottom: '30px'}}>
        <CardContent>
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
                  {stableCoins.filter((c) => c.chain === chain).map((option) => (
                    <MenuItem key={option.label} value={option.label}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>           
            </Grid>
            <Grid item xs={6}></Grid>
            <Grid item xs={3} justifyContent={'center'}>
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
                
                <div style={{position: 'absolute', right: 30}}>
                <Puff
                  height="30"
                  width="30"
                  ariaLabel="progress-bar-loading"
                  wrapperStyle={{}}
                  wrapperClass="progress-bar-wrapper"
                  radius={1}
                  color="#3F50B5"
                  visible={currentLoaderState}
                />
                </div>
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
      <ConfirmationStep allTx={allTx} /> 
    </div>
  )
}

export default Mint