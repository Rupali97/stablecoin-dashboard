import { HashRouter as Router } from 'react-router-dom';
import { UseWalletProvider } from 'use-wallet';
import { SnackbarProvider } from "notistack";

import dotenv from 'dotenv'
import config from './config';
import ProtocolProvider from './context/Provider';
// import ModalsProvider from './context/Modals'
import Navigation from './navigation';
import useCore from './hooks/useCore';
import Dashbaord from './views/dashboard';
dotenv.config()


const CustomizedSnackbars: React.FC<any> = () => {
  return(
    <div></div>
  )
}

const Providers = ({ children }: any) => {
  return (
    <UseWalletProvider
      // chainId={config.chainId}
      connectors={{
        injected: {
          chainId: [config.chainId],
        },
        walletconnect: {
          chainId: config.chainId,
          rpcUrl: config.defaultProvider
        }
      }}
      >
        <ProtocolProvider>
          {/* <ModalsProvider>
            <SnackbarProvider
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              maxSnack={2}
            >
              <>
                <CustomizedSnackbars />
               
              </>
            </SnackbarProvider>
          </ModalsProvider> */}
           {children}
        </ProtocolProvider>

    </UseWalletProvider>
  );
};

function App() {

  const core = useCore()

  console.log('core', core)

  if (!window.ethereum) {
    console.log('no window ethereum')
    return <div />
  };
  if (!core){
    console.log('no core');
    return <div />
  };

console.log('env', process.env.REACT_APP_TRONLINK_ACC1)

  return (
    <Providers>
      <Navigation />
    </Providers>
  );
}

export default App;
