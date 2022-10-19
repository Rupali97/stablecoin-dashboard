import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'

import useCore from "./useCore";


const useGetOwners = () => {
  const core = useCore();
  // const {chainId} = useWallet()
  const { chain} = useNetwork()

  const [response, setResponse] = React.useState([])

  const fetchData = useCallback(async () => {
    const contract = await core.contracts[`${chain?.id}`].MultiSig;
    const res = await contract.getOwners()

    setResponse(res)
  }, [chain]) 

  useEffect(() => {

    if(core){
      fetchData()
        .catch((err) => setResponse([]))
    }

  }, [fetchData])

  return response

}

export default useGetOwners