import {createReducer} from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import _ from 'lodash';

import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  saveTxn,
  SerializableTransactionReceipt,
  updateTransaction
} from './actions';

const now = () => new Date().getTime();

export interface TransactionDetails {
  // hash: string;
  approval?: { tokenAddress: string; spender: string };
  summary?: string;
  receipt?: SerializableTransactionReceipt;
  lastCheckedBlockNumber?: number;
  addedTime?: number;
  confirmedTime?: number;
  from?: string;
}

export interface TransactionState {
  [chainId: number]: 
    {
      [txIndex: number]: {
        hash: string,
        creation?: {
          // hash: string;
          approval?: { tokenAddress: string; spender: string };
          summary?: string;
          receipt?: SerializableTransactionReceipt;
          lastCheckedBlockNumber?: number;
          addedTime?: number;
          confirmedTime?: number;
          from?: string;
        },
        confirmation?: 
          { 
            // hash: string;
            from?: string;
            confirmedTime?: number;
          }
        ,
        execution?: 
          { 
            // hash: string;
            from?: string;
            confirmedTime?: number;
          }
        ,
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
        
      },
    }

}

export interface TxnData {
  hash: string[];
}

 
export interface newTxnState {
  [chainId: number]:
    {
      [txIndex: number]: TxnData
    }

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

export const initialState: newTxnState = {};

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (transactions, {payload: 
        {chainId, txDetail, txIndex, hash, creation, confirmation, execution}}) => {
        if (transactions[chainId]?.[txIndex]) {
          throw Error('Attempted to add existing transaction.');
        }
        let txs = transactions[chainId] ?? {};
        // txs[txIndex] = {txDetail, hash, creation, confirmation, execution};

        // let creationTxns = transactions[chainId][txIndex].creation ?? {};
        // const {hash, approval, summary, from, addedTime, confirmedTime} = creation.txHash
        // creationTxns[creation.txHash.hash] = {hash, approval, summary, from, addedTime: now(), confirmedTime};

        // let confirmationTxns = transactions[chainId][txIndex].confirmation ?? {};
        // const {hash: confirmHash, approval: confirmApproval, summary: confirmSummary, from: confirmFrom, addedTime: confirmAddedTime, confirmedTime: confirmConTime} = confirmation.txHash;
        // confirmationTxns[confirmation.txHash.hash] = {hash: confirmHash, approval: confirmApproval, summary: confirmSummary, from: confirmFrom, addedTime: now(), confirmedTime: confirmConTime}

        // let executionTxns = transactions[chainId][txIndex].execution ?? {};
        // const {hash: executeHash, approval: executeApproval, summary: executeSummary, from: executeFrom, addedTime: executeAddedTime, confirmedTime: executeConTime} = execution.txHash;
        // executionTxns[execution.txHash.hash] = {hash: executeHash, approval: executeApproval, summary: executeSummary, from: executeFrom, addedTime: now(), confirmedTime: executeConTime}

        // txs[txIndex] = {creation: creationTxns, confirmation: confirmationTxns, execution: executionTxns, txDetail}

        transactions[chainId] = txs;
      },
    )
    .addCase(
      updateTransaction,
      (transactions, {payload: 
        {chainId, from, hash, approval, summary, txDetail}}) => {
        // if (transactions[chainId]?.[hash]) {
        //   throw Error('Attempted to add existing transaction.');
        // }
        
        // let txs = transactions[chainId] ?? {};
        // const mappedTxns = Object.entries(txs)
        // const index = mappedTxns.findIndex(obj => obj[1].txDetail.txIndex == txDetail.txIndex)
        // mappedTxns.splice(index, 1)
        // txs = Object.fromEntries(mappedTxns) 
               
        // txs[hash] = {hash, approval, summary, from, addedTime: now(), txDetail};
        // transactions[chainId] = txs;

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
    .addCase(finalizeTransaction, (transactions, {payload: {chainId, txIndex, from, hash, creation, confirmation, execution}}) => {
      const tx = transactions[chainId]?.[txIndex];
      if (!tx) {
        return;
      }

      // tx.creation = {receipt: creation.receipt, confirmedTime: Date.now(),}

      // tx.creation.hash.receipt = receipt;
      // tx.creation.hash.confirmedTime = now();
    })
    .addCase(saveTxn, (transactions, {payload: {txIndex, hash, chainId}}) => {
      let txs = transactions[chainId] ?? {};

      if(_.isEmpty(txs) || !txs[txIndex]){
        txs[txIndex] = {hash: [hash]}
      }else {
        txs[txIndex].hash.push(hash)
      }

      transactions[chainId] = txs;

    })
);
