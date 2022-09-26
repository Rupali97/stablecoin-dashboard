import React, { useState } from 'react'
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
import { formatToBN, getBalance } from '../../../utils/formatBalance';
import { chains, stableCoins } from '../Mint';
import ConfirmationStep from '../../../components/ConfirmationStep';
import useMultiSig from '../../../hooks/useMultiSig';
import useGetAllMultiSigTxns from '../../../hooks/useGetAllMultiSigTxns';
import useGetOwners from '../../../hooks/useGetOwners';
import useCore from '../../../hooks/useCore';
import { BigNumber } from 'ethers';
import useGetAllTronTxns from '../../../hooks/tron/useGetAllTronTxns';
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import useSubmit from '../../../hooks/tron/useSubmit';
import Textfield from '../../../components/Textfield';
import { useAllTransactions } from '../../../state/transactions/hooks';

function Burn() {

  const core = useCore()
  const { myAccount } = core
  const chain = useGetActiveBlockChain()
  const allTransactions = useAllTransactions()
  
  let contractOwners: any = useGetOwners()
  let allTx = Object.entries(allTransactions)?.map((key) => key[1])?.filter((tx) => tx.txDetail._typeOfTx == 1)

  // let allTronTxns = useGetAllTronTxns()
  // allTronTxns = allTronTxns.filter((tx) => tx._typeOfTx.toNumber() == 1)

  // console.log('allTronTxns', allTronTxns)
  
  const [adddress, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  
  const burnTokenAction = useMultiSig(adddress, formatToBN(amount), stableCoin, BigNumber.from('1'))
  const submitTronTxnAction = useSubmit(adddress, formatToBN(amount), stableCoin, BigNumber.from('1'))


  const submitTx = async() => {

    if(chain == 'MaticMumbai'){
      burnTokenAction(() =>{}, () => {})
    }
    if(chain == "Neil"){
      submitTronTxnAction()
    }
  }
 
  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const disableSubmitBtn = amount && stableCoin && chain && contractOwners?.includes(myAccount)

  return (
    <div style={{marginLeft: '260px', marginRight: '20px'}}>
    <Textfield
      text={'Burn the Stablecoin'}
      fontSize={'24px'}
      fontWeight={'bold'}
      className={'m-b-15'}
      />
      <Card style={{marginBottom: '15px'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                helperText="This is the address to which token to be burned"
                required
                id="outlined-email"
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAddress(e.target.value)}
                value={adddress}
                fullWidth
                size='small'
                // variant="outlined"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                helperText="This is the amount of token to be burned"
                required
                label="Amount"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAmount(e.target.value)}
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
                {stableCoins.filter((c) => c.chain === chain).map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
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
                fullWidth>
                Submit
              </Button>
            </Grid>
          </Grid>
         
         
        </CardContent>

      </Card>
      
      {/* {
        chain == "MaticMumbai" ?
        <ConfirmationStep allTx={allTx} /> :
        <ConfirmationStep allTx={allTronTxns} />

      } */}
      <ConfirmationStep allTx={allTx} /> 
      
    </div>
  )
}

export default Burn