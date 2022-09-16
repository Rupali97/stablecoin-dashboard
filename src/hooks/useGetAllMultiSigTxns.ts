import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import useCore from "./useCore";


const useGetAllMultiSigTxns = () => {
  const core = useCore();
  const {chainId} = useWallet()

  const [response, setResponse] = React.useState<any>([])
  

  const fetchData = useCallback(async () => {
    const contract = await core.contracts[`${chainId}`].MultiSig;
    const res = await contract.getTransactionCount()
    
    for(let i=0; i < res; i++){
      let txn =  await contract.getTransaction(i)
      
      setResponse((prevState) => [...prevState, txn]);
    }


  }, [chainId]) 

  useEffect(() => {

    if(core){
        fetchData()
            .catch((err) => setResponse([]))
    }

  }, [fetchData])

  return response

}

export default useGetAllMultiSigTxns