import _, { set } from "lodash";
import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'
import { useGetActiveBlockChain } from "../../state/chains/hooks";
import { tronMultiSigContract, tronStableCoins } from "../../utils/constants";
import { getDisplayBalance } from "../../utils/formatBalance";
import useCore from "../useCore";

const useTronTokensTotalSupply = () => {
  const {tronWeb} = useCore()
  const chain = useGetActiveBlockChain()

  const [response, setResponse] = React.useState<any>([])
 
  const fetchData = () => {

   tronStableCoins.forEach(async(item) => {
    const contract = await tronWeb.contract().at(item.contractAdrs)
    const res = await contract.totalSupply().call()
    setResponse(prev => _.uniqWith([...prev, {totalSupply: getDisplayBalance(res), symbol: item.symbol}], (arrVal, othVal) => arrVal.symbol == othVal.symbol))

})

  }

  useEffect(() => {
    fetchData()
  }, [chain])

  return response

}

export default useTronTokensTotalSupply