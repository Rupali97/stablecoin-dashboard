import { BigNumber } from "ethers";
import { useCallback } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useNetwork } from 'wagmi'
import { addPopup } from "../state/application/actions";
import { useAddPopup, useUpdateLoader } from "../state/application/hooks";
import { useTransactionUpdater } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";
import useCore from "./useCore";
import { saveTxn } from "../state/transactions/actions";
import {AppDispatch, AppState} from "../state/index";
 
const useConfirmTxn = () => {
  const core = useCore();
  const { chain} = useNetwork()
  const updateTransaction = useTransactionUpdater();
  const addPopup = useAddPopup()
  const dispatch = useDispatch<AppDispatch>();
  const updateLoader = useUpdateLoader()

  const confirmCallback = async (index: number, typeOfTx: string) => {
      
    try {
      const contract = await core.contracts[`${chain?.id}`].MultiSig;
      const response = await contract.confirmTransaction(index)
  
      const tx = await response.wait();

      setTimeout(async() => {
        if (tx?.status === 1){
          updateLoader(false)
          dispatch(saveTxn({txIndex: index, hash: tx.transactionHash, chainId: chain?.id || core._activeNetwork}))
          let summary = `Confirmed ID ${index}`
          
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
      console.log('useConfirmTxn error', e.reason);
      updateLoader(false)

      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message || e?.reason),
          stack: e?.stack,
        }
      });
    }

  }

  return confirmCallback
}

export default useConfirmTxn

