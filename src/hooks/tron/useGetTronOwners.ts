import _ from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { tronMultiSigContract } from "../../utils/constants";
import useCore from "../useCore";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetTronOwners = () => {
  const {tronWeb} = useCore()
  
  const [response, setResponse] = React.useState<any>([])

  const fetchOwners = useCallback(async () => {

    let contract = await tronWeb.contract().at(tronMultiSigContract)
    
    const res = await contract.getOwners().call()
    
    res.map(async(owner) => {
      let txnRes = tronWeb.address.fromHex(`${owner}`);
      setResponse(prev => _.uniqWith([...prev, txnRes], (arrVal, othVal) => arrVal == othVal))
    })

  }, []) 

  useEffect(() => {
    fetchOwners()
      .catch((err) => setResponse([]))
  }, [fetchOwners])

  return response

}

export default useGetTronOwners