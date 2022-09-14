import {Configuration} from '../utils/interface';

const configurations: { [env: string]: Configuration } = {
    80001: {
        networkName: 'Matic Mumbai Testnet',
        networkDisplayName: 'Polygon testnet',
        chainId: 80001,
        etherscanUrl: 'https://mumbai.polygonscan.com',
        defaultProvider:
          'https://matic-mumbai.chainstacklabs.com',
        deployments: require('../protocol/deployments/maticMumbai.json'),
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
}

export default configurations;