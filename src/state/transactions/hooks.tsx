import {TransactionResponse} from '@ethersproject/providers';
import {useCallback, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useWallet} from 'use-wallet';

import {useAddPopup} from '../application/hooks';
import {AppDispatch, AppState} from '../index';

import {addTransaction, clearAllTransactions, updateTransaction} from './actions';
import {DashboardTxnDetails, TransactionDetails} from './reducer';
import {useGetActiveChainId} from "../chains/hooks";
import { BigNumber } from 'ethers';

/**
 * Helper that can take a ethers library transaction response and
 * add it to the list of transactions.
 */
export function useTransactionAdder(): (
  response: TransactionResponse,
  transDetail: {
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
  customData?: { summary?: string; approval?: { tokenAddress: string; spender: string } },
) => void {
  const {chainId, account} = useWallet();
  const dispatch = useDispatch<AppDispatch>();
  const addPopup = useAddPopup();

  return useCallback(
    (
      response: TransactionResponse,
      transDetail: {
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
      {
        summary,
        approval,
      }: { summary?: string; approval?: { tokenAddress: string; spender: string } } = {},
    ) => {
      if (!account) return;
      if (!chainId) return;

      const {hash} = response;

      const {_numConfirmations, _typeOfTx, _createdTime, _executed, _value, _token, txIndex, _executedTime, _to} = transDetail

      if (!hash) {
        throw Error('No transaction hash found.');
      }

      addPopup(
        {
          txn: {
            hash,
            loading: true,
            success: false,
            summary: summary,
          },
        },
        hash,
      );

      dispatch(addTransaction({hash, from: account, chainId, approval, summary, txDetail: {
        _numConfirmations, _typeOfTx, _createdTime, _executed, _value, _token, txIndex, _executedTime, _to
      }}));
    },
    // eslint-disable-next-line
    [dispatch, chainId, account],
  );
}

export function useTransactionUpdater(): (
  response: TransactionResponse,
  transDetail: {
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
  customData?: { summary?: string; approval?: { tokenAddress: string; spender: string } },
) => void {
  const {chainId, account} = useWallet();
  const dispatch = useDispatch<AppDispatch>();
  const addPopup = useAddPopup();

  return useCallback(
    (
      response: TransactionResponse,
      transDetail: {
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
      {
        summary,
        approval,
      }: { summary?: string; approval?: { tokenAddress: string; spender: string } } = {},
    ) => {
      if (!account) return;
      if (!chainId) return;

      const {hash} = response;

      const {_numConfirmations, _typeOfTx, _createdTime, _executed, _value, _token, txIndex, _executedTime, _to} = transDetail

      if (!hash) {
        throw Error('No transaction hash found.');
      }

      addPopup(
        {
          txn: {
            hash,
            loading: true,
            success: false,
            summary: summary,
          },
        },
        hash,
      );

      dispatch(updateTransaction({hash, from: account, chainId, approval, summary, txDetail: {
        _numConfirmations, _typeOfTx, _createdTime, _executed, _value, _token, txIndex, _executedTime, _to
      }}));
    },
    // eslint-disable-next-line
    [dispatch, chainId, account],
  );
}

// Returns all the transactions for the current chain.
export function useAllTransactions(): { [txHash: string]: TransactionDetails } {
  const {chainId} = useWallet();
  const state = useSelector<AppState, AppState['transactions']>((state) => state.transactions);

  return chainId ? state[chainId] ?? {} : {};
}

export function useIsTransactionPending(transactionHash?: string): boolean {
  const transactions = useAllTransactions();
  if (!transactionHash || !transactions[transactionHash]) {
    return false;
  }
  return !transactions[transactionHash].receipt;
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetails): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000;
}

// Returns whether a token has a pending approval transaction.
export function useHasPendingApproval(
  tokenAddress: string | undefined,
  spender: string | undefined,
): boolean {
  const allTransactions = useAllTransactions();
  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(allTransactions).some((hash) => {
        const tx = allTransactions[hash];
        if (!tx) return false;
        if (tx.receipt) {
          return false;
        } else {
          const approval = tx.approval;
          if (!approval) return false;
          return (
            approval.spender === spender &&
            approval.tokenAddress === tokenAddress &&
            isTransactionRecent(tx)
          );
        }
      }),
    [allTransactions, spender, tokenAddress],
  );
}

export function useClearAllTransactions(): { clearAllTransactions: () => void } {
  const activeChainId = useGetActiveChainId()
  const dispatch = useDispatch<AppDispatch>();
  return {
    clearAllTransactions: useCallback(() => dispatch(clearAllTransactions({chainId: activeChainId})), [
      activeChainId,
      dispatch,
    ]),
  };
}
