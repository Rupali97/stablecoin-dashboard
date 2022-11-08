import React, { useCallback, useEffect, useMemo } from "react";
import { tronMultiSigContract } from "../../utils/constants";
import useCore from "../useCore";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetAllTronTxns = () => {
  const {tronWeb} = useCore()

  const [response, setResponse] = React.useState<any>([])
  

  const fetchData = useCallback(async () => {
    let contract = await tronWeb.contract().at(tronMultiSigContract)
    
    const res = await contract.getTransactionCount().call()
    
    for(let i=0; i < res; i++){
      let txn =  await contract.getTransaction(i).call()
      
      setResponse((prevState) => [...prevState, txn]);
    }


  }, []) 

  useEffect(() => {
      fetchData()
        .catch((err) => setResponse([]))
  }, [fetchData])

  return response

}

export default useGetAllTronTxns