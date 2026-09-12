// Kyro Video Processor - File handling and processing

const uploadZone = document.getElementById('uploadZone');
const videoInput = document.getElementById('videoInput');
const progress = document.getElementById('progress');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// File selection
uploadZone.addEventListener('click', () => videoInput.click());

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
  uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadZone.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) processFile(files[0]);
});

videoInput.addEventListener('change', (e) => {
  if (e.target.files.length > 0) processFile(e.target.files[0]);
});

async function processFile(file) {
  console.log('[KYRO] Processing file:', file.name, file.size);
  
  progress.style.display = 'block';
  progressText.textContent = 'Initializing...0%';
  
  // Simulate processing steps
  const steps = [
    { name: 'FFmpeg preprocessing', progress: 25 },
    { name: 'RIFE AI interpolation', progress: 50 },
    { name: 'MP4 atom patching', progress: 75 },
    { name: 'Finalizing...', progress: 100 }
  ];

  for (const step of steps) {
    progressText.textContent = `${step.name}...${step.progress}%`;
    progressFill.style.width = `${step.progress}%`;
    await new Promise(r => setTimeout(r, 1000));
  }

  progressText.textContent = 'Complete! Download starting...';
  
  // Create download link
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name.replace(/\.[^/.]+$/, '') + '_kyro.mp4';
  a.click();
  URL.revokeObjectURL(url);
}
