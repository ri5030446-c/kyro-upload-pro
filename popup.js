// Kyro Upload Pro - Popup Script

const processBtn = document.getElementById('processBtn');
const settingsBtn = document.getElementById('settingsBtn');
const statusEl = document.getElementById('status');

function setStatus(message, type = 'info') {
  statusEl.textContent = message;
  statusEl.className = `status-box ${type}`;
}

processBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('processor.html') });
});

settingsBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
});

// Check processing status
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
  if (response === 'processing') {
    setStatus('Video processing in progress...', 'processing');
  }
});
