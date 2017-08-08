import { transformWithMarked } from './texttransform.js';

var userStoryID = 'descriptionInput';
var bugID = 'detailsAndStepsInput';
var investigationID = 'detailsAndStepsInputInvestigation';
var workManagerRun = false;
var specificWorkSelector = 'h2.slds-text-heading--medium a';
var css = {
    classes: {
        mdPreview: 'work-manager-mdpreview',
        titleDiv: 'bugedit-lightning-titlediv',
        title: 'slds-form-element__label'
    }
};
var titleDivs = [];
var mdps = [];
var mdpts = [];
var workID;
var workInterval;
var styleInterval;
var elementInterval;
var getOffsetParents;
var element;
var destinationElement;
var type = '';

window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var responseObj = {received: true};
    // Request.changeRun is set when the chrome extension icon is clicked. The background page
    // gets notified of that event and tells the script to switch what it was doing and run
    // the opposite way (i.e. view vs reset, edit vs reset)
    if (request.changeRun) {
        workManagerRun = !workManagerRun;
        showOrHidePreview();
    }

    if (request.getCurrentRunState) {
        responseObj.runState = workManagerRun;
    }

    // The work id is the work manager and background script's way of telling if a user is actually
    // looking at a bug/user story/investigation or not. If it is undefined, the user is currently
    // on the work manager overview page. Otherwise, workID is set to the work id of whatever work the
    // user is looking at
    if (request.getCurrentWorkID) {
        if (typeof(workID) != 'undefined') {
            responseObj.workID = workID;
        }
    }

    // Here, we send back the script's run state to the background page, so the chrome extension
    // icon can be set accordingly
    sendResponse(responseObj);
});

/**
 * Sets the markdown preview's inner HTML to whatever the markdown would be
 * after being passed through the textTransform function
 * @param  {Event} event The event that is fired by the edit box
 */
function previewEditor (event) {
    var text = event.target.value || event.target.innerHTML;
    // Event.target is the edit box, event.target.prev is the markdown preview box
    mdps[workID][type].innerHTML = transformWithMarked(text);
}

/**
 * Scrolling event handler for edits that scrolls the markdown preview as the edit scrolls,
 * keeping the two in sync
 * @param  {Event} event The event that is fired by the edit box
 */
function scrollEvent (event) {
    mdps[workID][type].scrollTop = event.target.scrollTop;
}

/**
 * Appends a markdown preview to the page
 * @param  {object} css             contains css classes to be applied to new preview elements
 */
function editingPage (css) {
    var td = titleDivs[workID];
    var mdp = mdps[workID];
    var mdpt = mdpts[workID];
    var titleDiv;
    var markdownPreview;
    var markdownPreviewTitle;
    var typeKey;
    // If we have already called this method once, the elements will already exist.
    // They will just be hidden, so we have to show them by setting display to block.
    // Otherwise, we have to create them from scratch
    if (td && td[type]) {
        titleDiv = td[type];
        titleDiv.style.display = 'block';
        for (typeKey in td) {
            if (typeKey !== type) {
                td[typeKey].style.display = 'none';
            }
        }
    } else {
        titleDiv = document.createElement('div');
        titleDiv.style.display = 'block';
        titleDiv.id = 'title-div';
        titleDiv.className = css.classes.titleDiv;
        if (td) {
            td[type] = titleDiv;
            for (typeKey in td) {
                if (typeKey !== type) {
                    td[typeKey].style.display = 'none';
                }
            }
        } else {
            titleDivs[workID] = {};
            titleDivs[workID][type] = titleDiv;
        }
    }
    if (mdp && mdp[type]) {
        markdownPreview = mdp[type];
        markdownPreview.style.display = 'block';
        for (typeKey in mdp) {
            if (typeKey !== type) {
                mdp[typeKey].style.display = 'none';
            }
        }
    } else {
        markdownPreview = document.createElement('div');
        markdownPreview.style.display = 'block';
        markdownPreview.id = 'markdown-preview';
        markdownPreview.className = css.classes.mdPreview;
        if (mdp) {
            mdp[type] = markdownPreview;
            for (typeKey in mdp) {
                if (typeKey !== type) {
                    mdp[typeKey].style.display = 'none';
                }
            }
        } else {
            mdps[workID] = {};
            mdps[workID][type] = markdownPreview;
        }
    }
    if (mdpt && mdpt[type]) {
        markdownPreviewTitle = mdpt[type];
        markdownPreviewTitle.style.display = 'block';
        for (typeKey in mdpt) {
            if (typeKey !== type) {
                mdpt[typeKey].style.display = 'none';
            }
        }
    } else {
        markdownPreviewTitle = document.createElement('label');
        markdownPreviewTitle.style.display = 'block';
        markdownPreviewTitle.id = 'markdown-preview-title';
        markdownPreviewTitle.innerHTML = 'Markdown Preview';
        markdownPreviewTitle.className = css.classes.title;
        if (mdpt) {
            mdpt[type] = markdownPreviewTitle;
            for (typeKey in mdpt) {
                if (typeKey !== type) {
                    mdpt[typeKey].style.display = 'none';
                }
            }
        } else {
            mdpts[workID] = {};
            mdpts[workID][type] = markdownPreviewTitle;
        }
        titleDiv.appendChild(markdownPreviewTitle);
        destinationElement.appendChild(titleDiv);
        destinationElement.appendChild(markdownPreview);
    }
    // Tell the editing box to listen to keyup events, so that rendered
    // markdown can be displayed live as the user types
    var initialKeyup = new CustomEvent('keyup');
    element.addEventListener('keyup', previewEditor);
    // We have to do an initial keyup so that when the page loads the user
    // will see the preview immediately
    element.dispatchEvent(initialKeyup);
    element.addEventListener('scroll', scrollEvent);
}

/**
 * Hides the markdown preview
 */
function editingReset () {
    var typeKey;
    if (titleDivs[workID]) {
        for (typeKey in titleDivs[workID]) {
            titleDivs[workID][typeKey].style.display = 'none';
        }
    }
    if (mdps[workID]) {
        for (typeKey in titleDivs[workID]) {
            mdps[workID][typeKey].style.display = 'none';
        }
    }
    if (mdpts[workID]) {
        for (typeKey in titleDivs[workID]) {
            mdpts[workID][typeKey].style.display = 'none';
        }
    }
}

function waitForElement (elementID) {
    elementInterval = setInterval(function () {
        element = document.querySelector('#' + elementID);
        if (typeof(element) != 'undefined') {
            destinationElement = element.parentElement;
            if (workManagerRun === true) {
                editingPage(css, type);
            } else {
                editingReset(type);
            }
            clearInterval(elementInterval);
        }
    }, 400);
}

// Event handler called by a change in the input radio buttons on a work edit popup
function inputChange (event) {
    if (event.target.checked === true) {
        if (event.target.id === 'recordTypeInputBug') {
            type = 'bug';
            waitForElement(bugID);
        } else if (event.target.id === 'recordTypeInputUserStory') {
            type = 'userStory';
            waitForElement(userStoryID);
        } else {
            type = 'investigation';
            waitForElement(investigationID);
        }
    }
}

// Called when the background script registers that the work manager script needs to rerun
function showOrHidePreview () {
    var userStoryInput = document.querySelector('#recordTypeInputUserStory');
    var bugInput = document.querySelector('#recordTypeInputBug');
    if (userStoryInput.checked === true) {
        type = 'userStory';
        waitForElement(userStoryID);
    } else if (bugInput.checked === true) {
        type = 'bug';
        waitForElement(bugID, 'bug');
    } else {
        type = 'investigation';
        waitForElement(investigationID, 'investigation');
    }
}

// Event handler that is called when a user hits the cancel button.
// Removes all event listeners and intervals, as well as sets the workID to undefined
function leaveEvent (event) {
    if (element !== null && typeof(element) != 'undefined') {
        element.removeEventListener('scroll', scrollEvent);
        element.removeEventListener('keyup', previewEditor);
    }
    var typeKey;
    if (titleDivs[workID]) {
        for (typeKey in titleDivs[workID]) {
            titleDivs[workID][typeKey].style.display = 'none';
        }
    }
    if (mdps[workID]) {
        for (typeKey in titleDivs[workID]) {
            mdps[workID][typeKey].style.display = 'none';
        }
    }
    if (mdpts[workID]) {
        for (typeKey in titleDivs[workID]) {
            mdpts[workID][typeKey].style.display = 'none';
        }
    }
    type = '';
    clearInterval(styleInterval);
    clearInterval(getOffsetParents);
    clearInterval(workInterval);
    workID = undefined;
    window.chrome.runtime.sendMessage({setIcon: false});
}

// Event handler that is called when a user clicks a link to view the selected work in a popup.
// It continually tries to figure out the workID while the popup is open. Its main role is to
// wait for the popup elements to be defined, and then to set the appropriate event handlers
// for them. It also tells the background page that the browser action icon should be set to the
// running state
function linkClickFunction (event) {
    workInterval = setInterval(function () {
        workID = document.querySelector(specificWorkSelector);
        if (workID === null) {
            workID = document.querySelector('h2.slds-text-heading--medium');
        }
        if (workID !== null) {
            workID = workID.innerHTML;
            window.chrome.runtime.sendMessage({setIcon: true});
            workManagerRun = true;
            var userStoryInput = document.querySelector('#recordTypeInputUserStory');
            var bugInput = document.querySelector('#recordTypeInputBug');
            var investigationInput = document.querySelector('#recordTypeInputInvestigation');
            userStoryInput.addEventListener('change', inputChange);
            bugInput.addEventListener('change', inputChange);
            investigationInput.addEventListener('change', inputChange);
            var changeEvent = new Event('change');
            getOffsetParents = setInterval(function () {
                var userStoryOffsetParent = document.querySelector('#' + userStoryID).offsetParent;
                var bugOffsetParent = document.querySelector('#' + bugID).offsetParent;
                var investigationOffsetParent = document.querySelector('#' + investigationID).offsetParent;
                if (userStoryOffsetParent !== null || bugOffsetParent !== null || investigationOffsetParent !== null) {
                    if (bugOffsetParent === null && investigationOffsetParent === null) {
                        userStoryInput.dispatchEvent(changeEvent);
                        clearInterval(getOffsetParents);
                    } else if (userStoryOffsetParent === null && bugOffsetParent === null) {
                        investigationInput.dispatchEvent(changeEvent);
                        clearInterval(getOffsetParents);
                    } else if (userStoryOffsetParent === null && investigationOffsetParent === null) {
                        bugInput.dispatchEvent(changeEvent);
                        clearInterval(getOffsetParents);
                    } else {
                        styleInterval = setInterval(function () {
                            if (bugOffsetParent.style.display === '') {
                                bugInput.dispatchEvent(changeEvent);
                            } else if (userStoryOffsetParent.style.display === '') {
                                userStoryInput.dispatchEvent(changeEvent);
                            } else {
                                investigationInput.dispatchEvent(changeEvent);
                            }
                            clearInterval(styleInterval);
                        }, 400);
                        clearInterval(getOffsetParents);
                    }
                }
            }, 1000);
            clearInterval(workInterval);
        }
    }, 400);
}

// Set event handler for the cancel button, because it exists on the page
// as the same button no matter which work link is clicked
var workCancelButton = document.getElementById('workCancelButton');
workCancelButton.addEventListener('click', leaveEvent);
var getNewWorkButtonInterval = setInterval(function () {
    var newWorkButton = document.querySelector('#buttonNewWork');
    if (newWorkButton !== null) {
        newWorkButton.addEventListener('click', linkClickFunction);
        clearInterval(getNewWorkButtonInterval);
    }
}, 400);

// Continuously be checking for new work links, because they get created on the fly
// as the user scrolls. Add event listeners to whichever ones show up
setInterval(function () {
    var workLinks = document.querySelectorAll('div.long-subject-cell a');
    if (workLinks !== null && workLinks.length > 0) {
        for (var i = 0; i < workLinks.length; i++) {
            workLinks[i].addEventListener('click', linkClickFunction);
        }
    }
}, 200);
