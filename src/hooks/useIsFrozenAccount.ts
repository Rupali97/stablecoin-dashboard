import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork, useAccount } from 'wagmi'

import useCore from "./useCore";


const useIsFrozenAccount = (stableCoin: string, addressF: string) => {
  const core = useCore();
  // const {chainId} = useWallet()
  const { chain } = useNetwork()
  const {address} = useAccount()

  const [response, setResponse] = React.useState<boolean>()

  const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id || 80001}`][stableCoin];
        console.log('useIsFrozenAccount contract', contract)
        const res = await contract.frozenAccount(addressF || address);
        console.log('useIsFrozenAccount res', res)

        setResponse(res)
  }, [chain]) 

  useEffect(() => {
    console.log('chain?.id', chain?.id)
    if(core.contracts){
        fetchData()
    }

    console.log('useEffect address', address)

  }, [fetchData, address, stableCoin])

  return response

}

export default useIsFrozenAccount