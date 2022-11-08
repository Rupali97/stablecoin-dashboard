import { BigNumber, ethers } from "ethers";
import { useCallback } from "react";
import { useAddPopup, useUpdateLoader } from "../../state/application/hooks";
import { mainchain, multisigContract, triggerSmartContract } from "../../utils/blockchain";
import { tronMultiSigContract } from "../../utils/constants";
import { formatToBN, getDisplayBalance } from "../../utils/formatBalance";
import formatErrorMessage from "../../utils/formatErrorMessage";
import useCore from "../useCore";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useSubmit = (typeOfTx: string,
  to: string,
  amount: string,
  destinationAdrs: string) => {

  const {tronWeb} = useCore()

  
  const addPopup = useAddPopup()
  const updateLoader = useUpdateLoader();
  
  return useCallback(
    async () => {
      
      try {
        let summary, parameter, functionSelector, data

        if (typeOfTx == "mint" || typeOfTx == "burn"){
          parameter = [{type:'address',value: to},{type:'uint256',value: ethers.utils.parseEther(amount)}] 
          summary = `Submitted to ${typeOfTx == "mint" ? "Mint" : "Burn"} ${Number(amount)} token`
          functionSelector = `${typeOfTx}(address,uint256)`
        }
        else {
          if (typeOfTx == "changeRequirement"){
            parameter = [{type: 'uint256', value: amount}]
            summary = "Submitted to change requirement";
            functionSelector = `${typeOfTx}(uint256)`
          }else {
            parameter = [{type: 'address', value: to}]
            functionSelector = `${typeOfTx}(address)`
            if (typeOfTx == "addOwner") summary = "Submitted to add owner"
            if (typeOfTx == "removeOwner")
              summary = "Submitted to remove owner";
          }
        }

        const transaction = await triggerSmartContract(
          `${destinationAdrs}`,
          functionSelector,
          Object.assign({ feeLimit: 20 * 1e6 }, {}),
          parameter
        );

        data = `0x${transaction.transaction.raw_data.contract[0].parameter.value.data}`

        let contract = await tronWeb.contract().at(tronMultiSigContract)
        const response = await contract.submitTransaction(destinationAdrs,
          formatToBN(0),
          data).send()

        let txnInfo = await mainchain.trx.getTransaction(response);
        updateLoader(false);

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
            message: e,
            stack: e,
          },
        });
      }
    },
    [amount, to, typeOfTx],
  );
}

export default useSubmit

