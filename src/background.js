var chrome = window.chrome;
// Holds the original HTML values from different pages, the key is the url of the page
var originalHTML = {};
var lightningLocation = 'gus.lightning.force.com';
// Holds the current url that a tab is on, the key is the tabID set by chrome
var tabURLs = {};

/**
 * Sets the chrome extension icon based on whether the content script is running or not
 * @param {Object} response The content script's message to this script
 */
function setIconCallback (response) {
    if (response) {
        if (response.runState) {
            chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16-active.png' } });
        } else {
            chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16-idle.png' } });
        }
    } else {
        chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16-idle.png' } });
    }
}

/*
Event listener that is fired whenever the chrome extension icon is clicked
 */
chrome.browserAction.onClicked.addListener(function () {
    // Gets the tab the user is currently on
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let url = tabs[0].url;
        // If we are in lightning we have to do a few more checks
        if (url.indexOf(lightningLocation) > -1) {
            if (tabs[0].url.indexOf('view') != -1 || url.split('#')[1].length == 488) {
                // Tell the content script to do the opposite or what it was doing, pass it the original html that it might
                // need
                chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true, changeRun: true, originalHTML: originalHTML[url]}, function (response) {
                    setIconCallback(response);
                });
            } else {
                // In this case, we are in lightning mode but not actually on a user story or bug page, so we make it look like the
                // extension isn't running
                chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16.png' } });
            }
        } else {
            // Tell the content script to do the opposite or what it was doing, pass it the original html that it might
            // need
            chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true, changeRun: true, originalHTML: originalHTML[url]}, function (response) {
                setIconCallback(response);
            });
        }
    });
});

/*
Listener that is fired when we click on a different tab. Basically, we want to see whether or not that tab was running
and update our icon accordingly.
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let url = tabs[0].url;
            if (url.indexOf(lightningLocation) > -1) {
                if (url.indexOf('view') != -1 || url.split('#')[1].length == 488) {
                    // Get the content script's current run state
                    chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                        setIconCallback(response);
                    });
                } else {
                    // In this case, we are in lightning mode but not actually on a user story or bug page, so we make it look like the
                    // extension isn't running
                    chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16.png' } });
                }
            } else {
                // Get the content script's current run state
                chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                    setIconCallback(response);
                });
            }
        });
    });
});

/*
Event that fires on a page refresh, which is important because this is how we know if a user has navigated somewhere else in lightning mode
 */
chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
    // There are actually a lot of different times that this fires, we only want it when the refresh is complete
    if (changeInfo.status == 'complete') {
        var sendInit;
        // We only want to send the init message to content scripts in lightning if they have already initialized the script
        // once (so tabURLs[tabID] will be defined) and if the url has changed
        if (tabURLs[tabID] !== undefined && tabURLs[tabID] !== tab.url) {
            sendInit = true;
        } else {
            sendInit = false;
        }
        // Update with the current url
        tabURLs[tabID] = tab.url;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let url = tabs[0].url;
            if (url.indexOf(lightningLocation) > -1) {
                if (url.indexOf('view') != -1 || url.split('#')[1].length == 488) {
                    if (sendInit === true) {
                        // Here, we need to tell the content script to initialize again because we have only one content script for all of
                        // lightning mode
                        chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true, init: true, originalHTML: originalHTML[url]}, function (response) {
                            setIconCallback(response);
                        });
                    } else {
                        // This means it is basically a page refresh, so the script will already have the latest html and we don't need
                        // to run initialize again
                        chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                            setIconCallback(response);
                        });
                    }
                } else {
                    // In this case, we are in lightning mode but not actually on a user story or bug page, so we make it look like the
                    // extension isn't running
                    chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16.png' } });
                }
            } else {
                // If it's not lightning don't worry about init, just get run state and send original html
                chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true, originalHTML: originalHTML[url]}, function (response) {
                    setIconCallback(response);
                });
            }
        });
    }
});

// This is a listener for when the content script sends its original html
chrome.runtime.onMessage.addListener(function (message, sender) {
    // Only update it if it's the first time the content script has sent html from that url,
    // otherwise ignore
    if (message.originalHTML && originalHTML[sender.tab.url] === undefined) {
        originalHTML[sender.tab.url] = message.originalHTML;
    }
});


