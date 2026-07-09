require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const automationRoutes = require('./routes/automation');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/automation', automationRoutes);

// Serve static files dari React build (nanti)
app.use(express.static(path.join(__dirname, 'client/build')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running' });
});

// Fallback untuk React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});