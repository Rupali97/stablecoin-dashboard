import { Configuration } from './utils/interface';

const configurations: { [env: string]: Configuration } = {
  maticMumbai: {
    networkName: 'Matic Mumbai Testnet',
    networkDisplayName: 'Polygon testnet',
    chainId: 80001,
    etherscanUrl: 'https://mumbai.polygonscan.com',
    defaultProvider:
      'https://matic-mumbai.chainstacklabs.com',
    deployments: require('./protocol/deployments/maticMumbai.json'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
    blockchainToken: 'MATIC',
    blockchainTokenName: 'MATIC',
    blockchainTokenDecimals: 18,
    networkSetupDocLink: 'https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/',
    supportedTokens: [
      "DBT"
    ], 
    decimalOverrides: {
      'ARTH-DP': 18,
      USDC: 6,
      "DBT": 18
    },
  },
  ethereum: {
    networkName: 'Ethereum',
    networkDisplayName: 'Ethereum',
    chainId: 1,
    etherscanUrl: 'https://etherscan.io',
    defaultProvider:'https://silent-black-frost.quiknode.pro/6fbee126d2692f4c84d1c11167b0d7c4a77b8fb5/',
    deployments: require('./protocol/deployments/ethereum.json'),
    refreshInterval: 10000,
    gasLimitMultiplier: 1.1,
    blockchainToken: 'MATIC',
    blockchainTokenName: 'MATIC',
    blockchainTokenDecimals: 18,
    networkSetupDocLink: 'https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/',
    supportedTokens: [
      "DBT"
    ], 
    decimalOverrides: {
      'ARTH-DP': 18,
      USDC: 6,
      "DBT": 18
    },
  },
};

export default configurations['maticMumbai' || 'ethereum'];
