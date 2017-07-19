import { transformWithMarked } from './texttransform.js';

var lightningLocation = 'gus.lightning.force';

var investigationEditLightningID = 'investigationEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body';

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

var investigationEditClassicLocation = '/apex/adm_investigationedit';
var investigationEditClassicID = 'investigationWorkPage:investigationForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body';
var investigationEditClassicDestID = 'gusForm1Column';
var investigationEditClassicCss = {
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

var investigationDetailClassicLocation = '/apex/adm_investigationdetail';
var investigationDetailClassicID = 'investigationDetailPage:investigationWorkForm:j_id88investigationDetailPage:investigationWorkForm:j_id88_00NB0000000FiIs_div';

var lightningBugOrInvestigationEdit;
var iframeContext = false;
window.gusMarkdownRun = true;
var originalHTML = '';
var originalHTMLFromBackground = {};
var validLocationRegex = /sObject\/\w{18}\/view|one.app#\w{488}/g;

/**
 * First check we run before any attempt to run the extension logic. Makes sure we are on a page that the extension would run on.
 * @return {boolean} Whether or not the current location is valid
 */
function checkValidLocation () {
    // If the url contains alohaRedirect, the page is basically in the process of loading, so we tell the background page. The
    // background page will continually respond to this message, telling this script to run initialize again. Eventually, the url
    // won't contain alohaRedirect and we will know if the page is valid or invalid
    if (location.href.indexOf('alohaRedirect') > -1) {
        setTimeout(function () {
            initialize();
        }, 200);
        return false;
    } else if (location.href.indexOf('https://gus.my.salesforce.com/apex/adm_') > -1) {  // if we are in classic mode
        return true;
    } else if (location.href.indexOf(lightningLocation) && location.href.match(validLocationRegex) !== null) { // if we are in lightning mode
        return true;
    } else {
        return false;
    }
}

/*
Lightning mode bug edit (and investigation edit) is a special case because it loads two iframes inside the main page, both of which are from a different domain
than the main page. This gives us CORS errors because we need to access the innermost frame. To get around this, we set up the chrome
extension to run this script inside the top frame as well as the middle frame. So, the script running inside the middle frame has
access to the script in the innermost frame. This function allows us to set variables so that we know which script we are in, the outermost
one or the middle one. If we are in the middle one, we do everything as normal, if we are in the outermost one we don't want to change any
of the page's DOM. However, the outermost script is still set up to listen to messages because when, for example, a different bug or user
story is clicked on, the outermost script will still be running but the middle script will be discarded upon navigation away from the page.
The outermost script will run for the entirety of the time that the user is in lightning mode, since chrome extension url matching for
content scripts doesn't provide the specificity necessary for running on only the individual lightning mode pages we want.
 */
function checkForlightningBugOrInvestigationEdit () {
    if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') === -1 && document.querySelector('#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer') === null) {
        lightningBugOrInvestigationEdit = true;
        //if this exists, do stuff from iframe context
        if (document.querySelector('body.desktop') === null) {
            iframeContext = true;
        }
    } else {
        lightningBugOrInvestigationEdit = false;
        iframeContext = false;
    }
}

/*
This is where the script receives its instructions from the background page. The script always
sends back if it is currently running or not (green or white circle on icon).
 */
window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (location.href !== 'https://gus.lightning.force.com/one/one.app#/n/Work_Manager') {
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
        // script to re-initialize
        if (request.init) {
            initialize();
        }
        // This actually always happens, but it fits into the layout nicely
        if (request.getCurrentRunState) {
            responseObj.runState = window.gusMarkdownRun;
        }

        // Here, we send back the script's run state to the background page, so the chrome extension
        // icon can be set accordingly
        sendResponse(responseObj);
    }
});

/**
 * Changes a user story, investigation, or bug's description to be rendered in Markdown
 * @param  {Element} descriptionBoxEl   the element that contains the text in the description
 */
function viewingPage (descriptionBoxEl) {
    var descriptionBoxHTML = '';
    if (descriptionBoxEl) {
        if (location.href.indexOf(lightningLocation) > -1) {
            if (!descriptionBoxEl.classList.contains('customPre')) {
                descriptionBoxEl.classList.add('customPre');
            }
        }
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
 * Sets the user story or bug's (or investigation's) description back to what it was pre-Markdown
 * @param  {Element} descriptionBoxEl   the element that contains the text in the description
 */
function viewingReset (descriptionBoxEl) {
    if (originalHTMLFromBackground[location.href]) {
        descriptionBoxEl.innerHTML = originalHTMLFromBackground[location.href];
    }
}

/**
 * Sets the markdown preview's inner HTML to whatever the markdown would be
 * after being passed through the textTransform function
 * @param  {Event} event The event that is fired by the bug or user story (or investigation) edit box
 */
function previewEditor (event) {
    var text = event.target.value || event.target.innerHTML;
    // Event.target is the edit box, event.target.prev is the markdown preview box
    event.target.prev.innerHTML = transformWithMarked(text);
}

/**
 * Scrolling event handler for bug (or investigation) edits that scrolls the markdown preview as the edit scrolls,
 * keeping the two in sync
 * @param  {Event} event The event that is fired by the bug (or investigation) edit box
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
 * @param  {Element} elem           Element that contains bug or user story or investigation description
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
 * Helper function called to initialize either a bug or investigation edit in lightning,
 * they are essentially the same
 * @param  {element} element        contains the work description
 * @param  {iframe} iframe          contains the element
 */
function editInit (element, iframe) {
    if (element === null) {
        // Even though the iframe is defined, it hasn't been fully loaded yet, so
        // we have to wait for this to happen before we can access its elements
        iframe.onload = function () {
            element = iframe.contentDocument.getElementById(bugEditLightningID);
            var destElement = document.querySelectorAll(bugEditLightningIDDest)[1];
            showOrHideMarkdown(element, true, destElement, bugEditLightningCss);
            addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
        };
    } else {
        var destElement = document.querySelectorAll(bugEditLightningIDDest)[1];
        showOrHideMarkdown(element, true, destElement, bugEditLightningCss);
        addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
    }
}

/**
 * Function that controls everything. It's run when the page loads. Figures out what kind of page we are on (bugedit classic,
 * userstorydetail lightning, etc.) and sets the rest of the event handlers and variables accordingly.
 */
function initialize () {
    // Always update these variables every time we run this function, because we don't want the outermost script in bugedit lightning
    // to do anything in here
    var validLocation = checkValidLocation();
    if (validLocation === true) {
        checkForlightningBugOrInvestigationEdit();
        var element;
        var destinationElement;
        var iframe;
        var checkIframeExistence;
        if (!lightningBugOrInvestigationEdit || (iframeContext && lightningBugOrInvestigationEdit)) {
            if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') == -1) {
                if (document.querySelector('#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer') !== null) {
                    console.log('userstoryedit lightning'); // eslint-disable-line no-console
                    element = document.getElementById(userStoryEditLightningID);
                    destinationElement = element.parentElement;
                    addOrRemoveEventListener(element, 'scroll', userstoryScroll);
                    showOrHideMarkdown(element, true, destinationElement, userStoryEditLightningCss);
                } else {
                    // If it is not a user story edit, must be an investigation or bug edit. In that case, we have to wait for the innermost iframe to be
                    // defined before we can access it
                    checkIframeExistence = setInterval(function () {
                        if (typeof(iframe) == 'undefined') {
                            var querySelectorAllIndex = 0;
                            iframe = getIframe(querySelectorAllIndex);
                        } else {
                            clearInterval(checkIframeExistence);
                            if (location.href.indexOf('adm_investigationedit') > -1) {
                                console.log('investigationedit lightning'); // eslint-disable-line no-console
                                element = iframe.contentDocument.getElementById(investigationEditLightningID);
                                editInit(element, iframe);
                            } else {
                                console.log('bugedit lightning'); // eslint-disable-line no-console
                                element = iframe.contentDocument.getElementById(bugEditLightningID);
                                editInit(element, iframe);
                            }
                        }
                    }, 200);
                }
            } else if (location.href.indexOf(bugEditClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
                console.log('bugedit classic'); // eslint-disable-line no-console
                // Wait for the iframe to be defined
                checkIframeExistence = setInterval(function () {
                    if (typeof(iframe) == 'undefined') {
                        var querySelectorAllIndex = 1;
                        iframe = getIframe(querySelectorAllIndex);
                    } else {
                        clearInterval(checkIframeExistence);
                        element = iframe.contentDocument.getElementById(bugEditClassicID);
                        destinationElement = document.getElementById(bugEditClassicDestID);
                        //In this case, the iframe has not yet loaded, so we wait for it to load
                        //Otherwise, we just go right ahead and use the elements
                        if (element === null) {
                            iframe.onload = function () {
                                element = iframe.contentWindow.document.getElementById(bugEditClassicID);
                                destinationElement = document.getElementById(bugEditClassicDestID);
                                showOrHideMarkdown(element, true, destinationElement, bugEditClassicCss);
                                addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                            };
                        } else {
                            showOrHideMarkdown(element, true, destinationElement, bugEditClassicCss);
                            addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                        }
                    }
                }, 200);

            } else if (location.href.indexOf(investigationEditClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
                console.log('investigationedit classic'); // eslint-disable-line no-console
                // Wait for the iframe to be defined
                checkIframeExistence = setInterval(function () {
                    if (typeof(iframe) == 'undefined') {
                        var querySelectorAllIndex = 1;
                        iframe = getIframe(querySelectorAllIndex);
                    } else {
                        clearInterval(checkIframeExistence);
                        element = iframe.contentDocument.getElementById(investigationEditClassicID);
                        destinationElement = document.querySelector('.' + investigationEditClassicDestID);
                        //In this case, the iframe has not yet loaded, so we wait for it to load
                        //Otherwise, we just go right ahead and use the elements
                        if (element === null) {
                            iframe.onload = function () {
                                element = iframe.contentWindow.document.getElementById(investigationEditClassicID);
                                destinationElement = document.querySelector('.' + investigationEditClassicDestID);
                                showOrHideMarkdown(element, true, destinationElement, investigationEditClassicCss);
                                addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                            };
                        } else {
                            showOrHideMarkdown(element, true, destinationElement, investigationEditClassicCss);
                            addOrRemoveEventListener(element.ownerDocument, 'scroll', bugScroll);
                        }
                    }
                }, 200);

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
                        var found = lightningDetailFindCorrectElement(elements, 'bugorinvestigationdetail lightning', interval);
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

            } else if (location.href.indexOf(investigationDetailClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
                console.log('investigationdetail classic'); // eslint-disable-line no-console
                let element = document.getElementById(investigationDetailClassicID);
                showOrHideMarkdown(element, false);

            } else {
                window.gusMarkdownRun = false;
                console.log('not found'); // eslint-disable-line no-console
            }
        }
    }
}

// We run this when the script first fires up
initialize();
