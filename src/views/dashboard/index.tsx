import React, { useEffect, useState } from 'react'
import { Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useWallet } from "use-wallet";
import {Button, MenuItem, Snackbar, TextField} from '@material-ui/core'
import { useAccount, useSwitchNetwork, useNetwork } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import styles from '../../styles/adminStyle.js'
import Sidebar from './Sidebar';
import { noOp } from '../../utils/constants';
import { truncateMiddle } from '../../utils/index';
import Navigation from '../../navigation';
import { useGetActiveBlockChain, useHandleBlokchainChange } from '../../state/chains/hooks';

export const chains = [
  {
    label: 'MaticMumbai',
    chainID: 'MaticMumbai'
  },
  // {
  //   label: "Neil",
  //   chainID: 'Neil',
  // }
]

// @ts-ignore
const useStyles = makeStyles(styles);
function Dashbaord() {

  const { address: account, isConnecting, isDisconnected, connector } = useAccount()
  const { data, error, isLoading, pendingChainId, switchNetwork, status, isSuccess } = useSwitchNetwork()
  const { chain, chains,  } = useNetwork()
  const { isConnected } = useAccount()

  console.log('isConnected', isConnected)

  console.log('connector', connector)
  console.log('chain', chain)

  // useEffect(() => {
  //   connectWalletOnPageLoad()
  // },[])

  // const { connect, connector, account } = useWallet();
  // const { tronLink } = window;
  // const chain = useGetActiveBlockChain()
  // const setChain = useHandleBlokchainChange()

  const [connectMetamask, setConnectMetamask] = useState(true)

  // const connectWalletOnPageLoad = async () => {
  //   if (localStorage?.getItem('isWalletConnected') === 'true') {
  //     try {
  //       await connect('injected')
  //     } catch (ex) {
  //       console.log(ex)
  //     }
  //   }
  // }

  // const handleChainChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setChain(event.target.value);

  // };

  return (
 
    <div style={{padding: '15px 15px 40px 0'}}>
      <div style={{display: 'flex', justifyContent: 'flex-end'}}>
        <ConnectButton />
      </div>

      {
        !account && 
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
            open={connectMetamask}
            onClose={() => setConnectMetamask(false)}
            message="Please connect to the Metamask on MumbaiTestnet"
          />
      }
      {/* <div style={{padding: '28px', display: 'flex', justifyContent: 'flex-end'}}>
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
          !account ? (
            <Button
              variant="contained"
              color="primary"
              onClick={connector === "injected" ? noOp : () => {
                connect('injected')
                  .then(() => {
                    console.log('Connected', account)                  
                    localStorage.setItem('isWalletConnected', 'true')
                    localStorage.removeItem('disconnectWallet')

                  })
                  .catch((e) => {
                    console.log('Connection error', e)
                  })
              }}
            >
              Connect Wallet
            </Button>
            
          ) :
          (
            <Button
              variant="contained"
              color="primary"
              onClick={() => console.log('account address click')}
            >
              {chain == 'MaticMumbai' ?  
                truncateMiddle(account, 12, '...') : 
                window.tronWeb.defaultAddress.base58.slice(0, 3) + '...' + window.tronWeb.defaultAddress.base58.slice(31, 34)
              }
            </Button>
          )
        }
      </div> */}

      <Sidebar />
      <Outlet />
    </div>

  )
}

export default Dashbaord