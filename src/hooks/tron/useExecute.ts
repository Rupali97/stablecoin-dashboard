import { BigNumber } from "ethers";
import { useCallback } from "react";
import { getDisplayBalance } from "../../utils/formatBalance";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useExecute = () => {

    const confirmCallback = async (index: number) => {
      
        try {
            const trc20TokenAddress = "TQFw44XRvTyZ9VqxiQwcJ8udYMJ4p5MWUE"; 
            const trcMultSigContract = "TGfdcKi7vMi86ceXxrUYyAopvqEUKFHojE"
            let contract = await window.tronWeb.contract().at(trcMultSigContract)
    
            const response = await contract.executeTransaction(index).send()
           
            console.log('response', response)
    
        } catch (e: any) {
            console.log('useExecute error', e);
    
        }
      }
    
      return confirmCallback
}

export default useExecute

