import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'

import useCore from "./useCore";


const useGetConfirmReq = () => {
  const core = useCore();
  // const {chainId} = useWallet()
  const { chain} = useNetwork()

  const [response, setResponse] = React.useState('')

  const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        const res = await contract.numConfirmationsRequired()
        setResponse(res.toNumber())
  }, [chain]) 

  useEffect(() => {

    if(core){
        fetchData()
            .catch((err) => setResponse(''))
    }

  }, [fetchData])

  return response

}

export default useGetConfirmReq