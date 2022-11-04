import _ from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { tronMultiSigContract } from "../../utils/constants";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetTronOwners = () => {

  const [response, setResponse] = React.useState<any>([])

  const fetchOwners = useCallback(async () => {

    let contract = await window.tronWeb.contract().at(tronMultiSigContract)
    
    const res = await contract.getOwners().call()
    
    console.log("useGetTronOwners", res)

    res.map(async(owner) => {
      console.log("txnRes", owner)
      let txnRes = window.tronWeb.address.fromHex(`${owner}`);
      setResponse(prev => _.uniqWith([...prev, txnRes], (arrVal, othVal) => arrVal == othVal))
      console.log("txnRes", txnRes)
    })

  }, []) 

  useEffect(() => {
    fetchOwners()
      .catch((err) => setResponse([]))
  }, [fetchOwners])

  return response

}

export default useGetTronOwners