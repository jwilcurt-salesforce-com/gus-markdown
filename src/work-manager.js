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
var getOffsetParents;
var element;
var destinationElement;

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
    if (typeof(workID) !== 'undefined') {
        mdps[workID].innerHTML = transformWithMarked(text);
    }
}

/**
 * Scrolling event handler for edits that scrolls the markdown preview as the edit scrolls,
 * keeping the two in sync
 * @param  {Event} event The event that is fired by the edit box
 */
function scrollEvent (event) {
    if (typeof(workID) != 'undefined') {
        mdps[workID].scrollTop = event.target.scrollTop;
    }
}

/**
 * Appends a markdown preview to the page
 * @param  {object} css   contains css classes to be applied to new preview elements
 */
function editingPage (css) {
    if (typeof(workID) != 'undefined') {
        var td = titleDivs[workID];
        var mdp = mdps[workID];
        var mdpt = mdpts[workID];
        var titleDiv;
        var markdownPreview;
        var markdownPreviewTitle;
        // If we have already called this method once, the elements will already exist.
        // They will just be hidden, so we have to show them by setting display to block.
        // Otherwise, we have to create them from scratch
        if (td) {
            titleDiv = td;
            titleDiv.style.display = 'block';
        } else {
            titleDiv = document.createElement('div');
            titleDiv.id = 'title-div';
            titleDiv.className = css.classes.titleDiv;
            titleDivs[workID] = titleDiv;
        }
        if (mdp) {
            markdownPreview = mdp;
            markdownPreview.style.display = 'block';
        } else {
            markdownPreview = document.createElement('div');
            markdownPreview.id = 'markdown-preview';
            markdownPreview.className = css.classes.mdPreview;
            mdps[workID] = markdownPreview;
        }
        if (mdpt) {
            markdownPreviewTitle = mdpt;
            markdownPreviewTitle.style.display = 'block';
        } else {
            markdownPreviewTitle = document.createElement('label');
            markdownPreviewTitle.id = 'markdown-preview-title';
            markdownPreviewTitle.innerHTML = 'Markdown Preview';
            markdownPreviewTitle.className = css.classes.title;
            mdpts[workID] = markdownPreviewTitle;
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
}

/**
 * Hides the markdown preview
 */
function editingReset () {
    if (typeof(workID) != 'undefined') {
        if (titleDivs[workID]) {
            titleDivs[workID].style.display = 'none';
        }
        if (mdps[workID]) {
            mdps[workID].style.display = 'none';
        }
        if (mdpts[workID]) {
            mdpts[workID].style.display = 'none';
        }
    }
}

function inputChange (event) {
    if (event.target.checked === true) {
        if (event.target.id === 'recordTypeInputBug') {
            element = document.querySelector('#' + bugID);
        } else if (event.target.id === 'recordTypeInputUserStory') {
            element = document.querySelector('#' + userStoryID);
        } else {
            element = document.querySelector('#' + investigationID);
        }
        destinationElement = element.parentElement;
        if (workManagerRun === true) {
            editingPage(css);
        } else {
            editingReset();
        }
    }
}

function showOrHidePreview () {
    if (typeof(workID) !== 'undefined') {
        var userStoryInput = document.querySelector('#recordTypeInputUserStory');
        var bugInput = document.querySelector('#recordTypeInputBug');
        if (userStoryInput.checked === true) {
            element = document.querySelector('#' + userStoryID);
        } else if (bugInput.checked === true) {
            element = document.querySelector('#' + bugID);
        } else {
            element = document.querySelector('#' + investigationID);
        }
        destinationElement = element.parentElement;
        if (workManagerRun === true) {
            editingPage(css);
        } else {
            editingReset();
        }
    }
}

function leaveEvent (event) {
    if (typeof(workID) != 'undefined') {
        if (element !== null && typeof(element) != 'undefined') {
            element.removeEventListener('scroll', scrollEvent);
            element.removeEventListener('keyup', previewEditor);
        }
        if (titleDivs[workID]) {
            titleDivs[workID].style.display = 'none';
        }
        if (mdps[workID]) {
            mdps[workID].style.display = 'none';
        }
        if (mdpts[workID]) {
            mdpts[workID].style.display = 'none';
        }
    }
    clearInterval(styleInterval);
    clearInterval(getOffsetParents);
    clearInterval(workInterval);
    workID = undefined;
    window.chrome.runtime.sendMessage({setIcon: false});
}

function linkClickFunction (event, interval) {
    workInterval = setInterval(function () {
        workID = document.querySelector(specificWorkSelector);
        if (workID !== null) {
            workID = workID.innerHTML;
            clearInterval(workInterval);
        }
    }, 400);
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
}

var workSaveButton = document.getElementById('workSaveButton');
var workCancelButton = document.getElementById('workCancelButton');
workCancelButton.addEventListener('click', leaveEvent);
workSaveButton.addEventListener('click', leaveEvent);

setInterval(function () {
    var workLinks = document.querySelectorAll('div.long-subject-cell a');
    if (workLinks !== null && workLinks.length > 0) {
        for (var i = 0; i < workLinks.length; i++) {
            workLinks[i].addEventListener('click', linkClickFunction);
        }
    }
}, 200);
