import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'

import { getDisplayBalance } from "../utils/formatBalance";
import useCore from "./useCore";


const useGetTokenBalance = () => {
  const core = useCore();
  // const {chainId} = useWallet()
  const { chain} = useNetwork()

  let balance
  const fetchData = async (address: string, stableCoin: string) => {
    const contract = await core.contracts[`${chain?.id || core._activeNetwork}`][stableCoin];
    const res = await contract.balanceOf(address)
    console.log("useGetTokenBalance res", res)
    balance = getDisplayBalance(res)

    return balance
  }


  return {fetchData}

}

export default useGetTokenBalance