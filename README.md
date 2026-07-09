# 🤖 Auto Screenshot Dashboard

Automated screenshot tool untuk History Bank dengan dashboard management yang user-friendly.

## 🚀 Features

- ✅ Auto login dengan session cookie
- ✅ Screenshot History Bank table untuk 500 player
- ✅ Auto upload ke ImgBB (jadi link)
- ✅ Dashboard React untuk monitoring
- ✅ Reusable untuk automation berikutnya
- ✅ Export hasil sebagai JSON/CSV

## 📋 Prerequisites

- Node.js v14+
- NPM atau Yarn
- Chrome/Chromium browser
- ImgBB API Key

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env`:

```env
IMGBB_API_KEY=your_api_key_here
AGENT_URL=https://agent.png777.com/player-name.html
SESSION_COOKIE=your_session_cookie_here
PORT=5000
NODE_ENV=development
```

### 3. Setup Frontend (React)

```bash
cd client
npm install
cd ..
```

### 4. Start Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

## 📖 API Endpoints

### POST `/api/automation/start`

Start automation dengan list player IDs.

**Request:**
```json
{
  "playerIds": ["ebon30", "boyahh222", "kucai11", ...]
}
```

**Response:**
```json
{
  "success": true,
  "totalProcessed": 500,
  "successCount": 495,
  "failureCount": 5,
  "results": [
    {
      "playerId": "ebon30",
      "imageUrl": "https://i.ibb.co/...",
      "deleteUrl": "https://ibb.co/..."
    }
  ],
  "resultsFile": "results-1234567890.json"
}
```

### GET `/api/automation/status`

Check automation status.

**Response:**
```json
{
  "isRunning": false
}
```

### POST `/api/automation/stop`

Stop automation yang sedang berjalan.

### GET `/api/automation/results/:filename`

Retrieve hasil automation dari file.

## 🎨 Dashboard Features

- 📤 Upload list player IDs (CSV/TXT)
- ▶️ Start/Stop automation
- 📊 Real-time progress monitoring
- 📋 View hasil dalam table
- 🔗 Copy all links
- 💾 Download hasil sebagai JSON/CSV

## 📝 File Structure

```
AUTO-SS/
├── server.js              # Express server
├── package.json           # Dependencies
├── .env                   # Environment config
├── utils/
│   ├── imgbb-upload.js    # ImgBB upload logic
│   └── puppeteer-auto.js  # Bot automation logic
├── routes/
│   └── automation.js      # API routes
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🛠️ Troubleshooting

### Browser gagal launch
- Install Chromium: `apt-get install -y chromium-browser`
- Atau set `headless: true` di puppeteer-auto.js

### Session cookie expired
- Update `SESSION_COOKIE` di .env dengan cookie terbaru

### ImgBB upload error
- Verify API key di https://api.imgbb.com/
- Check rate limit (ImgBB punya limit request)

## 📜 License

MIT License - Free to use!

## 👤 Author

anggitasari8883-star

---

Made with ❤️ untuk automation
