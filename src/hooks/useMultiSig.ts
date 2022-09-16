import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { addPopup } from "../state/application/actions";
import { useTransactionAdder } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";

import useCore from "./useCore";

const useMultiSig = (to: string, amount: BigNumber, token: string, typeOfTx: BigNumber) => {
  const core = useCore();
  const {chainId} = useWallet()
  const addTransaction = useTransactionAdder();

  return useCallback(
    async (onSuccess: () => void, onFailure: () => void): Promise<void> => {
      
      try {
        const contract = await core.contracts[`${chainId}`].MultiSig;
        const tokenAdrs = core.contracts[`${chainId}`][token].address
        console.log('tokenAdrs', tokenAdrs)
        console.log("useMultiSig contract", contract)
        const response = await contract.submitTransaction(to, amount, tokenAdrs, typeOfTx)

        console.log('useMultiSig response', response)

        addTransaction(response, {
          summary: `Submit for Mint ${Number(getDisplayBalance(amount, 18, 3)).toLocaleString()}${token} to ${to}
          `,
        });

        const tx = await response.wait();

        if (tx?.status === 1) onSuccess();
        if (tx?.status !== 1) onFailure();

      } catch (e: any) {
        console.log('useMultiSig error', e);
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
    [core, amount, addTransaction, to, token],
  );
}

export default useMultiSig

