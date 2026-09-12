// Kyro Upload Pro - Background Service Worker

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    console.log('[KYRO UPLOAD PRO] Extension installed successfully!');
    chrome.storage.local.set({
      kyroVersion: chrome.runtime.getManifest().version,
      kyroInstallDate: new Date().toISOString()
    });
  } else if (details.reason === 'update') {
    console.log('[KYRO UPLOAD PRO] Updated to version ' + chrome.runtime.getManifest().version);
  }
});

chrome.runtime.onStartup.addListener(function () {
  console.log('[KYRO UPLOAD PRO] Service worker started');
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStatus') {
    chrome.storage.local.get(['processingStatus'], (result) => {
      sendResponse(result.processingStatus || 'idle');
    });
    return true; // Keep channel open for async response
  }
});
