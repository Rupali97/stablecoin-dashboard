import { useCallback } from 'react'
import {useNetwork} from 'wagmi'
import useCore from "./useCore"

import { useAddPopup } from "../state/application/hooks";
import formatErrorMessage from '../utils/formatErrorMessage';

const useAddOwner = (address: string) => {
    const core = useCore()
    const {chain} = useNetwork()
    const addPopup = useAddPopup()

    return useCallback(async() => {
        try {
            const contract = await core.contracts[`${chain?.id}`].MultiSig
            const res = await contract.addOwner(address)

            const txresult = await res.wait()
            if (txresult?.status == 1){
                addPopup({txn: {
                    hash: txresult.transactionHash,
                    success: true,
                    summary: 'New owner Added'
                }})
            }
        } catch (e: any) {
            addPopup({
                error: {
                    message: formatErrorMessage(e?.data?.message || e?.message),
                    stack: e?.stack,
                }
            });
        }
    }, [address, chain])
}

export default useAddOwner