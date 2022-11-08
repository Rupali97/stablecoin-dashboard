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
  const { provider, contracts, tronWeb} = useCore()
  const ethTxnCount = useGetTransactionCount()
  const tronTxnCount = useGetTronTransactionCount()
  const chaindId = useGetActiveChainId()

  const [allApiTxns, setAllApiTxns] = useState<any>([])
  const [allApiTronTxns, setAllApiTronTxns] = useState<any>([])
  const [allApiTronRes, setAllApiTronRes] = useState<any>([])
  const [allApiEthRes, setAllApiEthRes] = useState<any>([])

  const [tronObj, setTronObj] = useState<any>([])
  const [ethObj, setEthObj] = useState<any>([])

  useEffect(() => {
    let timnow = Date.now() / 1000
    axios.get(`https://nile.trongrid.io/v1/accounts/${tronMultiSigContract}/transactions?limit=200&min_timestamp=${timnow}`, { timeout:  50000})
      .then((res) => setAllApiTronRes(res.data.data))
      .catch((err) => console.error("tronapi", err))
    
  }, [])

  useEffect(() => {
    axios.get(`https://api-goerli.etherscan.io/api?module=account&action=txlist&address=${contracts[chaindId].MultiSig.address}&sort=desc&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`, { timeout:  50000})
      .then((res) => setAllApiEthRes(res.data.result))
      .catch((err) => console.error("ethapi", err))
  }, [])

  useEffect(() => {
    getTronTxnsFromAPI()
  },[allApiTronRes, tronTxnCount])

  useEffect(() => {
    setTronObj(allApiTronTxns)
    tronGetConfirm()
  }, [allApiTronTxns])

  useEffect(() => {
    getSubmitTxnsFromAPI()
  }, [allApiEthRes, ethTxnCount])

  useEffect(() => {
    setEthObj(allApiTxns)
    ethGetConfirm()
  }, [allApiTxns])


  const getSubmitTxnsFromAPI = async() => {
    let index = ethTxnCount

   if(!!allApiEthRes && index){
    allApiEthRes?.forEach((res) => {
      if(res.functionName.toLowerCase().includes("submittransaction")){
        let newIndex = index - 1
        setAllApiTxns(prev => [...prev, {index: newIndex, submitResponse: res}])
        index = index - 1
      }
    })
   }
  }

  const getTronTxnsFromAPI = async() => {
    if(!!allApiTronRes && tronTxnCount){
      let index = tronTxnCount
      allApiTronRes?.forEach((item, i) => {
        if(item.raw_data?.contract[0].parameter.value.data?.includes("c6427474") && item.ret[0].contractRet === "SUCCESS"){
          let newIndex = index - 1
          
          setAllApiTronTxns(prev => [...prev, {index: newIndex, submitResponse: {from: tronWeb.address.fromHex(item.raw_data?.contract[0].parameter.value.owner_address), input: item.raw_data?.contract[0].parameter.value.data, hash: item.txID, timeStamp: item.raw_data.timestamp}}])
          index = index - 1

        }
      })
    }
  }

  const tronGetConfirm = () => {
    allApiTronRes?.forEach((item, i) => {
      if(item.raw_data?.contract[0].parameter.value.data?.includes("c01a8c84") && item.ret[0].contractRet === "SUCCESS"){
        let txIndex = web3.utils.hexToNumberString(`0x${item.raw_data?.contract[0].parameter.value.data.slice(10, item.raw_data?.contract[0].parameter.value.data.length)}`)
          console.log("tronGetConfirmtxIndex", txIndex)
        setTronObj(prev => 
            prev.map((txns) => {
              let confirmData: any[] = []
              if(txns.index == txIndex){
                if(txns.confirmData){
                  confirmData = txns.confirmData
                  confirmData.push({from: item.raw_data?.contract[0].parameter.value.owner_address, 
                    input: item.raw_data?.contract[0].parameter.value.data, 
                    hash: item.txID, 
                    timeStamp: item.raw_data.timestamp })
                }
                else {
                  confirmData.push({from: item.raw_data?.contract[0].parameter.value.owner_address, 
                    input: item.raw_data?.contract[0].parameter.value.data, 
                    hash: item.txID, 
                    timeStamp: item.raw_data.timestamp
                  })
                }
                return {...txns, confirmData}
              }
              return txns
            })
          )
       }
    })

  }

  const ethGetConfirm = () => {
    allApiEthRes?.forEach((res, i, allApiTxns) => {
      if(res.functionName.toLowerCase().includes("confirmtransaction")) {
        let txIndex = web3.utils.hexToNumberString(`0x${res.input.slice(10, res.input.length)}`)

        setEthObj(prev => {
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
      }
    })
  }
  
  return (
    <HashRouter>
      <div style={{ paddingBottom: '200px', backgroundColor: '#f2e6e6', minHeight: '100vh' }}>
        <Dashboard />

        <Routes>
          <Route path={'/login'} element={<Auth />} />
          <Route path={'/dashboard'}>
            <Route path={'/dashboard/mint'} element={<Mint ethTxns={ethObj} tronTxns={tronObj} />} />
            <Route path={'/dashboard/burn'} element={<Burn ethTxns={ethObj} tronTxns={tronObj} />} />
            <Route path={'/dashboard/freeze'} element={<Freeze />} />
            <Route path={'/dashboard/admin'} element={<Admin ethTxns={ethObj} tronTxns={tronObj} />} />
            <Route path={'/dashboard/statistics'} element={<Stats />} />
            <Route path='*' element={<div />} />

          </Route>
        </Routes>
      </div>

    </HashRouter>
  );
}

export default Navigation
