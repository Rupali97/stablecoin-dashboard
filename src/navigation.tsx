import React, { useEffect, useState } from 'react';
import {
  HashRouter,
  Routes,
  Route,
} from "react-router-dom";
import useCore from './hooks/useCore';

import { useAllTransactions } from './state/transactions/hooks';

import Auth from './views/Auth';
import Dashboard from './views/dashboard';
import Dashbaord from './views/dashboard';
import Admin from './views/dashboard/Admin';
import Burn from './views/dashboard/Burn';
import Freeze from './views/dashboard/Freeze';
import Mint from './views/dashboard/Mint';
import Stats from './views/dashboard/Stats';


function Navigation() {
  const {provider} = useCore()
  
  const allTransactions = useAllTransactions()
  console.log("navigation allTransactions", allTransactions)
  const [mintTxns, setMintTxns] = useState<any>([])
  const [burnTxns, setBurnTxns] = useState<any>([])
  const [adminTxns, setAdminTxns] = useState<any>([])

  useEffect(() => {
    sortTransactions()
  }, [allTransactions])
  
  const sortTransactions = async() => {
    Object.entries(allTransactions).forEach(async(item) => {
      const {data, from, timestamp} = await provider.getTransaction(item[1].hash[0])

      console.log("navigation data", data)

      if(data.includes("5e00f632fdc170ce840f71a785b6b2a06410d5d1") || data.includes("1528c11785fd019a613ffe57f2903bda335fa8")){
        setAdminTxns(prev => [...prev, item])
      }else {
        if(data.includes("40c10f19")){
          setMintTxns(prev => [...prev, item])
        }else {
          setBurnTxns(prev => [...prev, item])
        }
      }
    })
  }

  console.log("navigation", adminTxns)

  return (
        <HashRouter>
          <div style={{paddingBottom: '200px', backgroundColor: '#f2e6e6', minHeight: '100vh'}}>
            <Dashboard />
            <Routes>
              <Route path={'/mint'} element={<Mint mintTxns={mintTxns} />}  />
              <Route path={'/burn'} element={<Burn burnTxns={burnTxns} />} />
              <Route path={'/freeze'} element={<Freeze />} />
              <Route path={'/admin'} element={<Admin adminTxns={adminTxns} />} />
              <Route path={'/statistics'} element={<Stats />} />
            </Routes>
          </div>
          
      </HashRouter>
      );
}

export default Navigation