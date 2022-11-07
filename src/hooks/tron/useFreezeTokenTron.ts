import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from "wagmi";
import { useAddPopup, useUpdateLoader } from "../../state/application/hooks";

import { getDisplayBalance } from "../../utils/formatBalance";
import formatErrorMessage from "../../utils/formatErrorMessage";

 
const useFreezeTokenTron = () => {

  const updateLoader = useUpdateLoader();
  const addPopup = useAddPopup();

  const freeze = async (to: string, stableCoin: string) => {
    try {
      const contract = await window.tronWeb?.contract().at(stableCoin)
      const res = await contract.freeze(to).send()
      let txnInfo = await window.tronWeb?.trx.getTransaction(res);
      if (txnInfo.ret[0].contractRet == "SUCCESS") {
        let summary = "Wallet address is frozen!";

        updateLoader(false);
        addPopup({
          txn: {
            hash: res,
            success: true,
            summary,
          },
        });
      }
    } catch (e: any) {
      updateLoader(false);
      console.log("useFreezeTokenTron error", e);
      addPopup({
        error: {
          message: e,
          stack: e,
        },
      });
    }
  }

  return freeze
}
export default useFreezeTokenTron;
