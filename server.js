require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const automationRoutes = require('./routes/automation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/automation', automationRoutes);

// Serve static files dari React build
app.use(express.static(path.join(__dirname, 'client/build')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Fallback untuk React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Get local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIpAddress();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✨ AUTO SCREENSHOT DASHBOARD ✨\n`);
  console.log(`🚀 Server running on:`);
  console.log(`   Local:    http://localhost:${PORT}`);
  console.log(`   Network:  http://${localIp}:${PORT}`);
  console.log(`\n📱 Buka di semua komputer dengan URL network!\n`);
});