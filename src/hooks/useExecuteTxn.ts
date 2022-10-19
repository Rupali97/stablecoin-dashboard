import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'
import {useDispatch, useSelector} from 'react-redux';

import { useAddPopup, useUpdateLoader } from "../state/application/hooks";
import { useTransactionUpdater } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";
import useCore from "./useCore";
import {AppDispatch, AppState} from "../state/index";
import { saveTxn } from "../state/transactions/actions";

const useExecuteTxn = () => {
  const core = useCore();
  const { chain} = useNetwork()
  const updateTransaction = useTransactionUpdater();
  const addPopup = useAddPopup()
  const dispatch = useDispatch<AppDispatch>();
  const updateLoader = useUpdateLoader()

  const executeCallback = async (index: number, typeOfTx: string) => {
      
    try {
      const contract = await core.contracts[`${chain?.id}`].MultiSig;
      const response = await contract.executeTransaction(index)
      const tx = await response.wait();

    setTimeout(async() => {
      if (tx?.status === 1){
        updateLoader(false)
        dispatch(saveTxn({txIndex: index, hash: tx.transactionHash, chainId: chain?.id || core._activeNetwork}))
        let summary = `Executed ID ${index}`

        addPopup({
          txn: {
            hash: tx.transactionHash,
            success: true,
            summary
          }
        });
       
      }
    }, 1000)

    } catch (e: any) {
      console.log('useExecuteTxn error', e);
      updateLoader(false)

      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message),
          stack: e?.stack,
        }
      });
    }
  }

  return executeCallback
}

export default useExecuteTxn

