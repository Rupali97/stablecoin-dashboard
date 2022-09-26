import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { useAddPopup } from "../state/application/hooks";

import { useTransactionUpdater } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";
import useCore from "./useCore";

const useExecuteTxn = () => {
  const core = useCore();
  const {chainId} = useWallet()
  const updateTransaction = useTransactionUpdater();
  const addPopup = useAddPopup()

  const executeCallback = async (index: number, typeOfTx: number) => {
      
    try {
      const contract = await core.contracts[`${chainId}`].MultiSig;
      const response = await contract.executeTransaction(index)
      const tx = await response.wait();

    setTimeout(async() => {
      if (tx?.status === 1){
        const txnsCount = await contract.getTransactionCount()
        const txDetail = await contract.getTransaction(txnsCount - 1)
  
        if(typeOfTx == 0){  
          updateTransaction(response, 
            {
              _numConfirmations: txDetail._numConfirmations.toNumber(),
              _typeOfTx: txDetail._typeOfTx.toNumber(),
              _createdTime: txDetail._createdTime.toNumber(),
              _executed: txDetail._executed,
              _value: txDetail._value,
              _token: txDetail._token,
              txIndex: txDetail.txIndex.toNumber(),
              _executedTime: txDetail._executedTime.toNumber(),
              _to: txDetail._to,
            }, 
          {
            summary: `Execute mint transaction id ${index}`,
          });
        }
        else {
  
          updateTransaction(response, 
            {
              _numConfirmations: txDetail._numConfirmations.toNumber(),
              _typeOfTx: txDetail._typeOfTx.toNumber(),
              _createdTime: txDetail._createdTime.toNumber(),
              _executed: txDetail._executed,
              _value: txDetail._value,
              _token: txDetail._token,
              txIndex: txDetail.txIndex.toNumber(),
              _executedTime: txDetail._executedTime.toNumber(),
              _to: txDetail._to,
            }, 
            {
            summary: `Execute burn transaction id ${index}`,
          });
        }
      }
    }, 4000)

    } catch (e: any) {
      console.log('useExecuteTxn error', e);
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

