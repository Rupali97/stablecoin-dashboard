import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useAddPopup } from "../../state/application/hooks";
import { tronMultiSigContract } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";

// import { tronWeb } from "../../views/dashboard/TestTron";


const useConfirm = () => {
  const addPopup = useAddPopup()
 
  const confirmCallback = async (index: number) => {
      
    try {

        let contract = await window.tronWeb.contract().at(tronMultiSigContract)
        const response = await contract.confirmTransaction(index).send()
        let txnInfo = await window.tronWeb.trx.getTransaction(response);
        let summary = `Confirmed ID ${index}`
       
        if(txnInfo.ret[0].contractRet == "SUCCESS"){
          addPopup({
            txn: {
              hash: response,
              success: true,
              summary
            }
          });
        }else{
          addPopup({
            error: {
              message: "Transaction failed",
              stack: "",
            },
          });
        }
        console.log('useConfirmcontract', response, index)

    } catch (e: any) {
        console.log('useConfirm error', e);
        addPopup({
          error: {
            message: e,
            stack: e,
          },
        });
    }
  }

  return confirmCallback
}

export default useConfirm

