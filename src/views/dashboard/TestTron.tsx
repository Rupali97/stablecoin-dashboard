import React from 'react'
import { useEffect } from 'react';
import TronWeb from 'tronweb'

export const tronWeb = new TronWeb({
    fullHost: 'https://nile.trongrid.io',
    headers: { "TRON-PRO-API-KEY": `${process.env.REACT_APP_TRON_PRO_API_KEY}` },
    privateKey: `${process.env.REACT_APP_TRONLINK_PRIVATE_KEY}`
})

// tronWeb.defaultAddress.base58 = returns connected wallet address otherwise undefined
// tronWeb.ready and tronweb.isConnected() - false if not connected else true


function TestTron() {

    useEffect(() => {
        checkConnection()
    },[])

    const checkConnection = async() => {

        let account

        setTimeout(async() => {
            account = await window.tronLink.ready
            console.log('tronLink.ready', account)

            if(!account){
                let conres = await window.tronLink.request({method: 'tron_requestAccounts'})
                console.log('conres', conres)
            }
        }, 3000)
        
    }

    const trc20ContractAddress = "TFH8wQRRBo93Wjxz5ens59nV7ccLa6HZtU";   //contract address

    const getContract = async() => {
        let contract = await tronWeb.contract().at(trc20ContractAddress)
        console.log('contract', contract)

        let mintRes = await contract.mint(`${process.env.REACT_APP_TRONLINK_ACC1}`, '1000000000000000000').send()
        console.log('mintRes', mintRes)
    }


    return(
        <div>
            <button style={{margin: '0 auto'}}
                onClick={getContract}
            >Test</button>
        </div>
    )


}

export default TestTron