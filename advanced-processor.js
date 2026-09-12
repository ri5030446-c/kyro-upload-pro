// Advanced Video Processor - 1080p 60FPS without loss

class AdvancedVideoProcessor {
  constructor() {
    this.selectedFile = null;
    this.isProcessing = false;
    this.serverUrl = 'http://localhost:3000';
    this.init();
  }

  init() {
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.processBtn = document.getElementById('processBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.progressSection = document.getElementById('progressSection');
    this.progressFill = document.getElementById('progressFill');
    this.progressLabel = document.getElementById('progressLabel');
    this.progressPercent = document.getElementById('progressPercent');
    this.status = document.getElementById('status');
    this.videoInfo = document.getElementById('videoInfo');
    this.settings = document.getElementById('settings');

    this.setupEventListeners();
  }

  setupEventListeners() {
    // File upload
    this.uploadArea.addEventListener('click', () => this.fileInput.click());
    this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

    // Drag and drop
    this.uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadArea.classList.add('dragover');
    });
    this.uploadArea.addEventListener('dragleave', () => {
      this.uploadArea.classList.remove('dragover');
    });
    this.uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadArea.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleFileSelect({ target: { files: e.dataTransfer.files } });
      }
    });

    // Buttons
    this.processBtn.addEventListener('click', () => this.processVideo());
    this.clearBtn.addEventListener('click', () => this.clear());
  }

  handleFileSelect(e) {
    const files = e.target.files;
    if (files.length === 0) return;

    this.selectedFile = files[0];
    this.processBtn.disabled = false;
    this.settings.style.display = 'grid';

    // Show file info
    const fileSize = (this.selectedFile.size / (1024 * 1024)).toFixed(2);
    this.videoInfo.innerHTML = `
      <div class="info-row">
        <div class="info-label">Filename</div>
        <div class="info-value">${this.selectedFile.name}</div>
      </div>
      <div class="info-row">
        <div class="info-label">Size</div>
        <div class="info-value">${fileSize} MB</div>
      </div>
      <div class="info-row">
        <div class="info-label">Type</div>
        <div class="info-value">${this.selectedFile.type}</div>
      </div>
    `;
    this.videoInfo.classList.add('active');

    this.setStatus('File selected. Ready to process!', 'info');
  }

  async processVideo() {
    if (!this.selectedFile || this.isProcessing) return;

    this.isProcessing = true;
    this.processBtn.disabled = true;
    this.progressSection.classList.add('active');

    try {
      // Get settings
      const resolution = document.getElementById('resolution').value;
      const fps = document.getElementById('fps').value;
      const quality = document.getElementById('quality').value;
      const interpolation = document.getElementById('interpolation').checked;

      const [width, height] = resolution.split('x').map(Number);

      // Create FormData
      const formData = new FormData();
      formData.append('video', this.selectedFile);
      formData.append('resolution', resolution);
      formData.append('fps', fps);
      formData.append('quality', quality);
      formData.append('interpolation', interpolation);

      // Send to server
      this.setProgress(10, 'Uploading to server...');
      const response = await fetch(`${this.serverUrl}/api/process-video`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Server error: ' + response.statusText);
      }

      this.setProgress(50, 'Processing video with FFmpeg...');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      this.setProgress(75, 'Patching MP4 atoms...');
      // Patching happens on server

      this.setProgress(95, 'Finalizing...');
      // Simulate delay
      await new Promise(r => setTimeout(r, 500));

      this.setProgress(100, 'Complete!');
      this.setStatus(
        `✅ Video processed successfully!<br>` +
        `Output size: ${(result.size / (1024 * 1024)).toFixed(2)} MB<br>` +
        `Ready for TikTok upload!`,
        'success'
      );

      // Show download option
      setTimeout(() => {
        this.setStatus(
          `✅ ${result.filename} ready for download!<br>` +
          `Download from server and upload to TikTok.`,
          'success'
        );
      }, 1000);

    } catch (error) {
      console.error('Processing error:', error);
      this.setStatus('❌ ' + error.message, 'error');
    } finally {
      this.isProcessing = false;
      this.processBtn.disabled = false;
    }
  }

  setProgress(percent, label) {
    this.progressFill.style.width = percent + '%';
    this.progressLabel.textContent = label;
    this.progressPercent.textContent = percent + '%';
  }

  setStatus(message, type) {
    this.status.textContent = message;
    this.status.className = `status active ${type}`;
  }

  clear() {
    this.selectedFile = null;
    this.fileInput.value = '';
    this.processBtn.disabled = true;
    this.progressSection.classList.remove('active');
    this.videoInfo.classList.remove('active');
    this.settings.style.display = 'none';
    this.setStatus('Ready for upload', 'info');
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new AdvancedVideoProcessor();
});
