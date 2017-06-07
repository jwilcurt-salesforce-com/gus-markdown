var run = true;

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {changeRun: true}, function(response) {
        if(response) {
            run = response.runState;
            if(run) {
                chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-active.png" } } );
            }
            else {
                chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-idle.png" } } );
            }
        }
      });
    });
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if(tab.url.indexOf('https://gus.my.salesforce.com/apex/adm_') > -1 || tab.url.indexOf('https://gus.lightning.force.com/one/one.app/') > -1) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {getCurrentRunState: true}, function(response) {
                    if(response) {
                        run = response.runState;
                        if(run) {
                            chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-active.png" } } );
                        }
                        else {
                            chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-idle.png" } } );
                        }
                    }
                });
            });
        }
        else {
            run = false;
            chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-idle.png" } } );
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabID, changeInfo, tab) {
    if(tab.url.indexOf('https://gus.my.salesforce.com/apex/adm_') > -1 || tab.url.indexOf('https://gus.lightning.force.com/one/one.app/') > -1) {
        run = true;
        chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-active.png" } } );
    }
    else {
        run = false;
        chrome.browserAction.setIcon( {"path": { '16': "icons/gusmd16-idle.png" } } );
    }
});
