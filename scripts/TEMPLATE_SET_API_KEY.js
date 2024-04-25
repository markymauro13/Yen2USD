// DO NOT PUT YOUR API KEY IN THIS TEMPLATE FILE
// USE THIS AS A TEMPLATE TO CREATE `SET_API_KEY.js in the `scripts` directory
// Only copy lines 5-10 to avoid confusion in `SET_API_KEY.js` 

const API_KEY = "";

function setKey() {
  chrome.storage.sync.set({ apiKey: API_KEY }, function () {});
}
setKey();

// DO NOT PUT YOUR API KEY IN THIS TEMPLATE FILE
