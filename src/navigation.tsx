import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Auth from './views/Auth';
import Dashboard from './views/dashboard';
import Dashbaord from './views/dashboard';
import Burn from './views/dashboard/Burn';
import Mint from './views/dashboard/Mint';
import Stats from './views/dashboard/Stats';
import TestTron from './views/dashboard/TestTron';


function Navigation() {

  const [tronNw, setTronNw] = React.useState('')
  return (
        <BrowserRouter>
          <Dashboard tronNw={tronNw} />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard">
              <Route path={'/dashboard/mint'} element={<Mint isTronNw={(val: string) => setTronNw(val)} />}  />
              <Route path={'/dashboard/burn'} element={<Burn />} />
              <Route path={'/dashboard/statistics'} element={<Stats />} />
              <Route path={'/dashboard/tron'} element={<TestTron />} />
            </Route>
            <Route path="/logout" element={<Auth />} />
    
          </Routes>
      </BrowserRouter>
      );
}

export default Navigation