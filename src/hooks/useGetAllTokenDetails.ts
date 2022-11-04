import _ from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'

import { getDisplayBalance } from "../utils/formatBalance";
import useCore from "./useCore";


const useGetAllTokenDetails = () => {
  const {tokens, _activeNetwork, contracts} = useCore();
  // const {chainId} = useWallet()
  const { chain} = useNetwork()

  const [response, setResponse] = React.useState<any>('')

  const fetchData = useCallback(async () => {
    Object.entries(tokens[chain?.id || _activeNetwork]).forEach(async(item) => {
        const contract = await contracts[`${chain?.id || _activeNetwork}`][item[0]]
        const res = await contract.totalSupply()
                const bal = {
            totalSupply: getDisplayBalance(res),
            symbol: item[1].symbol
        }
        setResponse(prev => _.uniqWith([...prev, bal], (arrVal, othVal) => arrVal.symbol == othVal.symbol))

    })
    
  }, [chain]) 

  useEffect(() => {
    fetchData()
  }, [tokens, _activeNetwork, chain])

  return response

}

export default useGetAllTokenDetails