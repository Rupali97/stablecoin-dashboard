import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useWallet } from "use-wallet";
import {Button, MenuItem, Snackbar, TextField} from '@material-ui/core'
import { useAccount, useSwitchNetwork, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TronWeb from "tronweb"
import styles from '../../styles/adminStyle.js'
import Sidebar from './Sidebar';
import { noOp } from '../../utils/constants';
import { truncateMiddle } from '../../utils/index';
import Navigation from '../../navigation';
import { useGetActiveBlockChain, useHandleBlokchainChange } from '../../state/chains/hooks';
import useCore from '../../hooks/useCore';

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
  const {myAccount} = useCore()

  // const { address: account, isConnecting, isDisconnected, connector } = useAccount()
  // const { data, error, isLoading, pendingChainId, switchNetwork, status, isSuccess } = useSwitchNetwork()
  // const { chain  } = useNetwork()
  // const { isConnected } = useAccount()
  const [tronObj, setTronObj] = useState<any>()
  const [tronSnackbar, setTronSnackbar] = useState<boolean>(false)

  useEffect(() => {
    checkIfTronConnected()
  }, [])

  // const { tronLink } = window;
  const chain = useGetActiveBlockChain()
  const setChain = useHandleBlokchainChange()


  useEffect(() => {
    if(myAccount){
      setChain("Goerli")
    }else{
      setChain("Nile")
    }

  },[myAccount])

  const loginWithTron = () => {
    if(window.tronWeb.ready){
      console.log("show account")
      setChain("Nile");
      document.location.href = ""
    }else{
      setTronSnackbar(true)
    }
  }

  const handleChainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChain(event.target.value);
  };

  const checkIfTronConnected = async() => {
    // let res = await window.tronLink.ready
    console.log("checkIfTronConnected",!myAccount)
  }

  var obj = setInterval(() => {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(obj)
        var tronweb = window.tronWeb
        setTronObj(tronweb)
      }
  }, 10)


  if(window.location.href.includes("login")) return <div />
  return (
 
    <div>
      <div className={classes.wrapper} style={{padding: '15px 15px 40px 0'}}>
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
                  style={{backgroundColor: "#fff", color: "#000"}}
                  onClick={() => setTronSnackbar(true)}
                >
                  {
                   tronObj ?  window.tronWeb.defaultAddress.base58.slice(0, 3) + '...' + window.tronWeb.defaultAddress.base58.slice(31, 34)
                    : "Tronlink Wallet"
                  }
                </button>
                : 
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <ConnectButton />
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
