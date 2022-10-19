import {Configuration} from '../utils/interface';

const configurations: { [env: string]: Configuration } = {
    5: {
        networkName: 'Goerli Testnet',
        networkDisplayName: 'Goerli testnet',
        chainId: 5,
        etherscanUrl: 'https://goerli.etherscan.io',
        defaultProvider:
          'https://goerli.infura.io/v3/3a9a6018905e45669f505505420d81d6',
        deployments: require('../protocol/deployments/goerli.json'),
        refreshInterval: 10000,
        gasLimitMultiplier: 1.1,
        blockchainToken: 'ETH',
        blockchainTokenName: 'ETH',
        blockchainTokenDecimals: 18,
        networkSetupDocLink: 'https://docs.polygon.technology/docs/develop/metamask/config-polygon-on-metamask/',
        supportedTokens: [
          "USDB"
        ], 
        decimalOverrides: {

        },
      },
}

export default configurations;