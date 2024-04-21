document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const currentCurrency = document.getElementById("currentCurrency");
  const desiredCurrency = document.getElementById("desiredCurrency");
  const apiKey = document.getElementById("apiKey");

  // Restore the selected options
  chrome.storage.local.get(["currentCurrency", "desiredCurrency", "toggleState", "apiKey"], function (data) {
    currentCurrency.value = data.currentCurrency !== undefined ? data.currentCurrency : "JPY";
    desiredCurrency.value = data.desiredCurrency !== undefined ? data.desiredCurrency : "USD";
    toggleSwitch.checked = data.toggleState !== undefined ? data.toggleState : true; // default to true if not set
    apiKey.value = data.apiKey !== undefined ? data.apiKey : "";
  });

  // Save the new state of the toggle each time it is changed
  toggleSwitch.addEventListener("change", function () {
    chrome.storage.local.set({ toggleState: toggleSwitch.checked });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { toggleState: toggleSwitch.checked });
    });
  });

  currentCurrency.addEventListener("change", function () {
    chrome.storage.local.set({ currentCurrency: currentCurrency.value }, function () {
      // Data is saved, now send a message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { currentCurrency: currentCurrency.value });
      });
    });
  });

  desiredCurrency.addEventListener("change", function () {
    chrome.storage.local.set({ desiredCurrency: desiredCurrency.value }, function () {
      // Data is saved, now send a message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { desiredCurrency: desiredCurrency.value });
      });
    });
  });

  apiKey.addEventListener("change", function () {
    chrome.storage.local.set({ apiKey: apiKey.value }, function () {
      // Data is saved, now send a message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { apiKey: apiKey.value });
      });
    });
  });
});
