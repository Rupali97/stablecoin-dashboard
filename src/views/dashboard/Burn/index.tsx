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
import { formatToBN } from '../../../utils/formatBalance';
import useBurnToken from '../../../hooks/useBurnToken';
import { tronWeb } from '../TestTron';
import { chains, stableCoins } from '../Mint';

function Burn() {
  
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [chain, setChain] = useState<any>('')
  const mintTokenAction = useBurnToken(formatToBN(amount))

  const burn = async() => {
    console.log('burn')

    if(chain == 'MaticMumbai'){
      mintTokenAction(() =>{})

    }

    if(chain == "Neil"){
      const trc20ContractAddress = "TFH8wQRRBo93Wjxz5ens59nV7ccLa6HZtU"; 
      let contract = await tronWeb.contract().at(trc20ContractAddress)

      let burnres = await contract.burn(formatToBN(amount)).send()
      console.log('burnres', burnres)
    }
  }

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const handleChainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChain(event.target.value);
  };

  return (
    <div style={{marginLeft: '260px', width: '600px'}}>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Burn the Stablecoin
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                required
                id="outlined-email"
                label="Amount"
                margin="dense"
                type="text"
                onChange={(e:any) => setAmount(e.target.value)}
                value={amount}
                fullWidth
              />
            </Grid>
            <Grid item xs={7}></Grid>
            <Grid item xs={5}>
              <TextField
                required
                id="standard-select-currency"
                select
                label="Stablecoin"
                value={stableCoin}
                onChange={handleCoinChange}
                fullWidth
                variant="outlined"
                size='small'
              >
                {stableCoins.filter((c) => c.chain === chain).map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>  
            </Grid>
            <Grid item xs={5}>
              <TextField
                required
                id="standard-select-currency"
                select
                label="Chain"
                value={chain}
                onChange={handleChainChange}
                fullWidth
                variant="outlined"
                size='small'
              >
                {chains.map((option) => (
                  <MenuItem key={option.chainID} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={2}>
              <Button
                onClick={burn}
                variant="contained"
                color="primary"
                fullWidth>
                Burn
            </Button>
            </Grid>
          </Grid>
         
         
        </CardContent>

      </Card>
      
    </div>
  )
}

export default Burn