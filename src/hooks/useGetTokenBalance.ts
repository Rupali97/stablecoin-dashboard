import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'

import { getDisplayBalance } from "../utils/formatBalance";
import useCore from "./useCore";


const useGetTokenBalance = (address: string, stableCoin: string) => {
  const core = useCore();
  // const {chainId} = useWallet()
  const { chain} = useNetwork()

  const [response, setResponse] = React.useState('')

  const fetchData = useCallback(async () => {
    const contract = await core.contracts[`${chain?.id}`][stableCoin];
    const res = await contract.balanceOf(address)
    console.log("useGetTokenBalance res", res)
    const bal = getDisplayBalance(res)
    setResponse(bal)
  }, [chain]) 

  return {response, fetchData}

}

export default useGetTokenBalance