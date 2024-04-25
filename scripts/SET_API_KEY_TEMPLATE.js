// DO NOT PUT YOUR API KEY IN THIS TEMPLATE FILE
// USE THIS AS A TEMPLATE TO CREATE `SET_API_KEY.js in the `scripts` directory

// DO NOT PUT YOUR API KEY IN THIS TEMPLATE FILE
// This is where you will put your API key in `/scripts/SET_API_KEY.js`
const API_KEY = "";

function setKey() {
  chrome.storage.sync.set({ apiKey: API_KEY }, function () {});
}
setKey();
