import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { tronMultiSigContract } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useNoOfConfimReq = () => {
  
    const [response, setResponse] = useState<number>(0)
  
    const fetchData = useCallback(async () => {
        let contract = await window.tronWeb.contract().at(tronMultiSigContract)

        const response = await contract.numConfirmationsRequired().call()
       
        setResponse(response.toNumber())

    }, []) 
  
    useEffect(() => {
        fetchData()
            .catch((err) => setResponse(0))
  
    }, [fetchData])
  
    return response
}

export default useNoOfConfimReq

