import { BigNumber } from "ethers";
import { useCallback } from "react";
import { getDisplayBalance } from "../../utils/formatBalance";

// import { tronWeb } from "../../views/dashboard/TestTron";


const useConfirm = () => {

  const confirmCallback = async (index: number) => {
      
    try {
        const trc20TokenAddress = "TQFw44XRvTyZ9VqxiQwcJ8udYMJ4p5MWUE"; 
        const trcMultSigContract = "TGfdcKi7vMi86ceXxrUYyAopvqEUKFHojE"
        console.log('account', window.tronWeb.defaultAddress.base58)

        let contract = await window.tronWeb.contract().at(trcMultSigContract)

        const response = await contract.confirmTransaction(index).send()
       
        console.log('response', response, index)

    } catch (e: any) {
        console.log('useConfirm error', e);

    }
  }

  return confirmCallback
}

export default useConfirm

