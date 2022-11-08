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
} from "@material-ui/core";
import validator from "validator";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDisconnect } from 'wagmi'
import { useAccount, useSwitchNetwork, useNetwork } from 'wagmi'
import {useMediaQuery} from "react-responsive";

import '../../styles/authStyle.css'
import { useHandleBlokchainChange } from '../../state/chains/hooks';
import useCore from '../../hooks/useCore';

function Auth() {
  const { disconnect } = useDisconnect()
  const setChain = useHandleBlokchainChange()
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
  const { isConnected } = useAccount()
  const {myAccount} = useCore()
  const isMobile = useMediaQuery({maxWidth: '768px'});


  const loginWithTron = () => {
    if(!window.tronWeb.ready){
      setShowSnackbar(true)
      
    }else{
      console.log("show account")
      setChain("Nile");
      localStorage.setItem("ActiveChain", "Nile")
      document.location.href = ""
    }
    
  }

  if(isConnected){
    document.location.href = ""
    localStorage.setItem("ActiveChain", "Goerli")
  }
 
  return (
    <div id={!isMobile ? 'auth' : ''} style={{padding: isMobile ? "100px 0" : ""}} >
       {
        showSnackbar && 
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
            open={showSnackbar}
            onClose={() => setShowSnackbar(false)}
            message={`Please login to TronLink extention wallet first. If you don't have then please download from the link below!`}
            action={
              <React.Fragment>
                <a style={{color: '#fff'}} href={'https://chrome.google.com/webstore/detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec'}>Tronlink wallet</a>
              </React.Fragment>
            }
          />
      }
       <div className="auth-container">
      <Grid container>
        <Grid item xs={12} sm={3}></Grid>
        <Grid item xs={12} sm={6}>
          <Card className="auth-container-card">
            <CardContent>
              <Typography align={"center"} gutterBottom variant="h5" component="h2">
                Welcome to Stablecoin Dashboard
              </Typography>
              <Typography align={"center"} variant="body2" color="textSecondary" style={{marginBottom: '60px'}} >
                <p>
                  Please login to one of the wallet below.
                </p>
              </Typography>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>
                  <ConnectButton chainStatus={"none"} />
                </div>
                <div>
                  <button
                    onClick={loginWithTron}
                    className={"tronlinkBtn"}
                    style={{padding: '11px'}}
                  >
                    Tronlink Wallet
                  </button>
                </div>
              </div>
              
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}></Grid>
      </Grid>
     
    </div>
    </div>
  )
}

export default Auth