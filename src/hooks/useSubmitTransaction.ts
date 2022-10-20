import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'
import {useDispatch, useSelector} from 'react-redux';

import { useAddPopup, useUpdateLoader } from "../state/application/hooks";
import { useTransactionAdder } from "../state/transactions/hooks";
import { truncateMiddle } from "../utils";
import { formatToBN, getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";
import {AppDispatch, AppState} from "../state/index";
import useCore from "./useCore";
import { saveTxn } from "../state/transactions/actions";
import USDA from "../protocol/deployments/abi/USDA.json"
import MultiSig from "../protocol/deployments/abi/MultiSig.json"
import useGetTokenDetails from "./useGetTokenDetails";
import { useGetActiveChainId } from "../state/chains/hooks";

const useMultiSig = (typeOfTx: string, to: string, amount: string, destinationAdrs: string) => {

  const core = useCore();
  const {_activeNetwork} = core
  const updateLoader = useUpdateLoader()
  const activeID = useGetActiveChainId()
  console.log("activeID", activeID)

  const { chain} = useNetwork()
  const dispatch = useDispatch<AppDispatch>();

  const addTransaction = useTransactionAdder();
  const addPopup = useAddPopup()
  const {fetch} = useGetTokenDetails();
  
  return useCallback(
    async (onSuccess: () => void, onFailure: () => void): Promise<void> => {
      
      try {
        // typeOfTx // mint, burnFrom, addOwner, removeOwner, replaceOwner, changeRequirement

        let iface
        let data

        if(typeOfTx == "mint" || typeOfTx == "burnFrom"){
          iface = new ethers.utils.Interface(USDA)
          data = iface.encodeFunctionData(typeOfTx, [to, ethers.utils.parseEther(amount)])
        }else{
          iface = new ethers.utils.Interface(MultiSig)
          if(typeOfTx == "changeRequirement"){
            data = iface.encodeFunctionData(typeOfTx, [Number(amount)])
            console.log("changeRequirement", data)
          }else {
            data = iface.encodeFunctionData(typeOfTx, [to])
          }
        }

        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        const response = await contract.submitTransaction(core.contracts[`${chain?.id}`][destinationAdrs].address , formatToBN(0), data)        
        const tx = await response.wait();

        setTimeout(async() => {
          if (tx?.status === 1) {
            
            let txnsCount = await contract.transactionCount()
            let summary
            
 
            dispatch(saveTxn({txIndex: txnsCount - 1, hash: tx.transactionHash, chainId: chain?.id || _activeNetwork }))

            if(typeOfTx == "mint" || typeOfTx == "burnFrom"){
              let tokenDetails = await fetch(destinationAdrs)
              summary = `Submitted to ${typeOfTx == "mint" ? "Mint" : "Burn"} ${Number(amount)} ${tokenDetails?.value.symbol}`
            }

            if(typeOfTx == "addOwner") summary = "Submitted to add owner"
            if(typeOfTx == "removeOwner") summary = "Submitted to remove owner"
            if(typeOfTx == "changeRequirement") summary = "Submitted to change requirement"
            updateLoader(false)
            addPopup({
              txn: {
                hash: tx.transactionHash,
                success: true,
                summary
              }
            });
          }
        }, 1000)

        if (tx?.status !== 1) {}

      } catch (e: any) {
        console.error('useMultiSig error', e);
        onFailure();
        updateLoader(false)

        addPopup({
          error: {
            message: formatErrorMessage(e?.data?.message || e?.message),
            stack: e?.stack,
          }
        });
      }
    },
    [core, amount, addTransaction, to, destinationAdrs],
  );
}

export default useMultiSig



