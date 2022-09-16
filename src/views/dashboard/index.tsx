import React, { useEffect } from 'react'
import { Outlet } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useWallet } from "use-wallet";
import {Button} from '@material-ui/core'
import styles from '../../styles/adminStyle.js'
import Sidebar from './Sidebar';
import { noOp } from '../../utils/constants';
import { truncateMiddle } from '../../utils/index';
import Navigation from '../../navigation';


// @ts-ignore
const useStyles = makeStyles(styles);
function Dashbaord({tronNw}) {

  useEffect(() => {
    connectWalletOnPageLoad()
  },[])

  const { connect, connector, account } = useWallet();
  
  const classes = useStyles();

  const connectWalletOnPageLoad = async () => {
    if (localStorage?.getItem('isWalletConnected') === 'true') {
      try {
        await connect('injected')
      } catch (ex) {
        console.log(ex)
      }
    }
  }

  console.log('tronNw', tronNw)
  console.log('account', account)
  return (
 
    <div>
      <div>
        <div style={{textAlign: 'right', padding: '20px'}}>
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
                {tronNw == 'MaticMumbai' ?  
                  truncateMiddle(account, 12, '...') : 
                  window.tronWeb.defaultAddress.base58.slice(0, 3) + '...' + window.tronWeb.defaultAddress.base58.slice(31, 34)
                }
              </Button>
            )
          }
        </div>

      <Sidebar />

      {/* <div className={classes.mainPanel}>
        <div className={classes.content}>

        </div>
      </div> */}
    </div>
      <Outlet />
    </div>

  )
}

export default Dashbaord