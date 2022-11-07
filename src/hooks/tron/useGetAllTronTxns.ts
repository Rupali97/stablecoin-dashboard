import React, { useCallback, useEffect, useMemo } from "react";
import { tronMultiSigContract } from "../../utils/constants";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetAllTronTxns = () => {

  const [response, setResponse] = React.useState<any>([])
  

  const fetchData = useCallback(async () => {
    let contract = await window.tronWeb?.contract().at(tronMultiSigContract)
    
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