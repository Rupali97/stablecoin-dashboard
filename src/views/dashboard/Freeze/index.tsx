import {useEffect, useState} from 'react'
import {
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  MenuItem
} from "@material-ui/core";
import {Puff} from "react-loader-spinner"
import { useNetwork } from 'wagmi'
import Textfield from '../../../components/Textfield'
import { useGetLoader, useUpdateLoader } from '../../../state/application/hooks';
import {useMediaQuery} from "react-responsive";
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import useFreezeToken from '../../../hooks/useFreezeToken';
import useUnFreezeToken from '../../../hooks/useUnFreezeToken';
import ProgressModal from '../../../components/ProgressModal';
import useCore from '../../../hooks/useCore';
import { tronStableCoins } from '../../../utils/constants';
import useFreezeTokenTron from '../../../hooks/tron/useFreezeTokenTron';
import useUnFreezeTokenTron from '../../../hooks/tron/useUnFreezeTokenTron';
import { ethers } from 'ethers';

function Freeze() {
  const {tokens, _activeNetwork} = useCore()
  const { chain: chainName} = useNetwork()
  const isMobile = useMediaQuery({maxWidth: '600px'});
  
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()
  const chain = useGetActiveBlockChain()

  const [addressToFreeze, setAddressToFreeze] = useState<string>('')
  const [addressToUnFreeze, setAddressToUnFreeze] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [stableCoinUnfreeze, setStableCoinUnfreeze] = useState<string>('')

  const freezeAction = useFreezeToken()
  const unFreezeAction = useUnFreezeToken()

  const freezeActionTron = useFreezeTokenTron()
  const unFreezeActionTron = useUnFreezeTokenTron()

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  const handleUnfreezeCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoinUnfreeze(event.target.value);
  };

  const handleFreeze = () => {
    if(chain == "Goerli"){
      freezeAction(addressToFreeze, stableCoin)
    }else {
      freezeActionTron(addressToFreeze, stableCoin)
    }
    updateLoader(true)
  }

  const handleUnFreeze = () => {
    if(chain == "Goerli"){
      unFreezeAction(addressToUnFreeze, stableCoinUnfreeze)
    }else {
      unFreezeActionTron(addressToFreeze, stableCoin)
    }
    updateLoader(true)
  }

  const disableFreeze = stableCoin && addressToFreeze && chain == "Goerli" ? ethers.utils.isAddress(addressToFreeze) : window.tronWeb?.isAddress(addressToFreeze)
  const disableUnFreeze = stableCoinUnfreeze && addressToUnFreeze  && chain == "Goerli" ? ethers.utils.isAddress(addressToUnFreeze) : window.tronWeb?.isAddress(addressToUnFreeze)
  
  return (
    <div style={{marginLeft: isMobile ? "20px" : '260px', marginRight: '20px', position: 'relative'}}>
      <ProgressModal currentLoaderState={currentLoaderState} />
      <Textfield
        text={'Freeze a wallet'}
        fontSize={'24px'}
        fontWeight={'bold'}
        className={'m-b-15'}
        />
      <Card style={{marginBottom: '30px'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <TextField
                helperText="This is the address to be frozen."
                required
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAddressToFreeze(e.target.value)}
                value={addressToFreeze}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                  helperText="This is the stable coin to be frozen."
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
                    chain == "Goerli" ?
                      Object.entries(tokens[chainName?.id || _activeNetwork]).map((option) => (
                      <MenuItem key={option[1].symbol} value={option[1].symbol}>
                        {option[1].symbol}
                      </MenuItem>
                    )) :
                    tronStableCoins.map((option) => (
                      <MenuItem key={option.symbol} value={option.contractAdrs}>
                        {option.symbol}
                      </MenuItem>
                    ))
                }
                </TextField> 
            </Grid>
            <Grid item xs={8} md={9}></Grid>
            <Grid item xs={4} md={3}>
                      
            <Button
              onClick={handleFreeze}
              variant="contained"
              color="primary"
              fullWidth
              disabled={!disableFreeze}
              style={{position: 'relative'}}
            >
              <div>
                Freeze
              </div>
            </Button>      
            </Grid>
          </Grid>
          
        </CardContent>

      </Card>

      <Textfield
        text={'Unfreeze a wallet'}
        fontSize={'24px'}
        fontWeight={'bold'}
        className={'m-b-15'}
        />
      <Card style={{marginBottom: '30px'}}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                helperText="This is the address to be unfrozen."
                required
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAddressToUnFreeze(e.target.value)}
                value={addressToUnFreeze}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                  helperText="This is the stable coin to be unfrozen."
                  required
                  select
                  label="Stablecoin"
                  value={stableCoinUnfreeze}
                  onChange={handleUnfreezeCoinChange}
                  fullWidth
                  // variant="outlined"
                  size='small'
                >
                   {
                    chain == "Goerli" ?
                      Object.entries(tokens[chainName?.id || _activeNetwork]).map((option) => (
                      <MenuItem key={option[1].symbol} value={option[1].symbol}>
                        {option[1].symbol}
                      </MenuItem>
                    )) :
                    tronStableCoins.map((option) => (
                      <MenuItem key={option.symbol} value={option.contractAdrs}>
                        {option.symbol}
                      </MenuItem>
                    ))
                  }
                </TextField> 
            </Grid>
            <Grid item xs={8} md={9}></Grid>
            <Grid item xs={4} md={3}>
                      
            <Button
              onClick={handleUnFreeze}
              variant="contained"
              color="primary"
              fullWidth
              disabled={!disableUnFreeze}
              style={{position: 'relative'}}
            >
              <div>
                Unfreeze
              </div>
            </Button>      
            </Grid>
          </Grid>
          
        </CardContent>

      </Card>
    </div>
  )
}

export default Freeze