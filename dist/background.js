function setIconCallback (response) {
    if(response) {
        if(response.runState) {
            chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-active.png" } } );
        }
        else {
            chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-idle.png" } } );
        }
    }
    else {
        chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-idle.png" } } );
    }
}

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {changeRun: true}, function (response) {
            setIconCallback(response);
        });
    });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function (response) {
                setIconCallback(response);
            });
        });
    });
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function(response) {
            setIconCallback(response);
        });
    });
});


