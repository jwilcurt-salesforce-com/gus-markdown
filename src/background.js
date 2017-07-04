var chrome = window.chrome;
var originalHTML = {};
var lightningLocation = 'gus.lightning.force.com';
var tabURLs = {};

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

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let url = tabs[0].url;
        if (url.indexOf(lightningLocation) > -1) {
            if (tabs[0].url.indexOf('view') != -1 || url.split('#')[1].length == 488) {
                chrome.tabs.sendMessage(tabs[0].id, {changeRun: true, originalHTML: originalHTML[url]}, function (response) {
                    setIconCallback(response);
                });
            } else {
                chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16.png' } });
            }
        } else {
            chrome.tabs.sendMessage(tabs[0].id, {changeRun: true, originalHTML: originalHTML[url]}, function (response) {
                setIconCallback(response);
            });
        }
    });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let url = tabs[0].url;
            if (url.indexOf(lightningLocation) > -1) {
                if (url.indexOf('view') != -1 || url.split('#')[1].length == 488) {
                    chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                        setIconCallback(response);
                    });
                } else {
                    chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16.png' } });
                }
            } else {
                chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                    setIconCallback(response);
                });
            }
        });
    });
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var sendInit;
        if(tabURLs[tabID] !== undefined && tabURLs[tabID] !== tab.url) {
            sendInit = true;
        } else {
            sendInit = false;
        }
        tabURLs[tabID] = tab.url;
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            let url = tabs[0].url;
            if (url.indexOf(lightningLocation) > -1) {
                if (url.indexOf('view') != -1 || url.split('#')[1].length == 488) {
                    if(sendInit === true) {
                        chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true, init: true, originalHTML: originalHTML[url]}, function (response) {
                            setIconCallback(response);
                        });
                    } else {
                        chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                            setIconCallback(response);
                        });
                    }
                } else {
                    chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16.png' } });
                }
            } else {
                if(sendInit === true) {
                    chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true, init: true, originalHTML: originalHTML[url]}, function (response) {
                        setIconCallback(response);
                    });
                } else {
                    chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                        setIconCallback(response);
                    });
                }
            }
        });
    }
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    if (message.iframe) {
        chrome.browserAction.setIcon({ 'path': { '16': 'icons/gusmd16-active.png' } });
    }
    if (message.originalHTML && originalHTML[sender.tab.url] === undefined) {
        originalHTML[sender.tab.url] = message.originalHTML;
    }
});


