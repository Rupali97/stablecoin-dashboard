import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { addPopup } from "../state/application/actions";
import { useAddPopup } from "../state/application/hooks";
import { useTransactionUpdater } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";
import useCore from "./useCore";
 
const useConfirmTxn = () => {
  const core = useCore();
  const {chainId} = useWallet()
  const updateTransaction = useTransactionUpdater();
  const addPopup = useAddPopup()

  const confirmCallback = async (index: number, typeOfTx) => {
      
    try {
      const contract = await core.contracts[`${chainId}`].MultiSig;
      const response = await contract.confirmTransaction(index)
      console.log('useConfirmTxn response', response)

      const tx = await response.wait();
      console.log('useConfirmTxn tx', tx)

    setTimeout(async() => {
      if (tx?.status === 1){
        const txnsCount = await contract.getTransactionCount()
        console.log('useConfirmTxn txnsCount', txnsCount, tx?.status === 1)
  
        const txDetail = await contract.getTransaction(txnsCount - 1)
        console.log('useConfirmTxn txDetail', txDetail)
  
        if(typeOfTx == 0){
          console.log('useConfirmTxn inside if 0')
  
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
            summary: `Confirm mint transaction id ${index}`,
          });
        }else {
          console.log('useConfirmTxn inside else')
  
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
            summary: `Confirm burn transaction id ${index}`,
          });
        }
      }
    }, 4000)

    } catch (e: any) {
      console.log('useConfirmTxn error', e);
      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message),
          stack: e?.stack,
        }
      });
    }
  }

  return confirmCallback
}

export default useConfirmTxn

