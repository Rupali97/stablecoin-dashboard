import React, { useCallback, useEffect, useMemo } from "react";
// import { tronWeb } from "../../views/dashboard/TestTron";

const useGetAllTronTxns = () => {

  const [response, setResponse] = React.useState<any>([])
  

  const fetchData = useCallback(async () => {
    const trcMultSigContract = "TGfdcKi7vMi86ceXxrUYyAopvqEUKFHojE"
    let contract = await window.tronWeb.contract().at(trcMultSigContract)
    
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