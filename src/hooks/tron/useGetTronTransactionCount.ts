import React, { useCallback, useEffect, useMemo } from "react";
import { tronMultiSigContract } from "../../utils/constants";

import useCore from "../useCore";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetTronTransactionCount = () => {

  const {tronWeb} = useCore()

  const [response, setResponse] = React.useState<any>()
  
  const fetchData = useCallback(async () => {
    let contract = await tronWeb.contract().at(tronMultiSigContract)
    const res = await contract.transactionCount().call()
    console.log("useGetTronTransactionCount", res.toNumber())
    setResponse(res.toNumber())

  }, []) 

  useEffect(() => {
      fetchData()
        .catch((err) => {
          console.error("useGetTronTransactionCount", err)
          setResponse(0)
        })
  }, [fetchData])

  return response

}

export default useGetTronTransactionCount