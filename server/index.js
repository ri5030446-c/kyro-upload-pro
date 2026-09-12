// Kyro Upload Pro - Node.js Backend Server
// FFmpeg + RIFE + MP4 Patching

const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());

// Configure FFmpeg
ffmpeg.setFfmpegPath(require('ffmpeg-static'));

// ==================== ENDPOINTS ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', version: '1.0.0' });
});

// Process video - 1080p 60FPS without loss
app.post('/api/process-video', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const inputPath = req.file.path;
  const outputName = req.file.filename + '_1080p60fps.mp4';
  const outputPath = path.join('uploads', outputName);

  console.log('[KYRO SERVER] Processing:', req.file.originalname);

  try {
    // FFmpeg processing
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          '-c:v libx264',      // H.264 codec
          '-preset slow',      // Quality preset (slow/medium/fast)
          '-crf 18',           // Quality (0-51, lower=better)
          '-s 1920x1080',      // 1080p
          '-r 60',             // 60 FPS
          '-c:a aac',          // Audio codec
          '-b:a 256k'          // Audio bitrate
        ])
        .on('progress', (progress) => {
          console.log('[KYRO SERVER] Progress:', progress.percent + '%');
        })
        .on('end', () => {
          console.log('[KYRO SERVER] Processing complete');
          resolve();
        })
        .on('error', (err) => {
          console.error('[KYRO SERVER] FFmpeg error:', err);
          reject(err);
        })
        .save(outputPath);
    });

    // Read processed file
    const fileData = fs.readFileSync(outputPath);
    const fileSize = fs.statSync(outputPath).size;

    // Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    res.json({
      success: true,
      message: '1080p 60FPS processing complete',
      size: fileSize,
      filename: outputName
    });

  } catch (error) {
    console.error('[KYRO SERVER] Error:', error);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).json({ error: error.message });
  }
});

// Get video info
app.post('/api/get-video-info', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const inputPath = req.file.path;

  ffmpeg.ffprobe(inputPath, (err, metadata) => {
    fs.unlinkSync(inputPath);

    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const video = metadata.streams.find(s => s.codec_type === 'video');
    const audio = metadata.streams.find(s => s.codec_type === 'audio');

    res.json({
      duration: metadata.format.duration,
      width: video?.width,
      height: video?.height,
      fps: video?.r_frame_rate,
      bitrate: metadata.format.bit_rate,
      audioChannels: audio?.channels,
      audioSampleRate: audio?.sample_rate
    });
  });
});

// RIFE Frame Interpolation (using external binary)
app.post('/api/rife-interpolate', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const inputPath = req.file.path;
  const outputPath = path.join('uploads', req.file.filename + '_rife.mp4');
  const rifeScript = path.join(__dirname, 'rife_process.py');

  console.log('[KYRO RIFE] Starting interpolation...');

  try {
    // Call RIFE Python script
    await new Promise((resolve, reject) => {
      const rife = spawn('python3', [rifeScript, inputPath, outputPath]);

      rife.stdout.on('data', (data) => {
        console.log('[KYRO RIFE]', data.toString());
      });

      rife.stderr.on('data', (data) => {
        console.error('[KYRO RIFE]', data.toString());
      });

      rife.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`RIFE process exited with code ${code}`));
        }
      });
    });

    const fileSize = fs.statSync(outputPath).size;
    fs.unlinkSync(inputPath);

    res.json({
      success: true,
      message: 'RIFE interpolation complete',
      size: fileSize
    });

  } catch (error) {
    console.error('[KYRO RIFE] Error:', error);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).json({ error: error.message });
  }
});

// MP4 Atom Patching
app.post('/api/patch-mp4', upload.single('video'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No video file provided' });
  }

  const inputPath = req.file.path;
  console.log('[KYRO PATCHER] Patching MP4 atoms...');

  try {
    // Read MP4 file
    const data = fs.readFileSync(inputPath);
    const patched = patchMP4Atoms(data);

    // Return patched file
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', patched.length);
    res.send(patched);

    fs.unlinkSync(inputPath);

  } catch (error) {
    console.error('[KYRO PATCHER] Error:', error);
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    res.status(500).json({ error: error.message });
  }
});

// ==================== MP4 PATCHING FUNCTION ====================

function patchMP4Atoms(buffer) {
  const data = Buffer.from(buffer);
  const timescale = 90000;
  const duration = 2269500;

  // Find and patch mdhd atom
  let offset = 0;
  while (offset < data.length - 8) {
    const boxType = data.toString('ascii', offset + 4, offset + 8);

    if (boxType === 'mdhd') {
      // Patch timescale (offset + 12)
      data.writeUInt32BE(timescale, offset + 12);
      // Patch duration (offset + 16)
      data.writeUInt32BE(duration, offset + 16);
      console.log('[KYRO PATCHER] mdhd patched');
    }

    if (boxType === 'mvhd') {
      data.writeUInt32BE(timescale, offset + 12);
      data.writeUInt32BE(duration, offset + 16);
      console.log('[KYRO PATCHER] mvhd patched');
    }

    const size = data.readUInt32BE(offset);
    offset += size || 1;
  }

  return data;
}

// ==================== SERVER START ====================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('[KYRO SERVER] Running on http://localhost:' + PORT);
  console.log('[KYRO SERVER] FFmpeg ready for 1080p 60FPS processing');
});
