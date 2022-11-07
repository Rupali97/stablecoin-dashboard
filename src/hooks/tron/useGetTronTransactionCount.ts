import React, { useCallback, useEffect, useMemo } from "react";
import { tronMultiSigContract } from "../../utils/constants";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetTronTransactionCount = () => {

  const [response, setResponse] = React.useState<any>()
  

  const fetchData = useCallback(async () => {
    let contract = await window.tronWeb.contract().at(tronMultiSigContract)
    const res = await contract.transactionCount().call()
    console.log("useGetTronTransactionCount", res.toNumber())
    setResponse(res.toNumber())
  }, []) 

  useEffect(() => {
      fetchData()
        .catch((err) => setResponse([]))
  }, [fetchData])

  return response

}

export default useGetTronTransactionCount