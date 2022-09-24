import { BigNumber } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { getDisplayBalance } from "../../utils/formatBalance";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useNoOfConfimReq = () => {
  
    const [response, setResponse] = useState('')
  
    const fetchData = useCallback(async () => {
        const trc20TokenAddress = "TQFw44XRvTyZ9VqxiQwcJ8udYMJ4p5MWUE"; 
        const trcMultSigContract = "TGfdcKi7vMi86ceXxrUYyAopvqEUKFHojE"
        let contract = await window.tronWeb.contract().at(trcMultSigContract)

        const response = await contract.numConfirmationsRequired().call()
       
        setResponse(response.toNumber())

    }, []) 
  
    useEffect(() => {
        fetchData()
            .catch((err) => setResponse(''))
  
    }, [fetchData])
  
    return response
}

export default useNoOfConfimReq

