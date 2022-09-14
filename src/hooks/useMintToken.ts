import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useWallet } from "use-wallet";
import { addPopup } from "../state/application/actions";
import { useTransactionAdder } from "../state/transactions/hooks";
import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";

import useCore from "./useCore";

const useMintToken = (address: string, amount: BigNumber, token: string) => {
  const core = useCore();
  const {chainId} = useWallet()
  const addTransaction = useTransactionAdder();

  return useCallback(
    async (onSuccess: () => void, onFailure: () => void): Promise<void> => {
      
      try {
        const contract = core.contracts[`${chainId}`][token];
        const response = await contract.mint(address, amount)

        addTransaction(response, {
          summary: `Mint ${Number(getDisplayBalance(amount, 18, 3)).toLocaleString()}
          `,
        });

        const tx = await response.wait();

        if (tx?.status === 1) onSuccess();
        if (tx?.status !== 1) onFailure();

      } catch (e: any) {
        console.log('useMintToken error', e);
        onFailure();
        addPopup({
          content: {
            error: {
              message: formatErrorMessage(e?.data?.message || e?.message),
              stack: e?.stack,
            }
          }
        });
      }
    },
    [core, amount, addTransaction, address, token],
  );
}

export default useMintToken

