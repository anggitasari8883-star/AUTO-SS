import React, { useState, useRef } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard({ serverUrl }) {
  const [playerIds, setPlayerIds] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(null);
  const [results, setResults] = useState([]);
  const [idInput, setIdInput] = useState('');
  const fileInputRef = useRef(null);

  const handleAddId = () => {
    if (idInput.trim()) {
      setPlayerIds([...playerIds, idInput.trim()]);
      setIdInput('');
    }
  };

  const handleRemoveId = (index) => {
    setPlayerIds(playerIds.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const ids = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setPlayerIds(ids);
    };
    reader.readAsText(file);
  };

  const handleStartAutomation = async () => {
    if (playerIds.length === 0) {
      alert('Masukkan player IDs terlebih dahulu!');
      return;
    }
    try {
      setIsRunning(true);
      setProgress({ current: 0, total: playerIds.length });
      const response = await axios.post(`${serverUrl}/api/automation/start`, {
        playerIds: playerIds,
      });
      setResults(response.data.results);
      setProgress({
        current: response.data.totalProcessed,
        total: response.data.totalProcessed,
        success: response.data.successCount,
        failed: response.data.failureCount,
      });
    } catch (error) {
      alert('Error: ' + error.response?.data?.error || error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleStopAutomation = async () => {
    try {
      await axios.post(`${serverUrl}/api/automation/stop`);
      setIsRunning(false);
    } catch (error) {
      console.error('Error stopping automation:', error);
    }
  };

  const handleCopyAllLinks = () => {
    const links = results.map((r) => r.imageUrl).join('\n');
    navigator.clipboard.writeText(links);
    alert('✅ Semua link telah di-copy!');
  };

  const handleDownloadJSON = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(results, null, 2)));
    element.setAttribute('download', `results-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>🤖 Auto Screenshot Dashboard</h1>
        <p className="subtitle">Automation History Bank untuk 500 Player</p>

        <div className="section">
          <h2>📝 Input Player IDs</h2>

          <div className="input-group">
            <input
              type="text"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddId()}
              placeholder="Masukkan player ID..."
              className="input-field"
            />
            <button onClick={handleAddId} className="btn btn-secondary">
              Tambah
            </button>
          </div>

          <div className="or-divider">atau</div>

          <div className="file-upload">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.csv"
              style={{ display: 'none' }}
            />
            <button onClick={() => fileInputRef.current.click()} className="btn btn-secondary">
              📤 Upload File (.txt / .csv)
            </button>
          </div>

          {playerIds.length > 0 && (
            <div className="ids-list">
              <h3>Player IDs ({playerIds.length})</h3>
              <div className="ids-grid">
                {playerIds.map((id, index) => (
                  <div key={index} className="id-tag">
                    <span>{id}</span>
                    <button onClick={() => handleRemoveId(index)} className="remove-btn">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <h2>⚙️ Control</h2>
          <div className="button-group">
            <button
              onClick={handleStartAutomation}
              disabled={isRunning || playerIds.length === 0}
              className="btn btn-primary"
            >
              {isRunning ? '⏳ Running...' : '▶️ Start Automation'}
            </button>
            {isRunning && (
              <button onClick={handleStopAutomation} className="btn btn-danger">
                ⏹️ Stop
              </button>
            )}
          </div>
        </div>

        {progress && (
          <div className="section">
            <h2>📊 Progress</h2>
            <div className="progress-info">
              <p>
                Processed: <strong>{progress.current}</strong> / {progress.total}
              </p>
              {progress.success && (
                <>
                  <p>
                    Success: <strong style={{ color: '#4caf50' }}>{progress.success}</strong>
                  </p>
                  <p>
                    Failed: <strong style={{ color: '#f44336' }}>{progress.failed}</strong>
                  </p>
                </>
              )}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="section">
            <h2>✅ Results ({results.length})</h2>

            <div className="results-actions">
              <button onClick={handleCopyAllLinks} className="btn btn-success">
                📋 Copy All Links
              </button>
              <button onClick={handleDownloadJSON} className="btn btn-info">
                💾 Download JSON
              </button>
            </div>

            <div className="results-table">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Player ID</th>
                    <th>Image URL</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {results.slice(0, 20).map((result, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{result.playerId}</td>
                      <td>
                        <a href={result.imageUrl} target="_blank" rel="noopener noreferrer">
                          View Image
                        </a>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(result.imageUrl);
                            alert('✅ Link copied!');
                          }}
                          className="btn btn-small"
                        >
                          Copy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.length > 20 && (
                <p className="show-more">... dan {results.length - 20} hasil lainnya</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;