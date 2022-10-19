import {BigNumber, Contract, utils} from 'ethers';
import {useCallback, useEffect, useState} from 'react';
import { useAccount } from 'wagmi'

import ABIS from '../protocol/deployments/abi';
import {useWallet} from 'use-wallet';
import useCore from './useCore';

export type TokenDetailsState = {
  isLoading: boolean,
  value: {
    symbol: string;
    decimals: number;
    balance: BigNumber;
    totalSupply: BigNumber;
  }
}

const LOADING_DEFAULT_BASIC_STATE = {
  isLoading: true,
  value: {
    symbol: '',
    decimals: 18,
    balance: BigNumber.from(0),
    totalSupply: BigNumber.from(0)
  }
}

const NON_LOADING_DEFAULT_BASIC_STATE = {
  isLoading: false,
  value: {
    symbol: '',
    decimals: 18,
    balance: BigNumber.from(0),
    totalSupply: BigNumber.from(0)
  }
}

const useGetTokenDetails = () => {
  // const [fetchingDetails, setFetchingDetails] = useState<boolean>(false);
  const [tokenDetails, setTokenDetails] = useState<TokenDetailsState>(LOADING_DEFAULT_BASIC_STATE);

  const core = useCore();
  // const {myAccount: account, provider } = core

  const { address: account } = useAccount()


  const fetch = async (address: string) => {
    if (!utils.isAddress(address) || !account) {
      setTokenDetails(NON_LOADING_DEFAULT_BASIC_STATE);
      console.log("useGetTokenDetails if")
    } else {

      // setFetchingDetails(true);
      // console.log('provider', core.provider)
      const contract = new Contract(address, ABIS.ERC20, core.signer);
      const symbol = await contract.symbol();
      const decimals = await contract.decimals();
      const balance = await contract.balanceOf(account);
      const totalSupply = await contract.totalSupply()

      // console.log("useGetTokenDetails else", symbol, decimals, balance, totalSupply)

      // setFetchingDetails(false);
      setTokenDetails({isLoading: false, value: {symbol, decimals: decimals, balance, totalSupply}});
      return({isLoading: false, value: {symbol, decimals: decimals, balance, totalSupply}})
    }
  }

  // useEffect(() => {
  //   if (core && address) {
  //     fetch().catch((err) => {
  //       setFetchingDetails(false);
  //       setTokenDetails(NON_LOADING_DEFAULT_BASIC_STATE);
  //       console.error(
  //         `Failed to fetch token details of ${address} for ${address}: ${err.stack} `,
  //       );
  //     });
  //   } else {
  //     setFetchingDetails(false);
  //     setTokenDetails(NON_LOADING_DEFAULT_BASIC_STATE);
  //   }
  // }, [address, core, fetch]);

  return {fetch, tokenDetails};
};

export default useGetTokenDetails;
