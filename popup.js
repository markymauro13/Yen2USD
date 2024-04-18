document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('toggleSwitch');
  
    // Load the saved state of the toggle and apply it to the checkbox
    chrome.storage.local.get('toggleState', function (data) {
      toggleSwitch.checked = data.toggleState !== undefined ? data.toggleState : true; // default to true if not set
    });
  
    // Save the new state of the toggle each time it is changed
    toggleSwitch.addEventListener('change', function () {
      chrome.storage.local.set({ 'toggleState': toggleSwitch.checked });
      // Here you would typically send a message to your content script to enable or disable functionality
    });
  });
  