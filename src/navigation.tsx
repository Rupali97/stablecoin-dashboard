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


function Navigation() {

  return (
        <BrowserRouter>
          <div style={{paddingBottom: '200px', backgroundColor: '#f2f2f2', minHeight: '100vh'}}>
            <Dashboard />
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path={'/mint'} element={<Mint />}  />
              <Route path={'/burn'} element={<Burn />} />
              <Route path={'/statistics'} element={<Stats />} />
              <Route path="/logout" element={<Auth />} />
      
            </Routes>
          </div>
          
      </BrowserRouter>
      );
}

export default Navigation