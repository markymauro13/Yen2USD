document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");

  // Load the saved state of the toggle and apply it to the checkbox
  chrome.storage.local.get("toggleState", function (data) {
    toggleSwitch.checked = data.toggleState !== undefined ? data.toggleState : true; // default to true if not set
  });

  // Save the new state of the toggle each time it is changed
  toggleSwitch.addEventListener("change", function () {
    chrome.storage.local.set({ toggleState: toggleSwitch.checked });
    // Here you would typically send a message to your content script to enable or disable functionality
  });

  const currentCurrency = document.getElementById("currentCurrency");
  const desiredCurrency = document.getElementById("desiredCurrency");

  // Restore the selected options
  chrome.storage.local.get(["currentCurrency", "desiredCurrency"], function (data) {
    currentCurrency.value = data.currentCurrency !== undefined ? data.currentCurrency : "JPY";
    desiredCurrency.value = data.desiredCurrency !== undefined ? data.desiredCurrency : "USD";
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
});
