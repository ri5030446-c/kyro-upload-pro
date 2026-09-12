# Kyro Upload Pro - Complete Setup Guide

## 🚀 Installation & Setup

### Part 1: Browser Extension (Local Processing)

```bash
# 1. Install dependencies
npm install

# 2. Load extension in Chrome
chrome://extensions/ → Load unpacked → Select folder
```

### Part 2: Backend Server (FFmpeg + RIFE)

```bash
# 1. Install Node.js dependencies
cd server
npm install

# 2. Install FFmpeg (Linux)
sudo apt-get install ffmpeg

# Install FFmpeg (Mac)
brew install ffmpeg

# 3. Start server
npm start
# Server runs on http://localhost:3000
```

### Part 3: RIFE AI Interpolation (Optional)

```bash
# 1. Install Python dependencies
pip install torch torchvision

# 2. Download RIFE model
git clone https://github.com/hzwer/RIFE.git
cd RIFE
# Download weights and place in server/weights/

# 3. Test RIFE
python3 ../server/rife_process.py test.mp4 output.mp4
```

---

## 📊 Processing Pipeline

### Method 1: Browser-Only (FFmpeg.wasm)
```
Video Upload
    ↓
[FFmpeg.wasm] 1080p encoding + 60 FPS
    ↓
[MP4 Patcher] Metadata optimization
    ↓
Download (Ready for TikTok)
```

### Method 2: Server + Browser
```
Video Upload
    ↓
[Server FFmpeg] 1080p 60FPS encoding
    ↓
[RIFE AI] Frame interpolation (optional)
    ↓
[MP4 Patcher] Atom patching
    ↓
Download (Best Quality)
```

---

## 🎯 API Endpoints

### Process Video (1080p 60FPS)
```bash
POST /api/process-video
Content-Type: multipart/form-data

Request:
  video: <file>

Response:
  {
    "success": true,
    "message": "1080p 60FPS processing complete",
    "size": 52428800,
    "filename": "video_1080p60fps.mp4"
  }
```

### Get Video Info
```bash
POST /api/get-video-info
Content-Type: multipart/form-data

Response:
  {
    "duration": 120.5,
    "width": 1280,
    "height": 720,
    "fps": "30",
    "bitrate": 5000000,
    "audioChannels": 2,
    "audioSampleRate": 48000
  }
```

### RIFE Interpolation
```bash
POST /api/rife-interpolate
Content-Type: multipart/form-data

Response:
  {
    "success": true,
    "message": "RIFE interpolation complete",
    "size": 102857600
  }
```

### Patch MP4 Atoms
```bash
POST /api/patch-mp4
Content-Type: multipart/form-data

Response: <binary video data>
```

---

## 🔧 Configuration

### FFmpeg Quality Settings
```javascript
// High Quality (Slow)
-crf 18  // 0-51, lower = better
-preset slow

// Medium Quality (Balanced)
-crf 22
-preset medium

// Fast Processing (Lower Quality)
-crf 28
-preset fast
```

### Output Formats
```javascript
// 1080p 60FPS (Default)
-s 1920x1080 -r 60 -c:v libx264 -crf 18

// 1440p 60FPS
-s 2560x1440 -r 60 -c:v libx264 -crf 18

// 4K 60FPS
-s 3840x2160 -r 60 -c:v libx264 -crf 18
```

---

## 📱 Browser Support

✅ Chrome 90+  
✅ Edge Chromium  
✅ Firefox 78+  
✅ Safari (partial support)  

---

## ⚠️ Requirements

- **FFmpeg** (for server processing)
- **Node.js 14+** (for backend)
- **4GB RAM** (minimum)
- **2GB disk space** (for processing)

---

## 🐛 Troubleshooting

### FFmpeg not found
```bash
# Linux
sudo apt-get install ffmpeg

# Mac
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### RIFE model missing
```bash
# Download model
cd server/weights
wget https://github.com/hzwer/RIFE/releases/download/v4.6/flownet.pkl
```

### Server connection error
```bash
# Check if server is running
curl http://localhost:3000/api/health

# Check logs
npm start  # Run without nodemon for more verbose output
```

---

## 📚 Resources

- **FFmpeg Documentation**: https://ffmpeg.org/documentation.html
- **RIFE GitHub**: https://github.com/hzwer/RIFE
- **Editing News**: https://github.com/EditingSource/EN-TikTok-60FPS
- **FFmpeg.wasm**: https://github.com/ffmpegwasm/ffmpeg.wasm

---

**Version**: 1.0.0  
**Last Updated**: 2025-09-12  
**Status**: ✅ Production Ready
