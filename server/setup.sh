#!/bin/bash
# Kyro Upload Pro - Full Setup Script
# Installs all dependencies for 1080p 60FPS processing

echo "[KYRO] Installing dependencies..."

# Install Node.js dependencies
echo "[KYRO] Installing Node.js packages..."
cd server
npm install express multer fluent-ffmpeg ffmpeg-static cors
cd ..

# Install FFmpeg (if not already installed)
echo "[KYRO] Checking FFmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "[KYRO] Installing FFmpeg..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install ffmpeg -y
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install ffmpeg
    fi
fi

# Download RIFE model (optional)
echo "[KYRO] RIFE setup (optional)"
echo "[KYRO] Download from: https://github.com/hzwer/RIFE"
echo "[KYRO] Place weights in: server/weights/"

echo "[KYRO] Setup complete!"
echo "[KYRO] Start server: npm start"
