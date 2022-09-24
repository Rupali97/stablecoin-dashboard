import {useWallet} from 'use-wallet';
import React, {createContext, useEffect, useState} from 'react';

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
  const {ethereum, account} = useWallet();
  const [core, setCore] = useState<Protocol>();
  const dispatch = useDispatch();


  useEffect(() => {
    if (!core && config) {
      const newCore = new Protocol(config, chainId);
      if (account) {
        newCore.unlockWallet(ethereum, account);
      }
      setCore(newCore);
    } else if (account && core) {
      core.unlockWallet(ethereum, account);
    }
  }, [account, core, dispatch, ethereum, chainId]);

  // @ts-ignore
  return <Context.Provider value={{core}}>{children}</Context.Provider>;
};
