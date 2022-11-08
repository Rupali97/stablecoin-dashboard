const env = process.env.REACT_APP_ENV;

const Config = {
  version: 'v1.0.0',
  chain: {
    privateKey: process.env.REACT_APP_TRONLINK_PRIVATE_KEY,
    fullHost: 'https://api.trongrid.io'
  },
  trongrid: {
    host: 'https://api.trongrid.io',
    key: 'xxxxxx'
  },
  service: {},
  contract: {
    usdt: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  },
  defaultDecimal: 6,
  tronLinkTime: 8,
  justSwap: 'https://justswap.org/',
  tronscanUrl: 'https://tronscan.io/#'
};

const devConfig = {
    chain: {
      privateKey: process.env.REACT_APP_TRONLINK_PRIVATE_KEY,
      fullHost: 'https://api.nileex.io'
    },
    service: {},
    contract: {
      usdt: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
    },
    justSwap: 'https://justswap.org/',
    tronscanUrl: 'https://nile.tronscan.io/#'
  };

export default devConfig;
