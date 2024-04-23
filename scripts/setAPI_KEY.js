// SET API KEY HERE THEN ADD THIS FILE TO .gitignore
const API_KEY = "";

function setKey() {
  chrome.storage.sync.set({ apiKey: API_KEY }, function () {});
}
setKey();
