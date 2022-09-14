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

import useMintToken from '../../../hooks/useMintToken';
import { formatToBN } from '../../../utils/formatBalance';
import useCore from '../../../hooks/useCore';
import ConfirmationStep from '../../../components/ConfirmationStep';
import { useWallet } from 'use-wallet';
import { BigNumber, utils } from 'ethers';
import { tronWeb } from '../TestTron';

export const stableCoins = [
  {
    label: 'Token',
    chain: 'MaticMumbai'
  },
  {
    label: 'Token2',
    chain: 'MaticMumbai'
  },
  {
    label: "T20",
    chain: 'Neil',
    contractAdrs: 'TFH8wQRRBo93Wjxz5ens59nV7ccLa6HZtU'
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

function Mint({isTronNw}) {

  const core = useCore()

  const {provider, signer } = core
  const [adddress, setAddress] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [chain, setChain] = useState<any>('')

  useEffect(() => {
    isTronNw(chain)
  }, [chain])
  
  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const handleChainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChain(event.target.value);
  };

  const mintTokenAction = useMintToken(adddress, formatToBN(amount), stableCoin)

  const mint = async() => {
    console.log('mint')

    if(chain == 'MaticMumbai'){
      mintTokenAction(() => {
        console.log('mintTokenAction')
      },
      () => {
        console.log('mintTokenAction failed')
      }
      )
    }

    if(chain == 'Neil') {
      const trc20ContractAddress = "TFH8wQRRBo93Wjxz5ens59nV7ccLa6HZtU"; 
      let contract = await tronWeb.contract().at(trc20ContractAddress)

      console.log('contract', contract)

      let mintRes = await contract.mint(adddress, formatToBN(amount)).send()
      console.log('mintRes', mintRes)
    }
  }

  const testHistory = async() => {
    const res = await provider.getLogs({address: '0xd265B941782778B023A494fe4586c54ccb2e130E'})
    console.log('res',res )
  }

  testHistory()

  const disableMint = adddress && amount && stableCoin && chain

  return (
    <div style={{marginLeft: '260px', marginRight: '20px',}}>
      <Card style={{marginBottom: '30px'}}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Mint the Stablecoin
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <TextField
                required
                id="outlined-email"
                label="Address"
                margin="dense"
                type="text"
                onChange={(e:any) => setAddress(e.target.value)}
                value={adddress}
                fullWidth
                variant="outlined"
              />
            </Grid>
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
                variant="outlined"
              />
            </Grid>
            <Grid item xs={2} style={{display: 'flex', alignItems: 'flex-end'}}>
            
            </Grid>
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
            <Grid item xs={2} style={{display: 'flex', alignItems: 'center'}}>
              <Button
                onClick={mint}
                variant="contained"
                color="primary"
                fullWidth
                disabled={!disableMint}
              >
                Mint
              </Button>
            </Grid>
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
      {/* <ConfirmationStep /> */}
    </div>
  )
}

export default Mint