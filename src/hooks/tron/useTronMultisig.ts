import {useCallback, useEffect, useState} from "react"
import { mainchain, multisigContract } from "../../utils/blockchain"
import { tronMultiSigContract } from "../../utils/constants"
import useCore from "../useCore"


export const useTronGetIsExecuted = () => {
    const {tronWeb} = useCore()

    const setTronIsExecuted = async (txId: number) => {
       try {
        let instance = await tronWeb.contract().at(`${tronMultiSigContract}`)
        // console.log("useTronGetIsExecuted txId", txId, instance)

        let res = await instance.transactions(txId).call()
        res = res.executed

        return res
       } catch (error) {
            console.error("useTronGetIsExecuted", error)
       }

    }


    return setTronIsExecuted

}

export const useGetTronConfirmationCount = () => {
    const {tronWeb} = useCore()

    const fetchData = async (txnId: number) => {
        let contract = await tronWeb.contract().at(tronMultiSigContract)

        const res = await contract.getConfirmationCount(txnId).call();

        console.log("useGetTronConfirmationCount res", res)
        let count = res.count.toNumber();

        return count

    }

    return fetchData
}
// Not using
export const useGetTronTokenDetails = () => {
    
    const {tronWeb} = useCore()
    const fetchData = async (token: string) => {
        // const tronweb = window.tronWeb
        let contract = await tronWeb.contract().at(`${token}`)
        console.log("useGetTronTokenDetails contract", contract)
        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        const name = await contract.name().call();

        let details = {
            symbol,
            decimals,
            name
        };

        return details

    }

    return fetchData
}

export const useTronGetRequiredCount = () => {
    const {tronWeb} = useCore()

    const [response, setResponse] = useState<number>(0)

    const fetchData = useCallback(async () => {
        let contract = await tronWeb.contract().at(tronMultiSigContract)

        const res = await contract.required().call()
        setResponse(res.toNumber())

        return res

    }, [])

    useEffect(() => {
        fetchData()
            .catch((err) => {
                console.log('useGetRequiredCount err', err)
                setResponse(0)
            })
    }, [fetchData])

    return response
}