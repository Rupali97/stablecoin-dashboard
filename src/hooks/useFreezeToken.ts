import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from "wagmi";
import { useAddPopup, useUpdateLoader } from "../state/application/hooks";

import { getDisplayBalance } from "../utils/formatBalance";
import formatErrorMessage from "../utils/formatErrorMessage";
import useCore from "./useCore";
 
const useFreezeToken = () => {
  const core = useCore();
  const { chain } = useNetwork();
  const updateLoader = useUpdateLoader();
  const addPopup = useAddPopup();

  const freeze = async (to: string, stableCoin: string) => {
    try {
      const contract = await core.contracts[`${chain?.id || core._activeNetwork}`][stableCoin];
      console.log("contract", contract)
      const res = await contract.freeze(to);
      const tx = await res.wait();

      if (tx?.status === 1) {
        let summary = "Wallet address is frozen!";

        updateLoader(false);
        addPopup({
          txn: {
            hash: tx.transactionHash,
            success: true,
            summary,
          },
        });
      }
    } catch (e: any) {
      updateLoader(false);
      console.log("useFreezeToken error", e);
      addPopup({
        error: {
          message: formatErrorMessage(e?.data?.message || e?.message),
          stack: e?.stack,
        },
      });
    }
  }

  return freeze
}
export default useFreezeToken;
