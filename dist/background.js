function setIconCallback(e){e&&e.runState?chrome.browserAction.setIcon({path:{16:"icons/gusmd16-active.png"}}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16-idle.png"}})}var chrome=window.chrome,originalHTML={},lightningLocation="gus.lightning.force.com",workManagerURL="https://gus.lightning.force.com/one/one.app#/n/Work_Manager",workManagerURL2="https://gus.lightning.force.com/one/one.app?source=aloha#/n/Work_Manager",validPagesRegex=/sObject\/\w{18}\/view|one.app.*?#\w{488}/g,tabURLs={};chrome.browserAction.onClicked.addListener(function(){chrome.tabs.query({active:!0,currentWindow:!0},function(e){if(e.length>0){let n=e[0].url;n===workManagerURL||n===workManagerURL2?chrome.tabs.sendMessage(e[0].id,{getCurrentWorkID:!0},function(n){void 0!==n&&void 0!==n.workID?chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0,changeRun:!0},function(e){setIconCallback(e)}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}})}):n.indexOf(lightningLocation)>-1?null!==n.match(validPagesRegex)?chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0,changeRun:!0,originalHTML:originalHTML[n]},function(e){setIconCallback(e)}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}}):chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0,changeRun:!0,originalHTML:originalHTML[n]},function(e){setIconCallback(e)})}})}),chrome.tabs.onActivated.addListener(function(e){chrome.tabs.get(e.tabId,function(e){chrome.tabs.query({active:!0,currentWindow:!0},function(e){if(e.length>0){let n=e[0].url;n.indexOf(lightningLocation)>-1?null!==n.match(validPagesRegex)?chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0},function(e){setIconCallback(e)}):n===workManagerURL||n===workManagerURL2?chrome.tabs.sendMessage(e[0].id,{getCurrentWorkID:!0},function(n){void 0!==n?chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0},function(e){setIconCallback(e)}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}})}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}}):chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0},function(e){setIconCallback(e)})}})})}),chrome.tabs.onUpdated.addListener(function(e,n,t){if("complete"==n.status){var o=!1;tabURLs[e]!==t.url&&null!==t.url.match(validPagesRegex)&&(o=!0),t.url.indexOf(lightningLocation)>-1&&(tabURLs[e]=t.url),chrome.tabs.query({active:!0,currentWindow:!0},function(e){if(e.length>0){let n=e[0].url;n.indexOf(lightningLocation)>-1?null!==n.match(validPagesRegex)?!0===o?chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0,init:!0,originalHTML:originalHTML[n]},function(e){setIconCallback(e)}):chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0},function(e){setIconCallback(e)}):n===workManagerURL||n===workManagerURL2?chrome.tabs.sendMessage(e[0].id,{getCurrentWorkID:!0},function(n){void 0!==n?chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0},function(e){setIconCallback(e)}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}})}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}}):chrome.tabs.sendMessage(e[0].id,{getCurrentRunState:!0,originalHTML:originalHTML[n]},function(e){setIconCallback(e)})}})}}),chrome.runtime.onMessage.addListener(function(e,n,t){e.originalHTML&&void 0===originalHTML[n.tab.url]&&(originalHTML[n.tab.url]=e.originalHTML),void 0!==e.setIcon&&(!0===e.setIcon?chrome.browserAction.setIcon({path:{16:"icons/gusmd16-active.png"}}):chrome.browserAction.setIcon({path:{16:"icons/gusmd16.png"}}))});
