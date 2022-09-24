import { BigNumber } from "ethers";
import { useCallback } from "react";
import { getDisplayBalance } from "../../utils/formatBalance";
// import { tronWeb } from "../../views/dashboard/TestTron";


const useSubmit = (to: string, amount: BigNumber, token: string, typeOfTx: BigNumber) => {

  return useCallback(
    async () => {
      
      try {

        const trc20TokenAddress = "TQFw44XRvTyZ9VqxiQwcJ8udYMJ4p5MWUE"; 
        const trcMultSigContract = "TGfdcKi7vMi86ceXxrUYyAopvqEUKFHojE"
        let contract = await window.tronWeb.contract().at(trcMultSigContract)

        const response = await contract.submitTransaction(to, amount, trc20TokenAddress, typeOfTx).send()
       
        console.log('response', response)
       
      } catch (e: any) {
        console.log('useSubmit error', e);
      }
    },
    [amount, to, token, typeOfTx],
  );
}

export default useSubmit

