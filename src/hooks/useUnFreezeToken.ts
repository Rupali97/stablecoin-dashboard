import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from "wagmi";
import { useAddPopup, useUpdateLoader } from "../state/application/hooks";

import { getDisplayBalance } from "../utils/formatBalance";
import useCore from "./useCore";

const useUnFreezeToken = () => {
  const core = useCore();
  const { chain } = useNetwork();
  const updateLoader = useUpdateLoader();
  const addPopup = useAddPopup();

  const unfreeze = async (to: string, stableCoin: string) => {
    try {
      const contract = await core.contracts[`${chain?.id || core._activeNetwork}`][stableCoin];
      console.log("contract", contract, stableCoin)

      const res = await contract.unfreeze(to);
      const tx = await res.wait();

      if (tx?.status === 1) {
        let summary = "Wallet address is unfrozen!";
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
      console.log("useUnFreezeToken error", e);
      addPopup({
        error: {
          message: e?.data?.message || e?.message,
          stack: e?.stack,
        },
      });
    }
  }

  return unfreeze
};

export default useUnFreezeToken;
