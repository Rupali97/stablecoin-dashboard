import {useWallet} from 'use-wallet';
import React, {createContext, useEffect, useState} from 'react';
import { useProvider } from 'wagmi'
import { useAccount } from 'wagmi'

import config from '../../config';
import {Protocol} from '../../protocol';
import {useGetActiveChainId} from '../../state/chains/hooks';
import {useDispatch} from "react-redux";

export interface ProtocolContext {
  core: Protocol;
}

// @ts-ignore
export const Context = createContext<ProtocolContext>({core: null});

interface IProps {
  children: any;
}

export const ProtocolProvider = (props: IProps) => {
  const {children} = props;
  const chainId = useGetActiveChainId();
  // const {ethereum} = useWallet();
  const [core, setCore] = useState<Protocol>();
  const dispatch = useDispatch();
  const provider = useProvider()
  const { address: account } = useAccount()

  // console.log('ethereum', ethereum)
  useEffect(() => {
    console.log("provider", !core, config, account)
    if (!core && config) {
      const newCore = new Protocol(config, chainId);
      console.log("provider if1", newCore)

      if (account) {
        newCore.unlockWallet(window.ethereum, account);
      }
      setCore(newCore);
    } else if (account && core) {
      console.log("provider elseif")

      core.unlockWallet(window.ethereum, account);
    }
  }, [account, core, dispatch, window.ethereum, chainId]);

  // @ts-ignore
  return <Context.Provider value={{core}}>{children}</Context.Provider>;
};
