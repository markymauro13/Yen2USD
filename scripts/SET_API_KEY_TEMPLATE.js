// ADD `/scripts/SET_API_KEY.js`.gitignore
// THEN USE THIS AS A TEMPLATE TO CREATE `SET_API_KEY.js in the `scripts` directory
//
const API_KEY = "";

function setKey() {
  chrome.storage.sync.set({ apiKey: API_KEY }, function () {});
}
setKey();
