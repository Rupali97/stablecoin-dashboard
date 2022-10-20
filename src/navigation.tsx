import React, { useEffect, useState } from 'react';
import {
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


function Navigation() {
  const { provider, contracts, } = useCore()

  const allTransactions = useAllTransactions()
  console.log("navigation allTransactions", allTransactions)
  const [mintTxns, setMintTxns] = useState<any>([])
  const [burnTxns, setBurnTxns] = useState<any>([])
  const [adminTxns, setAdminTxns] = useState<any>([])

  useEffect(() => {
    sortTransactions()
  }, [allTransactions])

  const chaindId = useGetActiveChainId()

  const sortTransactions = async () => {
    Object.entries(allTransactions).forEach(async (item) => {
      const { data, from, to, timestamp } = await provider.getTransaction(item[1].hash[0])

      const mutlisigAddr = contracts[chaindId].MultiSig.address.replace('0x', '').toLowerCase()
      console.log("navigation data", data, mutlisigAddr)


      if (data.toLowerCase().includes(mutlisigAddr)) {
        setAdminTxns(prev => [...prev, item])
      } else {
        if (data.includes("40c10f19")) {
          setMintTxns(prev => [...prev, item])
        } else {
          setBurnTxns(prev => [...prev, item])
        }
      }
    })
  }

  console.log("navigation", adminTxns)

  return (
    <HashRouter>
      <div style={{ paddingBottom: '200px', backgroundColor: '#f2e6e6', minHeight: '100vh' }}>
        <Dashboard />
        <Routes>
          <Route path={'/mint'} element={<Mint mintTxns={mintTxns} />} />
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
