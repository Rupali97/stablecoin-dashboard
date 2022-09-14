import { HashRouter as Router } from 'react-router-dom';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { SnackbarProvider } from "notistack";
import {Provider} from "react-redux";

import dotenv from 'dotenv'
import config, { getSupportedChains } from './config';
import ProtocolProvider from './context/Provider';
// import ModalsProvider from './context/Modals'
import Navigation from './navigation';
import useCore from './hooks/useCore';
import Dashbaord from './views/dashboard';
import store from './state';
import Updaters from './state/Updaters';
import ModalsProvider from './context/Modals'
import Popups from './components/Popups';
import { useGetUpdateActiveChainId } from './state/chains/hooks';
import { useEffect } from 'react';
dotenv.config()

const Providers: React.FC = ({children}) => {
  return (
    <Provider store={store}>
      <WalletProvider>{children}</WalletProvider>
    </Provider>

  );
};

const WalletProvider = ({ children }: any) => {

  return (
    <UseWalletProvider
      // chainId={config.chainId}
      connectors={{
        injected: {
          chainId: getSupportedChains(),
        },
        walletconnect: {
          chainId: config.chainId,
          rpcUrl: config.defaultProvider
        }
      }}
      >
        <Updaters/>
        <ProtocolProvider>
          <AppContent>{children}</AppContent>
        </ProtocolProvider>

    </UseWalletProvider>
  );
};

const AppContent: React.FC = ({children}) => {

  const core = useCore()

  const {ethereum, chainId} = useWallet();
  const setChainId = useGetUpdateActiveChainId();

  useEffect(() => {
    if (ethereum)
      // @ts-ignore
      ethereum.on('chainChanged', (chainId) => {
        console.log('chain changed', chainId);
        setChainId(chainId);
      });
  }, [ethereum]);

  console.log('core', core, chainId)

  if (!window.ethereum) {
    console.log('no window ethereum')
    return <div />
  };
  if (!core){
    console.log('no core');
    return <div />
  };

  return(
    <ModalsProvider>
      <SnackbarProvider
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        maxSnack={2}
        autoHideDuration={2500}
      >
        <>
          <Popups/>
          {children}
        </>
      </SnackbarProvider>
    </ModalsProvider>
  )
}

function App() {

console.log('env', process.env.REACT_APP_TRONLINK_ACC1)

  return (
    <Providers>
      <Navigation />
    </Providers>
  );
}

export default App;
