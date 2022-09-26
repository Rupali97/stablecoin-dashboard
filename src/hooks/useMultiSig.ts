import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { useAddPopup } from "../state/application/hooks";
import { useTransactionAdder } from "../state/transactions/hooks";
import { truncateMiddle } from "../utils";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";

import useCore from "./useCore";

const useMultiSig = (to: string, amount: BigNumber, token: string, typeOfTx: BigNumber) => {
  const core = useCore();
  const {chainId} = useWallet()
  const addTransaction = useTransactionAdder();
  const addPopup = useAddPopup()
  
  return useCallback(
    async (onSuccess: () => void, onFailure: () => void): Promise<void> => {
      
      try {
        const contract = await core.contracts[`${chainId}`].MultiSig;
        const tokenAdrs = core.contracts[`${chainId}`][token].address
        const response = await contract.submitTransaction(to, amount, tokenAdrs, typeOfTx)
        console.log('response', response)
        
        const tx = await response.wait();
        console.log('response tx', tx)

       setTimeout(async() => {
        if (tx?.status === 1) {
          const txnsCount = await contract.getTransactionCount()
          const txDetail = await contract.getTransaction(txnsCount - 1)
          if(typeOfTx.toNumber() == 0){
            addTransaction(response, 
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
              summary: `Submitted to Mint ${Number(getDisplayBalance(amount, 18, 3)).toLocaleString()}${token}`,
            });
          }else {
            addTransaction(response, 
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
              summary: `Submitted to Burn ${Number(getDisplayBalance(amount, 18, 3)).toLocaleString()}${token}.`,
            });
          }
        }
       }, 4000)

        if (tx?.status !== 1) {}

      } catch (e: any) {
        console.log('useMultiSig error', e);
        onFailure();
        addPopup({
          error: {
            message: formatErrorMessage(e?.data?.message || e?.message),
            stack: e?.stack,
          }
        });
      }
    },
    [core, amount, addTransaction, to, token],
  );
}

export default useMultiSig

