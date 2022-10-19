import { useCallback } from 'react'
import {useNetwork} from 'wagmi'
import useCore from "./useCore"


const useChangeNoConfirmations = (confirmCount: number) => {
    const core = useCore()
    const {chain} = useNetwork()

    return useCallback(async() => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig
        const res = await contract.changeNoOfReqConfirmations(confirmCount)

        const txresult = await res.wait()
        console.log('useChangeNoConfirmations txresult', txresult)
    }, [confirmCount, chain])
}

export default useChangeNoConfirmations