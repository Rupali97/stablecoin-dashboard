import React, { useCallback, useEffect, useMemo } from "react";
import { useWallet } from "use-wallet";
import { useNetwork } from 'wagmi'

import { getDisplayBalance } from "../../utils/formatBalance";
import useCore from "../useCore";


const useGetTronTokenBalance = () => {
  const {tronWeb} = useCore()
  
  let balance
  const fetchTronTokenBal = async (address: string, stableCoin: string) => {
    let contract = await tronWeb.contract().at(stableCoin);
    const res = await contract.balanceOf(address).call()
    console.log("useGetTronTokenBalance res", res)
    balance = getDisplayBalance(res)

    return balance
  }

  return {fetchTronTokenBal}

}

export default useGetTronTokenBalance