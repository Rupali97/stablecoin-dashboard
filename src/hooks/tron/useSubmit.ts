import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import { useAddPopup, useUpdateLoader } from "../../state/application/hooks";
import { tronMultiSigContract } from "../../utils/constants";
import { formatToBN, getDisplayBalance } from "../../utils/formatBalance";
import formatErrorMessage from "../../utils/formatErrorMessage";
import useCore from "../useCore";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useSubmit = (typeOfTx: string,
  to: string,
  amount: string,
  destinationAdrs: string) => {
  
  const addPopup = useAddPopup()
  const updateLoader = useUpdateLoader();
  
  return useCallback(
    async () => {
      
      try {
        let summary, parameter, triggerContractRes, data

        if (typeOfTx == "mint" || typeOfTx == "burn"){
          parameter = [
            {type:'address',value: to},{type:'uint256',value: ethers.utils.parseEther(amount)}
          ] 
          triggerContractRes = await window.tronWeb?.transactionBuilder.triggerSmartContract(destinationAdrs, `${typeOfTx}(address,uint256)`, {},
            parameter, window.tronWeb?.defaultAddress.base58);
          data = `0x${triggerContractRes.transaction.raw_data.contract[0].parameter.value.data}`
          summary = `Submitted to ${typeOfTx == "mint" ? "Mint" : "Burn"} ${Number(amount)} token`
        }else {
          if (typeOfTx == "changeRequirement"){
            parameter = [{type: 'uint256', value: amount}]
            triggerContractRes = await window.tronWeb?.transactionBuilder.triggerSmartContract(destinationAdrs, `${typeOfTx}(uint256)`, {},
            parameter, window.tronWeb?.defaultAddress.base58);
            data = `0x${triggerContractRes.transaction.raw_data.contract[0].parameter.value.data}`
            summary = "Submitted to change requirement";
          }else {
            parameter = [{type: 'address', value: to}]
            triggerContractRes = await window.tronWeb?.transactionBuilder.triggerSmartContract(destinationAdrs, `${typeOfTx}(address)`, {},
            parameter, window.tronWeb?.defaultAddress.base58);
            data = `0x${triggerContractRes.transaction.raw_data.contract[0].parameter.value.data}`
            if (typeOfTx == "addOwner") summary = "Submitted to add owner"
            if (typeOfTx == "removeOwner")
              summary = "Submitted to remove owner";
          }
        }

        let contract = await window.tronWeb?.contract().at(tronMultiSigContract)

        const response = await contract.submitTransaction(destinationAdrs,
        formatToBN(0),
        data).send()
        let txnInfo = await window.tronWeb?.trx.getTransaction(response);
        updateLoader(false);
        // if (typeOfTx == "mint" || typeOfTx == "burn") {
        //   let tokenDetails = await fetch(destinationAdrs);
        //   summary = `Submitted to ${
        //     typeOfTx == "mint" ? "Mint" : "Burn"
        //   } ${Number(amount)}`;
        // }

        if(txnInfo.ret[0].contractRet == "SUCCESS"){
          addPopup({
            txn: {
              hash: response,
              success: true,
              summary
            }
          });
        }
      } catch (e: any) {
        console.log('useSubmit error', e);
        updateLoader(false);

        addPopup({
          error: {
            message: "Transaction failed",
            stack: e?.stack,
          },
        });
      }
    },
    [amount, to, typeOfTx],
  );
}

export default useSubmit

