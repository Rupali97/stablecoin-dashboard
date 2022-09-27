import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { getDisplayBalance } from "../utils/formatBalance";
import useCore from "./useCore";


const useGetTokenBalance = () => {
  const core = useCore();
  const {chainId} = useWallet()

  const [response, setResponse] = React.useState('')

  const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chainId}`].Token3;
        const res = await contract.totalSupply()
        const bal = getDisplayBalance(res)
        setResponse(bal)
  }, [chainId]) 

  useEffect(() => {

    if(core){
        fetchData()
            .catch((err) => setResponse(''))
    }

  }, [fetchData])

  return response

}

export default useGetTokenBalance