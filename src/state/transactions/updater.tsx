import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useWallet} from 'use-wallet';
import { useNetwork, useAccount } from 'wagmi'

import config from '../../config';
import useCore from '../../hooks/useCore';
import {getDefaultProvider} from '../../utils/provider';
import {useAddPopup, useBlockNumber, useUpdateLoader} from '../application/hooks';
import {useGetActiveChainId} from '../chains/hooks';
import {AppDispatch, AppState} from '../index';

import {checkedTransaction, finalizeTransaction} from './actions';

export function shouldCheck(
  lastBlockNumber: number,
  tx: { addedTime: number; receipt?: {}; lastCheckedBlockNumber?: number },
): boolean {
  console.log('shouldCheck', lastBlockNumber, tx)
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
  if (minutesPending > 60) {
    // Every 10 blocks if pending for longer than an hour.
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // Every 3 blocks if pending more than 5 minutes.
    return blocksSinceCheck > 2;
  } else {
    // Otherwise every block.
    return true;
  }
}

export default function Updater(): null {
  // const {chainId, ethereum} = useWallet();
  const core = useCore()

  const { chain} = useNetwork()

  let chainId

  if(chain){
    chainId = chain.id
  }

  const lastBlockNumber = useBlockNumber();
  const activeChainId = useGetActiveChainId();
  const updateLoader = useUpdateLoader()

  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector<AppState, AppState['transactions']>((state) => state.transactions);

  const transactions = chainId ? state[chainId] ?? {} : {};

  // Show d on confirm.
  const addPopup = useAddPopup();

  useEffect(() => {
    if (!chainId || !window.ethereum || !lastBlockNumber) {
      {
        console.log('updater if failed', !chainId, !window.ethereum, !lastBlockNumber, lastBlockNumber)
        return;
      }
    }

    const provider = getDefaultProvider(config[activeChainId]);

    Object.entries(transactions)
      .filter((tx, i) => shouldCheck(lastBlockNumber, {addedTime: Date.now()}))
      .forEach((tx, i) => {

        const hash = tx[1].hash[tx[1].hash.length - 1]

        provider
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              console.log("receipt if")
              dispatch(
                finalizeTransaction({
                  hash,
                  chainId,
                  txIndex: Number(tx[0]),
                  from: receipt.from,
                  creation: {
                    receipt: {
                      blockHash: receipt.blockHash,
                      blockNumber: receipt.blockNumber,
                      contractAddress: receipt.contractAddress,
                      from: receipt.from,
                      status: receipt.status,
                      to: receipt.to,
                      transactionHash: receipt.transactionHash,
                      transactionIndex: receipt.transactionIndex,
                    }
                  }

                }),
              );
              // console.log("loadertest upif")
              
              // updateLoader(false)
              // addPopup(
              //   {
              //     txn: {
              //       hash,
              //       success: receipt.status === 1,
              //       summary: transactions[tx[1].txDetail.txIndex]?.summary,
              //     },
              //   },
              //   hash,
              // );
            } else {
              console.log("receipt else")
              console.log("loader upelse")
              updateLoader(false)
              dispatch(checkedTransaction({chainId, hash, blockNumber: lastBlockNumber}));
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error);
          });
      });
  }, [chainId, window.ethereum, transactions, lastBlockNumber, dispatch, addPopup, activeChainId]);

  return null;
}
