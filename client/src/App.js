import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  const [serverStatus, setServerStatus] = useState(false);
  const [serverUrl, setServerUrl] = useState('');

  useEffect(() => {
    checkServer();
  }, []);

  const checkServer = async () => {
    try {
      // Detect server URL automatically
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      const baseUrl = `${protocol}//${hostname}${port}`;
      
      setServerUrl(baseUrl);

      const response = await axios.get(`${baseUrl}/api/health`);
      setServerStatus(response.status === 200);
    } catch (error) {
      setServerStatus(false);
    }
  };

  return (
    <div className="app">
      <div className="status-bar">
        <span className={`status-indicator ${serverStatus ? 'online' : 'offline'}`}></span>
        <span>{serverStatus ? '✅ Server Connected' : '❌ Server Disconnected'}</span>
      </div>
      <Dashboard serverUrl={serverUrl} />
    </div>
  );
}

export default App;