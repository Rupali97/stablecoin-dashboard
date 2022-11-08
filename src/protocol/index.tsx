import {BigNumber, Contract, ethers, Overrides} from 'ethers';

import ERC20 from './ERC20';
import ABIS from './deployments/abi';
import {configKeys, Configuration} from '../utils/interface';
import {getDefaultProvider} from '../utils/provider';
import Web3 from "web3";
import TronWeb from "tronweb"

import tronConfig from '../tronConfig';

const chain = tronConfig.chain;
const privateKey = chain.privateKey;

/**
 * An API module of ARTH contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class Protocol {
  
  // @ts-ignore
  myAccount: string;

  // @ts-ignore
  web3: Web3;

  signer?: ethers.Signer;

  config: {
    [chainId: number]: Configuration;
  };

  contracts: {
    [chainId: number]: { [name: string]: Contract };
  };

  // @ts-ignore
  provider: ethers.providers.BaseProvider;

  tokens: {
    [chainId: number]: { [name: string]: ERC20 };
  };

  _activeNetwork: number;

  tronWeb: any

  tronMultisigContract: any

  constructor(cfg: { [chainId: number]: Configuration }, chainId: number) {
    this._activeNetwork = chainId;
    this.contracts = {};
    this.tokens = {};
    this.tokens = {};
    this.tronWeb = new TronWeb({
      fullHost: chain.fullHost,
      privateKey
    });

    try {
      for (const [chainIdString, config] of Object.entries(cfg)) {
        const chainId = Number(chainIdString);
        const {deployments} = config;
        this.provider = getDefaultProvider(config);
        const networkConfig: { [name: string]: Contract } = {};
        const tokens: { [name: string]: ERC20 } = {};

        for (const [name, deployment] of Object.entries(deployments)) {
          if (!deployment.abi) continue;
          //to push all erc20 tokens in tokens array
          if (cfg[chainId].supportedTokens.includes(name)) {
            tokens[name] = new ERC20(
              deployments[name].address,
              this.provider,
              name,
              cfg[chainId].decimalOverrides[name] || 18,
            );
          }
          //to push all others as contracts
          networkConfig[name] = new Contract(
            deployment.address,
            ABIS[deployment.abi],
            this.provider,
          );

        }
        this.contracts[chainId] = networkConfig;
        this.tokens[chainId] = tokens;
      }
    } catch (e) {
      console.log('Error in contracts mapping', e);
    }

    this.config = cfg;
  };

  get isUnlocked(): boolean {
    return !!this.myAccount;
  };

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    // @ts-ignore
    const newProvider = new ethers.providers.Web3Provider(provider);
    this.web3 = new Web3(provider);
    this.provider = newProvider;
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;

    for (const [chainId, contracts] of Object.entries(this.contracts)) {
      for (const [name, contract] of Object.entries(contracts)) {
        this.contracts[Number(chainId)][name] = contract.connect(this.signer);
      }
    }

    for (const tokens of Object.values(this.tokens)) {
      for (const token of Object.values(tokens)) {
        if (token && token.address) token.connect(this.signer);
      }
    }
  }

  updateActiveNetwork(chainId: number, dispatch: any) {
    this._activeNetwork = chainId;
  }

  getConfig(id: configKeys, chainId: number) {
    return this.config[chainId][id];
  }

  gasOptions(gas: BigNumber = BigNumber.from('6000000')): Overrides {
    const multiplied = Math.floor(gas.toNumber() * this.config[137]['gasLimitMultiplier']);
    return {
      gasLimit: BigNumber.from(multiplied),
    };
  };

}
