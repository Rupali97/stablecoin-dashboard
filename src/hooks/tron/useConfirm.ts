import { BigNumber } from "ethers";
import { useCallback } from "react";
import { useAddPopup } from "../../state/application/hooks";
import { mainchain, multisigContract } from "../../utils/blockchain";
import { tronMultiSigContract } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
import useCore from "../useCore";
import { useTronGetIsExecuted } from "./useTronMultisig";

// import { tronWeb } from "../../views/dashboard/TestTron";


const useConfirm = () => {
  const {tronWeb} = useCore()
  const addPopup = useAddPopup()
  const setTronIsExecuted = useTronGetIsExecuted()
  const confirmCallback = async (index: number) => {

    console.log("useConfirm", index)
      
    try {

        let contract = await window.tronWeb.contract().at(tronMultiSigContract)
        const response = await contract.confirmTransaction(index).send()
        let txnInfo = await mainchain.trx.getTransaction(response);
        let summary
        


        if(txnInfo.ret[0].contractRet == "SUCCESS"){
          let executed = await setTronIsExecuted(index)

          console.log("useConfirm executed", executed)
          if(executed){
            summary = `Confirmed and Executed ID ${index}`
          }else {
            summary = `Confirmed ID ${index} (Not executed)`
          }
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

