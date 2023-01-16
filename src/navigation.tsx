import axios from 'axios';
import { BigNumber, ethers } from 'ethers';
import web3 from "web3"
import React, { useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
  
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
import { useNetwork } from 'wagmi';
import DashboardContent from './views/dashboard/DashboardContent';


function Navigation() {
  return (
    <HashRouter>
      <div style={{ paddingBottom: '200px', backgroundColor: '#f2e6e6', minHeight: '100vh' }}>
        <Dashboard />
        <DashboardContent />
      </div>
    </HashRouter>
  );
}

export default Navigation
