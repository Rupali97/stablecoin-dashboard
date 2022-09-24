import {createLogger} from 'redux-logger';
import {load, save} from 'redux-localstorage-simple';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import { composeWithDevTools } from '@redux-devtools/extension';

import application from './application/reducer';
import transactions from './transactions/reducer';
import {blockChain, chainId} from './chains/reducer';

const PERSISTED_KEYS: string[] = ['transactions', 'slippage'];

const store = configureStore({
  reducer: {
    application,
    transactions,
    chainId,
    blockChain,
  },
  
  middleware: [
    ...getDefaultMiddleware({serializableCheck: false, thunk: false}),
    save({states: PERSISTED_KEYS}),
    createLogger(),
  ]
  ,
  preloadedState: load({states: PERSISTED_KEYS}),
}

);

export default store;

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
