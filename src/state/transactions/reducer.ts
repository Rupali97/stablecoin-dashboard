import {createReducer} from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';

import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  updateTransaction
} from './actions';

const now = () => new Date().getTime();

export interface TransactionDetails {
  hash: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime: number;
  confirmedTime?: number;
  from: string;
  txDetail: {
    _numConfirmations: any, 
    _typeOfTx: any, 
    _createdTime: any, 
    _executed: boolean, 
    _value: BigNumber, 
    _token: string, 
    txIndex: any, 
    _executedTime: any, 
    _to: string,
  },
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails;
  };
}

export interface DashboardTxnDetails {
  _numConfirmations: BigNumber, 
  _typeOfTx: BigNumber, 
  _createdTime: BigNumber, 
  _executed: boolean, 
  _value: BigNumber, 
  _token: string, 
  txIndex: BigNumber, 
  _executedTime: BigNumber, 
  _to: string
}

export const initialState: TransactionState = {};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (transactions, {payload: 
        {chainId, from, hash, approval, summary, txDetail}}) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.');
        }
       
        let txs = transactions[chainId] ?? {};

        txs[hash] = {hash, approval, summary, from, addedTime: now(), txDetail};
        transactions[chainId] = txs;
      },
    )
    .addCase(
      updateTransaction,
      (transactions, {payload: 
        {chainId, from, hash, approval, summary, txDetail}}) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.');
        }
        
        let txs = transactions[chainId] ?? {};
        const mappedTxns = Object.entries(txs)
        const index = mappedTxns.findIndex(obj => obj[1].txDetail.txIndex == txDetail.txIndex)
        mappedTxns.splice(index, 1)
        txs = Object.fromEntries(mappedTxns) 
               
        txs[hash] = {hash, approval, summary, from, addedTime: now(), txDetail};
        transactions[chainId] = txs;

      },
    )
    .addCase(clearAllTransactions, (transactions, {payload: {chainId}}) => {
      if (!transactions[chainId]) return;
      transactions[chainId] = {};
    })
    .addCase(
      checkedTransaction,
      (transactions, {payload: {chainId, hash, blockNumber}}) => {
        const tx = transactions[chainId]?.[hash];
        if (!tx) {
          return;
        }
        if (!tx.lastCheckedBlockNumber) {
          tx.lastCheckedBlockNumber = blockNumber;
        } else {
          tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber);
        }
      },
    )
    .addCase(finalizeTransaction, (transactions, {payload: {hash, chainId, receipt}}) => {
      const tx = transactions[chainId]?.[hash];
      if (!tx) {
        return;
      }
      tx.receipt = receipt;
      tx.confirmedTime = now();
    }),
);
