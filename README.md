# Kyro Upload Pro

**TikTok 60FPS Uploader with AI-Powered Video Enhancement**

## Features

✨ **RIFE AI Interpolation** - Generates smooth intermediate frames for optimal playback  
🎬 **FFmpeg Integration** - Professional-grade video encoding and processing  
🔧 **MP4 Atom Patching** - Optimizes video metadata for TikTok compatibility  
📤 **Direct TikTok Upload** - Seamless integration with TikTok Studio  
⚡ **Local Processing** - All processing happens on your device

## Based On

This extension is built on the proven methods from [Editing News](https://github.com/EditingSource/EN-TikTok-60FPS):
- RIFE v4.6 AI model for frame interpolation
- FFmpeg for video encoding/decoding
- MP4 atom patching for timing adjustments

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top right)
4. Click **Load unpacked** and select this folder
5. Extension is ready to use!

## Usage

1. Click the **Kyro Upload Pro** extension icon
2. Click **Open Video Processor**
3. Upload your video file (MP4, MOV, WebM)
4. Select processing options:
   - RIFE AI Interpolation: ON/OFF
   - Target FPS: 60 (default)
   - Quality: High (default)
5. Click **Process**
6. Download optimized video
7. Upload to TikTok using the extension

## Processing Steps

```
Original Video
    ↓
[FFmpeg] Decode → Extract frames
    ↓
[RIFE AI] Interpolate → Generate new frames (60 FPS)
    ↓
[FFmpeg] Encode → Re-encode video
    ↓
[MP4 Patcher] Modify → Update timing metadata
    ↓
Optimized Video (Ready for TikTok)
```

## Technical Details

### RIFE Interpolation
- **Model**: RIFE v4.6
- **Purpose**: Generate smooth intermediate frames
- **Output**: 60 FPS video from various input framerates

### FFmpeg Processing
- **Codec**: H.264 (libx264)
- **Bitrate**: Adaptive (CRF 18)
- **Output Format**: MP4 (H.264 + AAC)

### MP4 Atom Patching
- **Modified Atoms**: mvhd, mdhd, elst
- **Purpose**: Optimize timing information for TikTok
- **Result**: Smooth playback at 60 FPS

## System Requirements

- Chrome 90+ or Edge Chromium
- Windows 10/11
- 4 GB RAM minimum (8 GB recommended)
- 2 GB disk space for processing

## Limitations

- Currently requires desktop app for RIFE processing
- FFmpeg processing runs server-side (for now)
- Maximum file size: 2 GB

## Future Updates

- [ ] Local RIFE processing (WASM)
- [ ] Local FFmpeg support (via WebAssembly)
- [ ] Batch processing
- [ ] Custom preset profiles
- [ ] Real-time preview

## License

MIT License - See LICENSE file

## Disclaimer

- Use at your own risk
- Comply with TikTok's Terms of Service
- Intended for personal use only
- Not affiliated with TikTok, ByteDance, or Editing News

## Credits

- **Editing News** - Original method and research
- **RIFE** - AI frame interpolation model
- **FFmpeg** - Video processing library
- **Kyro** - Extension implementation

---

**Need help?** Check the [Issues](https://github.com/ri5030446-c/kyro-upload-pro/issues) page
