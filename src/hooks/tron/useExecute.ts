import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useAddPopup } from "../../state/application/hooks";
import { tronMultiSigContract } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useExecute = () => {
    const addPopup = useAddPopup()

    const confirmCallback = async (index: number) => {
      
        try {
            let contract = await window.tronWeb?.contract().at(tronMultiSigContract)
    
            const response = await contract.executeTransaction(index).send()    
        } catch (e: any) {
            console.log('useExecute error', e);
            addPopup({
                error: {
                  message: "Transaction failed",
                  stack: e?.stack,
                },
              });
        }
      }
    
      return confirmCallback
}

export default useExecute

