import { BigNumber } from "ethers";
import { useCallback } from "react";

import useCore from "./useCore";

const useBurnToken = (amount: BigNumber) => {
  const core = useCore();
  const contract = core.contracts["Token"];

  console.log('contract', contract)
  const action = useCallback(
      async (callback?: () => void): Promise<void> => {
  
        try {
          const response = await contract.burn(amount)
          console.log('response', response)
  
          if (callback) callback();
        } catch (e: any) {
          console.log('useBurnToken e', e)
         

        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [core, amount],
    )
    
    return action;
}

export default useBurnToken