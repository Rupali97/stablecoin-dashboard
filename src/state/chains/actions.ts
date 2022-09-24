import {createAction} from '@reduxjs/toolkit';

export const updateChainId = createAction<{ chainId: number }>('app/updateChainId');

export const updateBlockchain = createAction<{chain: string}>('app/updateBlockchain')

export const updateAvailableChains = createAction<{ chains: Array<number> }>(
  'app/updateAvailableChains',
);
