let websiteData = {};
let currentTabId = null;
let currentDomain = null;
let startTime = null;

chrome.tabs.onActivated.addListener(function(activeInfo) {
  saveTime();
  chrome.tabs.get(activeInfo.tabId, function(tab) {
    if (!tab.url) return;
    let url = new URL(tab.url);
    let domain = url.hostname;
    currentTabId = activeInfo.tabId;
    currentDomain = domain;
    startTime = Date.now();
    if (!websiteData[domain]) {
      websiteData[domain] = { timeSpent: 0, productive: true };
    }
  });
});

function saveTime() {
  if (currentDomain && startTime) {
    let timeSpent = Math.floor((Date.now() - startTime) / 1000);
    websiteData[currentDomain].timeSpent += timeSpent;
    chrome.storage.local.set({ websiteData: websiteData });
    startTime = null;
  }
}

chrome.windows.onRemoved.addListener(saveTime);
chrome.runtime.onSuspend.addListener(saveTime);