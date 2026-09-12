// FFmpeg.wasm Integration for Kyro Upload Pro
// Local video processing - 1080p 60FPS without loss

import FFmpeg from 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.6/dist/ffmpeg.min.js';
const { FFmpegUtil } = FFmpeg;

class KyroFFmpegProcessor {
  constructor() {
    this.ffmpeg = new FFmpeg.FFmpeg();
    this.isLoaded = false;
  }

  async initialize() {
    const { load } = FFmpeg;
    await load({
      coreURL: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    });
    this.isLoaded = true;
    console.log('[KYRO FFmpeg] Initialized successfully');
  }

  async processVideo(inputFile) {
    if (!this.isLoaded) {
      await this.initialize();
    }

    const inputName = inputFile.name;
    const outputName = inputFile.name.replace(/\.[^/.]+$/, '') + '_1080p60fps.mp4';

    console.log('[KYRO FFmpeg] Processing:', inputName);

    // Write input file to FFmpeg filesystem
    const inputData = await inputFile.arrayBuffer();
    this.ffmpeg.FS('writeFile', inputName, new Uint8Array(inputData));

    // FFmpeg command for 1080p 60FPS without loss
    const command = [
      '-i', inputName,
      '-c:v', 'libx264',        // H.264 codec
      '-preset', 'slow',        // Slow = better quality
      '-crf', '18',             // Quality (0-51, lower is better)
      '-s', '1920x1080',        // 1080p resolution
      '-r', '60',               // 60 FPS
      '-c:a', 'aac',            // Audio codec
      '-b:a', '256k',           // Audio bitrate
      '-y',                     // Overwrite output
      outputName
    ];

    try {
      console.log('[KYRO FFmpeg] Running command:', command.join(' '));
      await this.ffmpeg.run(...command);

      // Read output file
      const outputData = this.ffmpeg.FS('readFile', outputName);
      const outputFile = new File(
        [outputData],
        outputName,
        { type: 'video/mp4' }
      );

      // Cleanup
      this.ffmpeg.FS('unlink', inputName);
      this.ffmpeg.FS('unlink', outputName);

      console.log('[KYRO FFmpeg] Processing complete! Output size:', outputFile.size);
      return outputFile;
    } catch (error) {
      console.error('[KYRO FFmpeg] Processing error:', error);
      throw error;
    }
  }

  async processVideoWithInterpolation(inputFile, targetFps = 60) {
    if (!this.isLoaded) {
      await this.initialize();
    }

    const inputName = inputFile.name;
    const tempName = 'temp_' + Date.now() + '.mp4';
    const outputName = inputFile.name.replace(/\.[^/.]+$/, '') + '_1080p60fps_interpolated.mp4';

    // Step 1: Decode original video
    const inputData = await inputFile.arrayBuffer();
    this.ffmpeg.FS('writeFile', inputName, new Uint8Array(inputData));

    // Step 2: Scale to 1080p and set proper framerate
    const scaleCommand = [
      '-i', inputName,
      '-c:v', 'libx264',
      '-preset', 'slow',
      '-crf', '18',
      '-s', '1920x1080',
      '-r', targetFps.toString(),
      '-c:a', 'aac',
      '-b:a', '256k',
      '-y',
      tempName
    ];

    try {
      console.log('[KYRO FFmpeg] Step 1: Scaling to 1080p...');
      await this.ffmpeg.run(...scaleCommand);

      // Step 3: Apply minterpolate for smooth motion
      const interpolateCommand = [
        '-i', tempName,
        '-vf', `minterpolate='mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=${targetFps}'`,
        '-c:v', 'libx264',
        '-preset', 'slow',
        '-crf', '18',
        '-c:a', 'aac',
        '-b:a', '256k',
        '-y',
        outputName
      ];

      console.log('[KYRO FFmpeg] Step 2: Applying motion interpolation...');
      await this.ffmpeg.run(...interpolateCommand);

      // Read output
      const outputData = this.ffmpeg.FS('readFile', outputName);
      const outputFile = new File(
        [outputData],
        outputName,
        { type: 'video/mp4' }
      );

      // Cleanup
      this.ffmpeg.FS('unlink', inputName);
      this.ffmpeg.FS('unlink', tempName);
      this.ffmpeg.FS('unlink', outputName);

      console.log('[KYRO FFmpeg] Interpolation complete! Output size:', outputFile.size);
      return outputFile;
    } catch (error) {
      console.error('[KYRO FFmpeg] Interpolation error:', error);
      throw error;
    }
  }
}

export default KyroFFmpegProcessor;
