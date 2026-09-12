// Kyro Upload Pro - Content Script
// Injects processing scripts into TikTok pages

(function() {
  if (window.__kyroInjected) return;
  window.__kyroInjected = true;

  const url = window.location.href;
  if (url.includes('/tiktokstudio/upload') || url.includes('/upload')) {
    // Inject the main processing script
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('inject.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
  }
})();
