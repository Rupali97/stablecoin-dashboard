import { useEffect } from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet';
import { SnackbarProvider } from "notistack";
import {Provider} from "react-redux";
import dotenv from 'dotenv'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
  wallet
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { useAccount, useSwitchNetwork, useNetwork } from 'wagmi'

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
import { useGetActiveChainId, useGetUpdateActiveChainId } from './state/chains/hooks';
import { ethers } from 'ethers';
import { alchemyProvider } from 'wagmi/providers/alchemy'

dotenv.config()


// Rainbowkit starts
const { chains, provider } = configureChains(
  [chain.mainnet, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_GOERLI_API_KEY}),
    // publicProvider()
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.injected({ chains }),
      wallet.rainbow({ chains }),
      wallet.metaMask({chains}),
      wallet.ledger({chains})
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const WalletProvider = ({ children }: any) => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <Updaters/>
        <ProtocolProvider>
          <AppContent>{children}</AppContent>
        </ProtocolProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

// Rainbow kit code ends


const Providers: React.FC = ({children}) => {
  return (
    <Provider store={store}>
      <WalletProvider>{children}</WalletProvider>
    </Provider>

  );
};

const AppContent: React.FC = ({children}) => {

  const core = useCore()
  const { chain } = useNetwork()
  const { isConnected } = useAccount()

  const newprovider = new ethers.providers.Web3Provider(window.ethereum, "any");

  newprovider.on("network", (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    if (oldNetwork) {
        window.location.reload();
    }
  });

  console.log('core', core)

  // const {ethereum, chainId} = useWallet();
  const setChainId = useGetUpdateActiveChainId();


  useEffect(() => {
    if (isConnected) 
      // @ts-ignore
      setChainId(chain.id)
  }, [isConnected]);

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

  return (
    <Providers>
      <Navigation />
    </Providers>
  );
}

export default App;
