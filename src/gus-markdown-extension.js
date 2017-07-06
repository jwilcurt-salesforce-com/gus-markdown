import { transformWithMarked } from './texttransform.js';

var lightningLocation = 'gus.lightning.force';
var bugEditPreviewLocation = '/apex/ADM_WorkManager';

var bugEditLightningID = 'bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body'; // eslint-disable-line no-unused-vars
var bugEditLightningIDDest = 'div.slds-col.slds-col--padded.slds-p-bottom--medium.slds-size--1-of-1.slds-medium-size--1-of-1.slds-large-size--1-of-1';
var bugEditLightningCss = {
    classes: {
        mdPreview: 'bugedit-lightning-mdpreview',
        titleDiv: 'bugedit-lightning-titlediv',
        title: 'slds-form-element__label'
    }
};

var userStoryEditLightningID = 'userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer'; // eslint-disable-line no-unused-vars
var userStoryEditLightningCss = {
    classes: {
        mdPreview: 'userstoryedit-lightning-mdpreview',
        titleDiv: 'userstoryedit-lightning-titlediv',
        title: 'slds-form-element__label'
    }
};

var bugEditClassicLocation = '/apex/adm_bugedit';
var bugEditClassicID = 'bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body';
var bugEditClassicDestID = 'richDetailsWrapper';
var bugEditClassicCss = {
    classes: {
        mdPreview: 'inlineEditWrite bugedit-classic-mdpreview',
        titleDiv: 'gusFormFieldLeft bugedit-classic-titlediv',
        title: ''
    }
};

var userStoryEditClassicLocation = '/apex/adm_userstoryedit';
var userStoryEditClassicID = 'userStoryWorkPage:storyWorkForm:detailsInput:formRow:input';
var userStoryEditClassicCss = {
    classes: {
        mdPreview: 'userstoryedit-classic-mdpreview',
        titleDiv: 'gusFormFieldLeft userstoryedit-classic-titlediv',
        title: ''
    }
};
var userStoryDetailClassicLocation = '/apex/adm_userstorydetail';
var userStoryDetailClassicID = 'userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner';

var bugDetailClassicLocation = '/apex/adm_bugdetail';
var bugDetailClassicID = 'bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div';

var lightningBugEdit;
var iframeContext = false;
window.gusMarkdownRun = true;
var originalHTML = '';
var originalHTMLFromBackground = {};

/*
Lightning mode bug edit is a special case because it loads two iframes inside the main page, both of which are from a different domain
than the main page. This gives us CORS errors because we need to access the innermost frame. To get around this, we set up the chrome
extension to run this script inside the top frame as well as the middle frame. So, the script running inside the middle frame has
access to the script in the innermost frame. This function allows us to set variables so that we know which script we are in, the outermost
one or the middle one. If we are in the middle one, we do everything as normal, if we are in the outermost one we don't want to change any
of the page's DOM. However, the outermost script is still set up to listen to messages because when, for example, a different bug or user
story is clicked on, the outermost script will still be running but the middle script will be discarded upon navigation away from the page.
The outermost script will run for the entirety of the time that the user is in lightning mode, since chrome extension url matching for
content scripts doesn't provide the specificity necessary for running on only the individual lightning mode pages we want.
 */
function checkForLightningBugEdit () {
    if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') == -1 && document.querySelector('#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer') === null) {
        lightningBugEdit = true;
        //if this exists, do stuff from iframe context
        if (document.querySelector('body.desktop') === null) {
            iframeContext = true;
        }
    } else {
        lightningBugEdit = false;
        iframeContext = false;
    }
}

/*
This is where the script receives its instructions from the background page. The script always
sends back if it is currently running or not (green or white circle on icon).
 */
window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var responseObj = {received: true};
    // Background page stores original html for every bug or user story that is visited.
    // Each one has a specific url associated to it, so we store them this way so we can
    // be sure that the script can always inject the correct original html into the correct
    // location.
    if (request.originalHTML) {
        originalHTMLFromBackground[location.href] = request.originalHTML;
    }
    // Request.changeRun is set when the chrome extension icon is clicked. The background page
    // gets notified of that event and tells the script to switch what it was doing and run
    // the opposite way (i.e. view vs reset, edit vs reset)
    if (request.changeRun) {
        window.gusMarkdownRun = !window.gusMarkdownRun;
        initialize();
    }
    // This only happens in lightning mode, since navigation to a different story or bug does
    // not cause a new content script to be injected. When this event happens, we want the
    // script to initialize in either view or edit mode, so we set window.gusMarkdownRun to true
    if (request.init) {
        window.gusMarkdownRun = true;
        initialize();
    }
    // This actually always happens, but it fits into the layout nicely
    if (request.getCurrentRunState) {
        responseObj.runState = window.gusMarkdownRun;
    }
    // Here, we send back the script's run state to the background page, so the chrome extension
    // icon can be set accordingly
    sendResponse(responseObj);
});

/**
 * Changes a user story or bug's description to be rendered in Markdown
 * @param  {Element} descriptionBoxEl   the element that contains the text in the description
 */
function viewingPage (descriptionBoxEl) {
    var descriptionBoxHTML = '';
    if (descriptionBoxEl) {
        descriptionBoxHTML = descriptionBoxEl.innerHTML;
        originalHTML = descriptionBoxEl.innerHTML;
        // Here we send the original html on the page to the background page. This happens as many
        // times as the chrome extension icon is clicked divided by two, but it is only important
        // the first time, because the first time is when we can be sure that the original html
        // is what it is supposed to be
        window.chrome.runtime.sendMessage({originalHTML: originalHTML});
    }
    if (descriptionBoxHTML.length > 0) {
        // Here is where we set the bug or user story description to be the rendered markdown
        // If it's the first time on this bug or user story, the script will not have yet
        // received the original HTML from the background. Any other time, it will have
        // received that so it will use it.
        if (originalHTMLFromBackground[location.href] !== undefined) {
            descriptionBoxEl.innerHTML = transformWithMarked(originalHTMLFromBackground[location.href]);
        } else {
            descriptionBoxEl.innerHTML = transformWithMarked(descriptionBoxHTML);
        }
    }
}

/**
 * Sets the user story or bug's description back to what it was pre-Markdown
 * @param  {Element} descriptionBoxEl   the element that contains the text in the description
 */
function viewingReset (descriptionBoxEl) {
    descriptionBoxEl.innerHTML = originalHTMLFromBackground[location.href];
}

/**
 * Sets the markdown preview's inner HTML to whatever the markdown would be
 * after being passed through the transformWithMarked function
 * @param  {Event} event The event that is fired by the bug or user story edit box
 */
function previewEditor (event) {
    var text = event.target.value || event.target.innerHTML;
    // Event.target is the edit box, event.target.prev is the markdown preview box
    event.target.prev.innerHTML = transformWithMarked()(text);
}

/**
 * Scrolling event handler for bug edits that scrolls the markdown preview as the edit scrolls,
 * keeping the two in sync
 * @param  {Event} event The event that is fired by the bug edit box
 */
function bugScroll (event) {
    document.querySelector('#markdown-preview').scrollTop = event.target.scrollingElement.scrollTop;
}

/**
 * Scrolling event handler for user story edits that scrolls the markdown preview as the edit scrolls,
 * keeping the two in sync
 * @param  {Event} event The event that is fired by the user story edit box
 */
function userstoryScroll (event) {
    document.querySelector('#markdown-preview').scrollTop = event.target.scrollTop;
}


/**
 * Sets the markdown preview based on user entered text on editing pages.
 * @param  {object} elem                This is an already selected element on the page to be the markdown source
 * @param  {object} destinationElement  This is an already selected element on the page for the html to be injected
 * @param {object} css                  Object that contains class names to be applied to different elements
 */
function editingPage (elem, destinationElement, css) {
    var td = document.querySelector('#title-div');
    var mdp = document.querySelector('#markdown-preview');
    var mdpt = document.querySelector('#markdown-preview-title');
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
    }
    if (mdp) {
        markdownPreview = mdp;
        markdownPreview.style.display = 'block';
    } else {
        markdownPreview = document.createElement('div');
        markdownPreview.id = 'markdown-preview';
        markdownPreview.className = css.classes.mdPreview;
    }
    if (mdpt) {
        markdownPreviewTitle = mdpt;
        markdownPreviewTitle.style.display = 'block';
    } else {
        markdownPreviewTitle = document.createElement('label');
        markdownPreviewTitle.id = 'markdown-preview-title';
        markdownPreviewTitle.innerHTML = 'Markdown Preview';
        markdownPreviewTitle.className = css.classes.title;
        titleDiv.appendChild(markdownPreviewTitle);
        destinationElement.appendChild(titleDiv);
        destinationElement.appendChild(markdownPreview);
        elem.prev = markdownPreview;
    }

    // Tell the editing box to listen to keyup events, so that rendered
    // markdown can be displayed live as the user types
    var initialKeyup = new CustomEvent('keyup');
    elem.addEventListener('keyup', previewEditor);
    // We have to do an initial keyup so that when the page loads the user
    // will see the preview immediately
    elem.dispatchEvent(initialKeyup);

}

/**
 * Makes the markdown preview invisible on bug or user story edits, happens
 * when the user clicks the chrome extension icon every other time. Also removes
 * the event listener for the live preview
 * @param  {Element} elem The element that has the event listener
 */
function editingReset (elem) {
    elem.removeEventListener('keyup', previewEditor);
    document.querySelector('#title-div').style.display = 'none';
    document.querySelector('#markdown-preview').style.display = 'none';
    document.querySelector('#markdown-preview-title').style.display = 'none';
}

/*
clears the markdown box by forcing the script to rerun by giving it a keyboard event,
which causes the script to deselect the current element.
*/
function clearMarkDownPreview (element) {
    element.focus();
    element.select();
    var keyboardEvent = document.createEvent('KeyboardEvent');
    var initMethod;
    if (typeof keyboardEvent.initKeyboardEvent !== 'undefined') {
        initMethod = 'initKeyboardEvent';
    } else {
        initMethod = 'initKeyEvent';
    }
    keyboardEvent[initMethod](
   'keydown', // event type : keydown, keyup, keypress
    true, // bubbles
    true, // cancelable
    window, // viewArg: should be window
    false, // ctrlKeyArg
    false, // altKeyArg
    false, // shiftKeyArg
    false, // metaKeyArg
    40, // keyCodeArg : unsigned long the virtual key code, else 0
    0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
    );
    element.dispatchEvent(keyboardEvent);
}

/**
 * Returns an iframe from the document
 * @param  {number} iframeNum   The index containing the desired iframe
 * @return {Element}            Returns the iframe
 */
function getIframe (iframeNum) {
    return document.querySelectorAll('iframe')[iframeNum];
}

/**
 * Utility function that calls the correct editing or viewing function
 * based on parameters
 * @param  {Element} elem           Element that contains bug or user story description
 * @param  {Boolean} edit           True if the user is editing, false if they are viewing
 * @param  {Element} destElem       Element that the markdown preview is appended to
 * @param  {Object} css             Contains all of the css classes to match the page's css
 */
function showOrHideMarkdown (elem, edit, destElem, css) {
    if (edit == true) {
        if (window.gusMarkdownRun) {
            editingPage(elem, destElem, css);
        } else {
            editingReset(elem);
        }
    } else {
        if (window.gusMarkdownRun) {
            viewingPage(elem);
        } else {
            viewingReset(elem);
        }
    }
}

/**
 * Adds or removes an event listener with a given event type and handler function,
 * based on if the extension is being run or not
 * @param  {Element} element    The element that has or will have the event
 * @param  {string} eventType   The type of event, i.e. "scroll"
 * @param  {function} func      The event handler
 */
function addOrRemoveEventListener (element, eventType, func) {
    if (window.gusMarkdownRun) {
        element.addEventListener(eventType, func);
    } else {
        element.removeEventListener(eventType, func);
    }
}

/**
 * Helper function that is repeated a lot in the initialize function. Looks for an
 * element that the page is actually using, because sometimes there are duplicates
 * on the page that aren't being used currently and actually contain old information
 * to throw us off.
 * @param  {Element[]} elements     List of possible elements found by document.querySelectorAll
 * @param  {string} description     Logged to the console if we find the element
 * @param  {Interval} interval      This interval is cleared if we find the element
 * @return {Boolean}                True if an element was found, false if it wasn't
 */
function lightningDetailFindCorrectElement (elements, description, interval) {
    for (var i = 0; i < elements.length; i++) {
        let element = elements[i];
        if (element.offsetParent !== null) {
            console.log(description); // eslint-disable-line no-console
            showOrHideMarkdown(element, false);
            clearInterval(interval);
            return true;
        }
    }
    return false;
}

/**
 * Function that controls everything. It's run when the page loads. Figures out what kind of page we are on (bugedit classic,
 * userstorydetail lightning, etc.) and sets the rest of the event handlers and variables accordingly.
 */
function initialize () {
    // Always update these variables every time we run this function, because we don't want the outermost script in bugedit lightning
    // to do anything in here
    checkForLightningBugEdit();
    var element;
    var destinationElement;
    var iframe;
    var checkIframeExistence;
    if (!lightningBugEdit || (iframeContext && lightningBugEdit)) {
        if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') == -1) {
            if (document.querySelector('#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer') !== null) {
                console.log('userstoryedit lightning'); // eslint-disable-line no-console
                element = document.getElementById(userStoryEditLightningID);
                destinationElement = element.parentElement;
                addOrRemoveEventListener(element, 'scroll', userstoryScroll);
                showOrHideMarkdown(element, true, destinationElement, userStoryEditLightningCss);
            } else {
                // If it is not a user story edit, must be a bug edit. In that case, we have to wait for the innermost iframe to be
                // defined before we can access it
                checkIframeExistence = setInterval(function () {
                    if (typeof(iframe) == 'undefined') {
                        iframe = getIframe(0);
                    } else {
                        console.log('bugedit lightning'); // eslint-disable-line no-console
                        element = iframe.contentDocument.getElementById(bugEditLightningID);
                        if (typeof(element) == 'undefined' || element === null) {
                            // Even though the iframe is defined, it hasn't been fully loaded yet, so
                            // we have to wait for this to happen before we can access its elements
                            iframe.onload = function () {
                                element = iframe.contentDocument.getElementById(bugEditLightningID);
                                destinationElement = document.querySelectorAll(bugEditLightningIDDest)[1];
                                showOrHideMarkdown(element, true, destinationElement, bugEditLightningCss);
                                addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                            };
                            clearInterval(checkIframeExistence);
                        } else {
                            destinationElement = document.querySelectorAll(bugEditLightningIDDest)[1];
                            showOrHideMarkdown(element, true, destinationElement, bugEditLightningCss);
                            addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                            clearInterval(checkIframeExistence);
                        }
                    }
                }, 200);
            }
        } else if (location.href.indexOf(bugEditClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
            console.log('bugedit classic'); // eslint-disable-line no-console
            // Wait for the iframe to be defined
            checkIframeExistence = setInterval(function () {
                if (typeof(iframe) == 'undefined') {
                    iframe = getIframe(1);
                } else {
                    element = iframe.contentDocument.getElementById(bugEditClassicID);
                    destinationElement = document.getElementById(bugEditClassicDestID);
                    //In this case, the iframe has not yet loaded, so we wait for it to load
                    //Otherwise, we just go right ahead and use the elements
                    if (typeof(element) == 'undefined' || element === null) {
                        iframe.onload = function () {
                            element = iframe.contentWindow.document.getElementById(bugEditClassicID);
                            destinationElement = document.getElementById(bugEditClassicDestID);
                            showOrHideMarkdown(element, true, destinationElement, bugEditClassicCss);
                            addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                        };
                        clearInterval(checkIframeExistence);
                    } else {
                        showOrHideMarkdown(element, true, destinationElement, bugEditClassicCss);
                        addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                        clearInterval(checkIframeExistence);
                    }
                }
            }, 200);

        } else if (location.href.indexOf(bugEditPreviewLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
            console.log('bugedit classic preview'); // eslint-disable-line no-console
            setTimeout(function (){}, 200);
            element = document.getElementById('descriptionInput');
            if (element != null){
                destinationElement = element.parentElement;
                editingPage(element, destinationElement);
                var saveButton = document.getElementById('workSaveButton');
                var cancelButton = document.getElementById('workCancelButton');
                if (cancelButton.addEventListener){
                    cancelButton.addEventListener('click', function () {
                        clearMarkDownPreview(element);
                    }, false);
                }
                if (saveButton.addEventListener){
                    saveButton.addEventListener('click', function () {
                        clearMarkDownPreview(element);
                    }, false);
                }
            }

        } else if (location.href.indexOf(userStoryEditClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
            console.log('userstoryedit classic'); // eslint-disable-line no-console
            element = document.getElementById(userStoryEditClassicID);
            destinationElement = element.parentElement;
            showOrHideMarkdown(element, true, destinationElement, userStoryEditClassicCss);
            addOrRemoveEventListener(element, 'scroll', userstoryScroll);

        } else if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') > -1) {
            let interval = setInterval(function () {
                let elements = document.querySelectorAll('div.slds-rich-text-editor__output.uiOutputRichText.forceOutputRichText');
                if (elements.length > 0) {
                    var found = lightningDetailFindCorrectElement(elements, 'bugdetail lightning', interval);
                    if (found === false) {
                        elements = document.querySelectorAll('span.uiOutputTextArea');
                        if (elements.length > 0) {
                            lightningDetailFindCorrectElement(elements, 'userstorydetail lightning', interval);
                        }
                    }
                } else {
                    elements = document.querySelectorAll('span.uiOutputTextArea');
                    if (elements.length > 0) {
                        lightningDetailFindCorrectElement(elements, 'userstorydetail lightning', interval);
                    }
                }
            }, 500);

        } else if (location.href.indexOf(userStoryDetailClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
            console.log('userstorydetail classic'); // eslint-disable-line no-console
            let element = document.getElementById(userStoryDetailClassicID);
            showOrHideMarkdown(element, false);

        } else if (location.href.indexOf(bugDetailClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
            console.log('bugdetail classic'); // eslint-disable-line no-console
            let element = document.getElementById(bugDetailClassicID);
            showOrHideMarkdown(element, false);

        } else {
            window.gusMarkdownRun = false;
            console.log('not found'); // eslint-disable-line no-console
        }
    }
}

// We run this when the script first fires up
initialize();
