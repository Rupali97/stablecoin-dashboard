import {useCallback, useEffect, useState} from "react"
import { tronMultiSigContract } from "../../utils/constants"


export const useTronGetIsExecuted = () => {

    const setTronIsExecuted = async (txId: number) => {

       try {
        console.log("inside useTronGetIsExecuted",  window.tronWeb.defaultAddress.base58)

        let instance = await  window.tronWeb.contract().at(tronMultiSigContract)
        // console.log("useTronGetIsExecuted res", instance)

        let res = await instance.transactions(txId).call()
        console.log("useTronGetIsExecuted res", res)
        res = res.executed

        return res
       } catch (error) {
            console.error("useTronGetIsExecuted", error)
       }

    }


    return setTronIsExecuted

}

export const useGetTronConfirmationCount = () => {

    const fetchData = async (txnId: number) => {
        let contract = await window.tronWeb.contract().at(tronMultiSigContract)

        const res = await contract.getConfirmationCount(txnId).call();
        console.log('useGetTronConfirmationCount', res);
        let count = res.toNumber();

        return count

    }

    return fetchData
}

export const useGetTronTokenDetails = () => {

    const fetchData = async (token: string) => {
        let contract = await window.tronWeb.contract().at(token)

        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        const name = await contract.name().call();
        console.log('useGetTronTokenDetails');
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

    const [response, setResponse] = useState<number>(0)

    const fetchData = useCallback(async () => {
        let contract = await window.tronWeb.contract().at(tronMultiSigContract)

        const res = await contract.required().call()
        console.log('useGetTronTokenDetails', res);
        
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