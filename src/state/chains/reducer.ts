import {createReducer} from '@reduxjs/toolkit';

import {ChainIdInitialState} from '../../utils/chains/constant';

import {updateChainId} from './actions';

export default createReducer(ChainIdInitialState, (builder) =>
    builder
      .addCase(updateChainId, (chainsConfig, {payload: {chainId}}) => {
        chainsConfig.active = chainId;
      })
  /* .addCase(updateAvailableChains, (chainsConfig, {payload: {chains}}) => {
     chainsConfig.availableNetworks = chains;
   }),*/
);
