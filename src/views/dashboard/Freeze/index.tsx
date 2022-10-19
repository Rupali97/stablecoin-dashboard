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
import { stableCoins } from '../Mint';
import { useGetActiveBlockChain } from '../../../state/chains/hooks';
import useFreezeToken from '../../../hooks/useFreezeToken';
import useUnFreezeToken from '../../../hooks/useUnFreezeToken';
import ProgressModal from '../../../components/ProgressModal';
import useCore from '../../../hooks/useCore';

function Freeze() {
  const {tokens, _activeNetwork} = useCore()
  const { chain: chainName} = useNetwork()
  
  const currentLoaderState = useGetLoader()
  const updateLoader = useUpdateLoader()
  const chain = useGetActiveBlockChain()

  const [adddressToFreeze, setAddressToFreeze] = useState<string>('')
  const [adddressToUnFreeze, setAddressToUnFreeze] = useState<string>('')
  const [stableCoin, setStableCoin] = useState<string>('')
  const [stableCoinUnfreeze, setStableCoinUnfreeze] = useState<string>('')

  const freezeAction = useFreezeToken(adddressToFreeze, stableCoin)
  const unFreezeAction = useUnFreezeToken(adddressToUnFreeze, stableCoin)

  const handleCoinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStableCoin(event.target.value);
  };

  console.log('stableCoin', stableCoin)

  const handleFreeze = () => {
    freezeAction()
    updateLoader(true)
  }

  const handleUnFreeze = () => {
    unFreezeAction()
    updateLoader(true)
  }

  const disableFreeze = adddressToFreeze && stableCoin
  const disableUnFreeze = adddressToUnFreeze && stableCoinUnfreeze

  return (
    <div style={{marginLeft: '260px', marginRight: '20px', position: 'relative'}}>
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
            <Grid item xs={6}>
              <TextField
                helperText="This is the address to be frozen."
                required
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAddressToFreeze(e.target.value)}
                value={adddressToFreeze}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid item xs={6}>
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
              
              {/* <div style={{position: 'absolute', right: 30}}>
              <Puff
                height="30"
                width="30"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                radius={1}
                color={`#444`}
                visible={currentLoaderState}
              />
              </div> */}
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
            <Grid item xs={6}>
              <TextField
                helperText="This is the address to be unfrozen."
                required
                label="Address"
                // margin="dense"
                type="text"
                onChange={(e:any) => setAddressToUnFreeze(e.target.value)}
                value={adddressToUnFreeze}
                fullWidth
                // variant="outlined"
                size={'small'}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                  helperText="This is the stable coin to be unfrozen."
                  required
                  select
                  label="Stablecoin"
                  value={stableCoinUnfreeze}
                  onChange={(e) => setStableCoinUnfreeze(e.target.value)}
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
            <Grid item xs={9}></Grid>
            <Grid item xs={3}>
                      
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
              
              {/* <div style={{position: 'absolute', right: 30}}>
              <Puff
                height="30"
                width="30"
                ariaLabel="progress-bar-loading"
                wrapperStyle={{}}
                wrapperClass="progress-bar-wrapper"
                radius={1}
                color={`#444`}
                visible={currentLoaderState}
              />
              </div> */}
            </Button>      
            </Grid>
          </Grid>
          
        </CardContent>

      </Card>
    </div>
  )
}

export default Freeze