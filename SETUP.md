# Setup Instructions

## 1. Install Dependencies

Backend:
```bash
npm install
```

Frontend:
```bash
cd client
npm install
cd ..
```

## 2. Configure Environment

Edit `.env` file dengan:
- IMGBB_API_KEY (sudah ada)
- SESSION_COOKIE (sudah ada)

## 3. Prepare Player IDs

Edit `player-ids.txt` dengan 500 ID Anda (1 ID per baris)

## 4. Run Application

Terminal 1 (Backend):
```bash
npm start
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

Server akan berjalan di:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## 5. Using Dashboard

1. Upload file `player-ids.txt` atau input manual
2. Klik "Start Automation"
3. Monitor progress di dashboard
4. Copy links atau download JSON setelah selesai

## Architecture

```
Frontend (React) → Backend API (Express) → Puppeteer Bot → ImgBB
    :3000              :5000            Browser Automation   Upload
```

## Features Breakdown

- ✅ Session management (menggunakan cookie)
- ✅ Batch processing (500 player)
- ✅ Screenshot automation (tabel History Bank)
- ✅ Image upload (ImgBB)
- ✅ Real-time progress (Frontend monitoring)
- ✅ Results export (JSON/CSV)

## Troubleshooting

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5000
kill -9 <PID>
```

### Browser tidak bisa launch
Install Chromium:
```bash
apt-get install -y chromium-browser
```

### Cookie expired
Update SESSION_COOKIE di .env dengan cookie terbaru dari browser

## Next Steps

Untuk automation berikutnya, tinggal:
1. Update 500 ID di `player-ids.txt`
2. Klik "Start Automation" di dashboard
3. Selesai! ✨