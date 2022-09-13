import { BigNumber } from "ethers";
import { useCallback } from "react";

import useCore from "./useCore";

const useMintToken = (address: string, amount: BigNumber, token: string) => {
  const core = useCore();

  console.log('token',token)
  const contract = core.contracts[token];

  console.log('useMintToken contract', contract)
  const action = useCallback(
      async (callback?: () => void): Promise<void> => {
  
        try {
          const response = await contract.mint(address, amount)
          console.log('response', response)
  
          if (callback) callback();
        } catch (e: any) {
          console.log('useMintToken e', e)

        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [core, amount, address],
    )
    
    return action;
}

export default useMintToken