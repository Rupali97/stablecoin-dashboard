import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import web3 from "web3"
import React, { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import useCore from './hooks/useCore';
import { useGetActiveChainId } from './state/chains/hooks';

import { useAllTransactions } from './state/transactions/hooks';

import Auth from './views/Auth';
import Dashboard from './views/dashboard';
import Dashbaord from './views/dashboard';
import Admin from './views/dashboard/Admin';
import Burn from './views/dashboard/Burn';
import Freeze from './views/dashboard/Freeze';
import Mint from './views/dashboard/Mint';
import Stats from './views/dashboard/Stats';
import { useGetConfirmationCount, useGetSingleTransaction, useGetTransactionCount } from './hooks/multisig/useMultiSig';
import useGetTokenDetails from './hooks/useGetTokenDetails';
import _ from 'lodash';
import { tronMultiSigContract } from './utils/constants';
import useGetTronTransactionCount from './hooks/tron/useGetTronTransactionCount';


function Navigation() {
  const { provider, contracts, } = useCore()
  const ethTxnCount = useGetTransactionCount()
  const tronTxnCount = useGetTronTransactionCount()
  const chaindId = useGetActiveChainId()

  console.log("ethTxnCount", ethTxnCount)
  const [allApiTxns, setAllApiTxns] = useState<any>([])
  const [allApiTronTxns, setAllApiTronTxns] = useState<any>([])

  const [tronObj, setTronObj] = useState<any>()

  useEffect(() => {
    // if(!!ethTxnCount){
    //   setAllApiTxns([])
    //   getSubmitTxnsFromAPI()
    // }

    // if(!!tronTxnCount){
    //   setAllApiTronTxns([])
    //   getTronTxnsFromAPI()
    // }
    getSubmitTxnsFromAPI()
    getTronTxnsFromAPI()

    
  }, [tronTxnCount, ethTxnCount])

//   var obj = setInterval(() => {
//     if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
//       clearInterval(obj)
//       var tronweb = window.tronWeb
//       setTronObj(tronweb)
//     }else {
//       console.log("No tron")
//     }
// }, 1000)


  const getSubmitTxnsFromAPI = async() => {
    let txns = await axios.get(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${contracts[chaindId].MultiSig.address}&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`)
    let index = ethTxnCount
    let arr = txns.data.result

   if(!!arr && index){
    arr?.forEach(async(res, i, arr) => {
      if(res.functionName.toLowerCase().includes("submittransaction")){
        index = index - 1
        setAllApiTxns(prev => [...prev, {index, submitResponse: res}])
      }
      else if(res.functionName.toLowerCase().includes("confirmtransaction")) {
        let txIndex = web3.utils.hexToNumberString(`0x${res.input.slice(10, res.input.length)}`)
        console.log("getSubmitTxnsFromAPI ELSE", txIndex)

        setAllApiTxns(prev => {
          const newState = prev.map((txns) => {
            let confirmData: any[] = []

            if(txns.index == txIndex){
              if(txns.confirmData){
               
                confirmData = txns.confirmData
                confirmData.push(res)
              }else {
                confirmData.push(res)
              }
              
              return {...txns, confirmData}
            }
            return txns
          })
          return newState;
        })
      }else {}

    })
   }
  }

  const getTronTxnsFromAPI = async() => {
    let timnow = Date.now() / 1000
    let index = tronTxnCount

    let res = await axios.get(`https://nile.trongrid.io/v1/accounts/${tronMultiSigContract}/transactions?limit=200&min_timestamp=${timnow}`)
 
    let data = res.data.data

    console.log("index", index)

    if(!!data && tronTxnCount){
      data?.forEach((item) => {
        if(item.raw_data?.contract[0].parameter.value.data?.includes("c6427474") && item.ret[0].contractRet === "SUCCESS"){
          index = index - 1
          setAllApiTronTxns(prev => [...prev, {index, submitResponse: {from: window.tronWeb?.address?.fromHex(item.raw_data?.contract[0].parameter.value.owner_address), input: item.raw_data?.contract[0].parameter.value.data, hash: item.txID, timeStamp: item.raw_data.timestamp}}])
        }else if(item.raw_data?.contract[0].parameter.value.data?.includes("c01a8c84") && item.ret[0].contractRet === "SUCCESS"){
          let txIndex = web3.utils.hexToNumberString(`0x${item.raw_data?.contract[0].parameter.value.data.slice(10, item.raw_data?.contract[0].parameter.value.data.length)}`)
          
          setAllApiTronTxns(prev => {
            const newState = prev.map((txns) => {
              let confirmData: any[] = []
              let from = window.tronWeb?.address.fromHex(item.raw_data?.contract[0].parameter.value.owner_address)
              let input = item.raw_data?.contract[0].parameter.value.data
              let hash = item.txID
              let timeStamp =  item.raw_data.timestamp

              if(txns.index == txIndex){
                
                if(txns.confirmData){
                  confirmData = txns.confirmData
                  confirmData.push({from, input, hash, timeStamp})
                }else {
                  confirmData.push({from, input, hash, timeStamp})
                }
                return {...txns, confirmData}
              }
              return txns
            })
            return newState;
          })

        }else {}
      })
    }

  }

  console.log("allApiTronTxns", allApiTronTxns)
  console.log("allApiTxns", allApiTxns)

  return (
    <HashRouter>
      <div style={{ paddingBottom: '200px', backgroundColor: '#f2e6e6', minHeight: '100vh' }}>
        <Dashboard />

        <Routes>
          <Route path={'/login'} element={<Auth />} />
          <Route path={'/dashboard'}>
            <Route path={'/dashboard/mint'} element={<Mint ethTxns={allApiTxns} tronTxns={allApiTronTxns} />} />
            <Route path={'/dashboard/burn'} element={<Burn ethTxns={allApiTxns} tronTxns={allApiTronTxns} />} />
            <Route path={'/dashboard/freeze'} element={<Freeze />} />
            <Route path={'/dashboard/admin'} element={<Admin ethTxns={allApiTxns} tronTxns={allApiTronTxns} />} />
            <Route path={'/dashboard/statistics'} element={<Stats />} />
            <Route path='*' element={<div />} />

          </Route>
        </Routes>
      </div>

    </HashRouter>
  );
}

export default Navigation
