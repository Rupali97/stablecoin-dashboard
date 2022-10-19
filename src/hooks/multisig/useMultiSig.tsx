import { ethers } from 'ethers';
import {useCallback, useEffect, useRef, useState} from 'react'
import {useNetwork} from 'wagmi'
import { useAddPopup } from '../../state/application/hooks';
import formatErrorMessage from '../../utils/formatErrorMessage';
import MultiSig from "../../protocol/deployments/abi/MultiSig.json"

import useCore from "../useCore"

// confirmation hooks = required // current confirmation count of a txn 
// is transaction confirmed(true/false) // get addresses who confirmed the transaction

export const useGetRequiredCount = () => {
    const core = useCore();
    const {chain} = useNetwork()
    const [response, setResponse] = useState<number>(0)

    const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        const res = await contract.required()
        setResponse(res.toNumber())
      }, [chain]) 

    useEffect(() => {
        if(core){
            fetchData()
                .catch((err) => {
                    console.log('useGetRequiredCount err', err)
                    setResponse(0)
                } )
        }
    }, [fetchData])
    
    return response
}

export const useGetConfirmationCount = () => {
    const core = useCore();
    const {chain} = useNetwork()

    const fetchData =  async(txnId: number) => {
        const contract = core.contracts[`${chain?.id || core._activeNetwork} `].MultiSig

        const res = await contract.getConfirmationCount(txnId);
        console.log('useGetConfirmationCount', res);
        let count = res.toNumber();

        return count

    } 

    return fetchData
}


export const useIsTxnConfirmed = (txnId: number) => {
    const core = useCore();
    const {chain} = useNetwork()
    const [response, setResponse] = useState<boolean>(false)

    const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        const res = await contract.isConfirmed(txnId)
        setResponse(res)
      }, [chain]) 

    useEffect(() => {
        if(core){
            fetchData()
                .catch((err) => {
                    setResponse(false)
                    console.log('useIsTxnConfirmed err', err)
                })
        }
    }, [fetchData])
    
    return response
}

export const useGetConfirmaByAddresses = (txnId: number) => {
    const core = useCore();
    const {chain} = useNetwork()
    const [response, setResponse] = useState<[]>([])

    const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        const res = await contract.getConfirmations(txnId)
        setResponse(res)
      }, [chain]) 

    useEffect(() => {
        if(core){
            fetchData()
                .catch((err) => {
                    setResponse([])
                    console.log('useGetConfirmaByAddresses err', err)
                })
        }
    }, [fetchData])
    
    return response
}

// get owner hooks

export const useGetOwners = () => {
    const core = useCore();

    const {chain} = useNetwork()
    const [response, setResponse] = useState<[]>([])

    const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id || core._activeNetwork}`].MultiSig;
        const res = await contract.getOwners()
        setResponse(res)
      }, [chain, core._activeNetwork]) 

    useEffect(() => {
        if(core){
            fetchData()
            .catch((err) => {
                console.log('useGetOwners err', err)
                setResponse([])
            })
        }
    }, [fetchData, chain, core._activeNetwork])
    
    return response
}

// Transaction count and get all transactions 

export const useGetTransactionCount = () => {
    const core = useCore();
    const {chain} = useNetwork()
    const [response, setResponse] = useState<number>(0)

    const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        const res = await contract.transactionCount()
        setResponse(res.toNumber())
      }, [chain]) 

    useEffect(() => {
        if(core){
            fetchData()
                .catch((err) => {
                    setResponse(0)
                    console.log('useGetTransactionCount err', err)
                })
        }
    }, [fetchData])
    
    return response
}

export const useGetTransactions = (count: number) => {
    const core = useCore();
    const {chain} = useNetwork()
    const [response, setResponse] = useState<any[]>([])

    const fetchData = useCallback(async () => {
        const contract = await core.contracts[`${chain?.id}`].MultiSig;
        setResponse([])
        for(let i = 0; i < count; i++){
            const res = await contract.transactions(i)
            setResponse(prev => [...prev, res])
        }

      }, [chain]) 

    useEffect(() => {
        if(core){
            fetchData()
                .catch((err) => {
                    setResponse([])
                    console.log('useGetTransaction err', err)
                })
        }
    }, [fetchData])
    
    return response
}

export const useGetSingleTransaction = () => {
    const core = useCore();
    const {chain} = useNetwork()


    const sendRes = async(txId: number) => {
        
        const contract = core.contracts[`${chain?.id}`].MultiSig
        const res = await contract.transactions(txId)
        console.log("useGetSingleTransaction res", res.executed)
        let executed = res.executed

        return executed
    } 

    return sendRes
}

export const useGetTxnFromHash = () => {
    const core = useCore();
    const {provider} = core

    // const [test, setTest] = useState<any>()
    let data, from, blockNumber
    let toAdrs, val, token, typeOfTxn, timestamp, returnRes

    const sendRes = (hash: string) => {

        const testFn = async() => {
            
            const res = await provider.getTransaction(hash)
            console.log('useGetTxnFromHash res', res.data)
            data = res.data
            from = res.from
            blockNumber = res.blockNumber

            token = data.slice(10, 74)
            typeOfTxn = data.slice(266, 274)
            toAdrs = data.slice(274, 338)
            val = data.slice(338, 402) 

            const methodID = data?.slice(0, 10)

            // if(blockNumber)
            //     {
            //         const res = await provider.getBlock(blockNumber)
            //         timestamp = res.timestamp

            //         returnRes = {
            //             methodID,
            //             token: `0x${token.slice(24, token.length)}`,
            //             typeOfTxn: typeOfTxn == "40c10f19" ? "Mint" : "Burn",
            //             toAdrs: `0x${toAdrs.slice(24, toAdrs.length)}`,
            //             val: ethers.utils.formatEther(`0x${val}`),
            //             from,
            //             timestamp
            //         }  
            //     }

            const blockres = await provider.getBlock(blockNumber)
            timestamp = blockres.timestamp

            returnRes = {
                methodID,
                token: `0x${token.slice(24, token.length)}`,
                typeOfTxn: typeOfTxn == "40c10f19" ? "Mint" : "Burn",
                toAdrs: `0x${toAdrs.slice(24, toAdrs.length)}`,
                val: ethers.utils.formatEther(`0x${val}`),
                from,
                timestamp
            }  

            return returnRes
                
            }

           let test = testFn()
           console.log("useGetTxnFromHash final", test)

            return returnRes
        // console.log('getTxnFromHash res', ethers.utils.formatEther(`0x${'0000000000000000000000000000000000000000000000008ac7230489e80000'}`))

    } 

    return sendRes
}


// Add Owner / Remove Owner / Replace owner / ChangeRequirement


export const useAddOwner = (address: string) => {
    const core = useCore()
    const {chain} = useNetwork()
    const addPopup = useAddPopup()

    return useCallback(async() => {
        try {
            const contract = await core.contracts[`${chain?.id}`].MultiSig
            const res = await contract.addOwner(address)

            const txresult = await res.wait()
            console.log('useAddOwner txresult', txresult)

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

export const useRemoveOwner = (address: string) => {
    const core = useCore()
    const {chain} = useNetwork()
    const addPopup = useAddPopup()

    return useCallback(async() => {
        try {
            const contract = await core.contracts[`${chain?.id}`].MultiSig
            const res = await contract.removeOwner(address)
    
            const txresult = await res.wait()
            console.log('useRemoveOwner txresult', txresult)

            if (txresult?.status == 1){
                addPopup({txn: {
                    hash: txresult.transactionHash,
                    success: true,
                    summary: 'Owner removed'
                }})
            }
        } catch (e: any) {
            console.log('useRemoveOwner error', e)
            addPopup({
                error: {
                    message: formatErrorMessage(e?.data?.message || e?.message),
                    stack: e?.stack,
                }
            });
        }
    }, [address, chain])
}

export const useReplaceOwner = (oldAddress: string, newAddress: string) => {
    const core = useCore()
    const {chain} = useNetwork()
    const addPopup = useAddPopup()

    return useCallback(async() => {
        try {
            const contract = await core.contracts[`${chain?.id}`].MultiSig
            const res = await contract.replaceOwner(oldAddress, newAddress)
    
            const txresult = await res.wait()
            console.log('useReplaceOwner txresult', txresult)

            if (txresult?.status == 1){
                addPopup({txn: {
                    hash: txresult.transactionHash,
                    success: true,
                    summary: 'Owner removed'
                }})
            }
        } catch (e: any) {
            console.log('useReplaceOwner error', e)
            addPopup({
                error: {
                    message: formatErrorMessage(e?.data?.message || e?.message),
                    stack: e?.stack,
                }
            });
        }
    }, [oldAddress, newAddress, chain])
}

export const useChangeRequirement = (requiredCount: number) => {
    const core = useCore()
    const {chain} = useNetwork()
    const addPopup = useAddPopup()

    return useCallback(async() => {
        try {
            const contract = await core.contracts[`${chain?.id}`].MultiSig
            const res = await contract.changeRequirement(requiredCount)
    
            const txresult = await res.wait()
            console.log('useChangeRequirement txresult', txresult)

            if (txresult?.status == 1){
                addPopup({txn: {
                    hash: txresult.transactionHash,
                    success: true,
                    summary: 'Owner removed'
                }})
            }
        } catch (e: any) {
            console.log('useChangeRequirement error', e)
            addPopup({
                error: {
                    message: formatErrorMessage(e?.data?.message || e?.message),
                    stack: e?.stack,
                }
            });
        }
    }, [requiredCount, chain])
}


