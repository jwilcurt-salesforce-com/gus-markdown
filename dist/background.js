var run = true;
chrome.browserAction.onClicked.addListener(function () {
    run = !run;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {run: run}, function(response) {
        console.log(response;
      });
    });
    chrome.tabs.executeScript(null, {file: "rolledExtension.js"});
});
