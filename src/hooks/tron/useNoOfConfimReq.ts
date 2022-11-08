import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { tronMultiSigContract } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
import useCore from "../useCore";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useNoOfConfimReq = () => {
    const {tronWeb} = useCore()
  
    const [response, setResponse] = useState<number>(0)
  
    const fetchData = useCallback(async () => {
        let contract = await tronWeb.contract().at(tronMultiSigContract)

        const response = await contract.required().call()
       
        setResponse(response.toNumber())

    }, []) 
  
    useEffect(() => {
        fetchData()
            .catch((err) => setResponse(0))
  
    }, [fetchData])
  
    return response
}

export default useNoOfConfimReq

