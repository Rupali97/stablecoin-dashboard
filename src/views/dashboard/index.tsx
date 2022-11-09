import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useWallet } from "use-wallet";
import {Button, MenuItem, Snackbar, TextField} from '@material-ui/core'
import { useAccount, useSwitchNetwork, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TronWeb from "tronweb"
import {useMediaQuery} from "react-responsive";

import styles from '../../styles/adminStyle.js'
import Sidebar from './Sidebar';
import { noOp } from '../../utils/constants';
import { truncateMiddle } from '../../utils/index';
import Navigation from '../../navigation';
import { useGetActiveBlockChain, useHandleBlokchainChange } from '../../state/chains/hooks';
import useCore from '../../hooks/useCore';
import tronIcon from "../../icons/tronIcon.jpeg"
import { addressToHex, fromHex } from '../../utils/helper';
import { mainchain } from '../../utils/blockchain';

export const chains = [
  {
    label: 'Goerli',
    chainID: 'Goerli'
  },
  {
    label: "Nile",
    chainID: 'Nile',
  }
]

// @ts-ignore
const useStyles = makeStyles(styles);
function Dashbaord() {
  const classes = useStyles();
  const {myAccount, tronWeb} = useCore()
  const isMobile = useMediaQuery({maxWidth: '768px'});

  // const { address: account, isConnecting, isDisconnected, connector } = useAccount()
  // const { data, error, isLoading, pendingChainId, switchNetwork, status, isSuccess } = useSwitchNetwork()
  // const { chain  } = useNetwork()
  // const { isConnected } = useAccount()
  const [tronObj, setTronObj] = useState<any>()
  const [tronSnackbar, setTronSnackbar] = useState<boolean>(false)
  const [tronCurrentAcc, setTronCurrentAcc] = useState<string>("")

  // useEffect(() => {
  //   checkIfTronConnected()
  // }, [])

  // const { tronLink } = window;
  const chain = useGetActiveBlockChain()
  const setChain = useHandleBlokchainChange()


  useEffect(() => {
    if(!myAccount && !window.tronWeb){
      // window.location.reload()
    }
  }, [myAccount, window.tronWeb])

  const loginWithTron = () => {
    if(window.tronWeb?.ready){
      // console.log("show account")
      // setChain("Nile");
      // document.location.href = ""
    }else{
      setTronSnackbar(true)
    }
  }

  const handleChainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChain(event.target.value);
    localStorage.setItem("ActiveChain", event.target.value)

  };

  var obj = setInterval(() => {
    console.log("inside tronweb useeffect")
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      clearInterval(obj)
      var tronweb = window.tronWeb
      setTronObj(tronweb)
    }
  }, 10)

  console.log("tronObjmain", tronObj)

  window.addEventListener('message', function (e){
    if (e.data.message && e.data.message.action == "accountsChanged") {
      console.log("accountsChanged event", e.data.message)
      console.log("current address:", e.data.message.data.address)
      setTronCurrentAcc(e.data.message.data.address)
    }

  })

  
  if(window.location.href.includes("login")) return <div />
  return (
 
    <div>
      <div className={classes.wrapper} style={{padding: isMobile ? '' : '15px 15px 40px 0'}}>
      {
        tronSnackbar && 
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
            open={tronSnackbar}
            onClose={() => setTronSnackbar(false)}
            message="Please login to TronLink extention wallet first."
          />
      }

      {/* {
        (!myAccount) && 
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
            open={connectMetamask}
            onClose={() => setConnectMetamask(false)}
            message="Please connect to the Metamask on Goerli network or Tronlink on Nile network"
          />
      } */}
      <div style={{padding: '28px', display: 'flex', justifyContent: 'flex-end'}}>
        <TextField
          required
          id="standard-select-currency"
          select
          label="Chain"
          value={chain}
          onChange={handleChainChange}
          // fullWidth
          variant="outlined"
          size='small'
          style={{marginRight: '15px', width: '150px'}}
        >
          {chains.map((option) => (
            <MenuItem alignItems={"center"} key={option.chainID} value={option.label}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {
          (
            <div>
             
              {chain == 'Nile' ?  
                <button
                  className={"tronlinkBtn"}
                  style={{backgroundColor: "#fff", color: "#000", display: 'flex', justifyContent: "space-between", alignItems: "center"}}
                  onClick={loginWithTron}
                ><div><img src={tronIcon} alt={"tronIcon"} style={{width: "18px", height: "18px", borderRadius: '50%', marginRight: '6px'}} /></div>
                  {
                   tronObj ?  
                    <div> 
                      {
                        tronCurrentAcc ?
                        tronCurrentAcc.slice(0, 4) + '...' + tronCurrentAcc.slice(30, 34):
                        window.tronLink.tronWeb.defaultAddress.base58.slice(0, 4) + '...' + window.tronLink.tronWeb.defaultAddress.base58.slice(30, 34)
                      }
                      {/* {window.tronLink.tronWeb.defaultAddress.base58.slice(0, 4) + '...' + window.tronLink.tronWeb.defaultAddress.base58.slice(30, 34)} */}
                    </div>
                    
                    : <div>Tronlink Wallet</div>
                  }
                </button>
                : 
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <ConnectButton chainStatus={"none"} showBalance={false} />
                </div> 
              }
            </div>
          )
        }
      </div>

      <Sidebar />
      <Outlet />
    </div>
    </div>

  )
}

export default Dashbaord
