import {createReducer} from '@reduxjs/toolkit';

import {ChainIdInitialState, BlockChaianitialState} from '../../utils/chains/constant';

import {updateChainId, updateBlockchain} from './actions';

export const chainId = createReducer(ChainIdInitialState, (builder) =>
    builder
      .addCase(updateChainId, (chainsConfig, {payload: {chainId}}) => {
        chainsConfig.active = chainId;
      })
  /* .addCase(updateAvailableChains, (chainsConfig, {payload: {chains}}) => {
     chainsConfig.availableNetworks = chains;
   }),*/
);

export const blockChain = createReducer(BlockChaianitialState, (builder) =>
    builder
      .addCase(updateBlockchain, (blockChainConfig, {payload: {chain}}) => {
        blockChainConfig.active = chain;
      })
);

