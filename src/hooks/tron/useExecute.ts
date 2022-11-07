import { BigNumber } from "ethers";
import { useCallback } from "react";
import { tronMultiSigContract } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useExecute = () => {

    const confirmCallback = async (index: number) => {
      
        try {
            let contract = await window.tronWeb.contract().at(tronMultiSigContract)
    
            const response = await contract.executeTransaction(index).send()
           
            console.log('response', response)
    
        } catch (e: any) {
            console.log('useExecute error', e);
    
        }
      }
    
      return confirmCallback
}

export default useExecute

