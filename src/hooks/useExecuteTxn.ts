import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { addPopup } from "../state/application/actions";
import { useTransactionAdder } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";

import useCore from "./useCore";

const useExecuteTxn = (index: BigNumber) => {
  const core = useCore();
  const {chainId} = useWallet()
  const addTransaction = useTransactionAdder();

  return useCallback(
    async (onSuccess: () => void, onFailure: () => void): Promise<void> => {
      
      try {
        const contract = await core.contracts[`${chainId}`].MultiSig;
        const response = await contract.executeTransaction(index)

        console.log('useExecuteTxn response', response)

        addTransaction(response, {
          summary: `Execute Mint`,
        });

        const tx = await response.wait();

        if (tx?.status === 1) onSuccess();
        if (tx?.status !== 1) onFailure();

      } catch (e: any) {
        console.log('useConfirmTxn error', e);
        onFailure();
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
    },
    [core, addTransaction, index],
  );
}

export default useExecuteTxn

