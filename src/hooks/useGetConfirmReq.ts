import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import useCore from "./useCore";


const useGetConfirmReq = () => {
  const core = useCore();
  const {chainId} = useWallet()

  const [response, setResponse] = React.useState('')

  const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chainId}`].MultiSig;
        const res = await contract.numConfirmationsRequired()
        setResponse(res.toNumber())
  }, [chainId]) 

  useEffect(() => {

    if(core){
        fetchData()
            .catch((err) => setResponse(''))
    }

  }, [fetchData])

  return response

}

export default useGetConfirmReq