import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { addPopup } from "../state/application/actions";
import { useTransactionAdder } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";

import useCore from "./useCore";

const useConfirmTxn = () => {
  const core = useCore();
  const {chainId} = useWallet()
  const addTransaction = useTransactionAdder();

  const confirmCallback = async (index: number) => {
      
    try {
      const contract = await core.contracts[`${chainId}`].MultiSig;
      const response = await contract.confirmTransaction(index)

      console.log('useConfirmTxn response', response)

      addTransaction(response, {
        summary: `Confirm Mint`,
      });

    } catch (e: any) {
      console.log('useConfirmTxn error', e);
      addPopup({
        removeAfterMs: 10000,
        content: {
          error: {
            message: formatErrorMessage(e?.data?.message || e?.message),
            stack: e?.stack,
          }
        }
      });
    }
  }

  return confirmCallback
}

export default useConfirmTxn

