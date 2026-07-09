import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  const [serverStatus, setServerStatus] = useState(false);

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    try {
      const response = await axios.get('/api/health');
      setServerStatus(response.status === 200);
    } catch (error) {
      setServerStatus(false);
    }
  };

  return (
    <div className="app">
      <div className="status-bar">
        <span className={`status-indicator ${serverStatus ? 'online' : 'offline'}`}></span>
        <span>{serverStatus ? 'Server Connected' : 'Server Disconnected'}</span>
      </div>
      <Dashboard />
    </div>
  );
}

export default App;