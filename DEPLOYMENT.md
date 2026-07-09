# Setup & Deployment Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
cd client && npm install && cd ..
```

### 2. Build React Frontend

```bash
cd client
npm run build
cd ..
```

### 3. Start Server

```bash
npm start
```

**Server akan otomatis menampilkan IP address:**
```
✨ AUTO SCREENSHOT DASHBOARD ✨

🚀 Server running on:
   Local:    http://localhost:5000
   Network:  http://192.168.x.x:5000

📱 Buka di semua komputer dengan URL network!
```

---

## 🌐 Akses dari Komputer Lain

Gunakan URL **Network** yang ditampilkan server:

**Contoh:**
```
http://192.168.1.100:5000
```

Ganti `192.168.1.100` dengan IP address server Anda.

---

## 🐳 Docker (Optional - untuk Deployment)

### Buat Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json client/

# Install dependencies
RUN npm install
RUN cd client && npm install && cd ..

# Build React
RUN cd client && npm run build && cd ..

# Copy source
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Build & Run

```bash
docker build -t auto-screenshot .
docker run -p 5000:5000 -e PORT=5000 auto-screenshot
```

---

## 📋 Checklist Deployment

- [ ] Edit `.env` dengan ImgBB API Key ✅
- [ ] Update `player-ids.txt` dengan 500 ID
- [ ] Run `npm install`
- [ ] Build React: `cd client && npm run build`
- [ ] Start server: `npm start`
- [ ] Test di browser: `http://localhost:5000`
- [ ] Test di network: `http://<IP>:5000`

---

## 🛠️ Troubleshooting

### Port 5000 sudah digunakan

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -i :5000
kill -9 <PID>
```

### CORS Error

Pastikan `CORS()` sudah aktif di `server.js` ✅

### React build gagal

```bash
cd client
rm -rf node_modules
npm install
npm run build
```

### Tidak bisa akses dari network

1. Cek firewall allow port 5000
2. Pastikan server listen di `0.0.0.0` (sudah dikonfigurasi) ✅
3. Gunakan IP address, bukan `localhost`

---

## 📱 Remote Access

### Via ngrok (Public URL)

```bash
npm install -g ngrok
ngrok http 5000
```

Will generate URL publik seperti: `https://xxxx-xxx-xxx.ngrok.io`

---

## 🎯 Production Checklist

- [ ] Update `PORT` di `.env` (default: 5000)
- [ ] Set `NODE_ENV=production`
- [ ] Test semua features
- [ ] Backup `player-ids.txt` dan `results-*.json`
- [ ] Monitor server logs
- [ ] Allow firewall port 5000

---

**Siap deploy? Jalankan `npm start` dan share URL network-nya!** 🚀