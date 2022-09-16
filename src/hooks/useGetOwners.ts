import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import useCore from "./useCore";


const useGetOwners = () => {
  const core = useCore();
  const {chainId} = useWallet()

  const [response, setResponse] = React.useState([])

  const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chainId}`].MultiSig;
        const res = await contract.getOwners()

        setResponse(res)
  }, [chainId]) 

  useEffect(() => {

    if(core){
        fetchData()
            .catch((err) => setResponse([]))
    }

  }, [fetchData])

  return response

}

export default useGetOwners