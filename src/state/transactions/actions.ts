import {createAction} from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { DashboardTxnDetails } from './reducer';

export interface SerializableTransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  blockHash: string;
  transactionHash: string;
  blockNumber: number;
  status?: number;
}

export const addTransaction = createAction<{
  chainId: number;
  hash: string;
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
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  blockchain?: string;
}>('transactions/addTransaction');

export const updateTransaction = createAction<{
  chainId: number;
  hash: string;
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
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  blockchain?: string;
}>('transactions/updateTransaction')


export const clearAllTransactions = createAction<{ chainId: number }>(
  'transactions/clearAllTransactions',
);

export const finalizeTransaction = createAction<{
  chainId: number;
  hash: string;
  receipt: SerializableTransactionReceipt;
}>('transactions/finalizeTransaction');

export const checkedTransaction = createAction<{
  chainId: number;
  hash: string;
  blockNumber: number;
}>('transactions/checkedTransaction');

