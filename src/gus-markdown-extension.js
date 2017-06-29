import textTransform from './texttransform.js';

var lightningBugEdit = false;
var iframeContext = false;

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


if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') == -1 && document.querySelector('#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer') === null) {
    lightningBugEdit = true;
    //if this exists, do stuff from iframe context
    if (document.querySelector('body.desktop') === null) {
        iframeContext = true;
        window.chrome.runtime.sendMessage({iframe: true});
    }
}

if (!lightningBugEdit || (lightningBugEdit && iframeContext)) {
    window.gusMarkdownRun = true;
    var originalHTML = '';

    window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var responseObj = {received: true};
        responseObj.originalHTML = originalHTML;
        if (request.originalHTML) {
            originalHTML = request.originalHTML;
        }
        if (request.changeRun) {
            window.gusMarkdownRun = !window.gusMarkdownRun;
            initialize();
        }
        responseObj.runState = window.gusMarkdownRun;
        sendResponse(responseObj);
    });

    initialize();
}

function viewingPage (descriptionBoxEl) {
    var descriptionBoxHTML = '';
    if (descriptionBoxEl) {
        descriptionBoxHTML = descriptionBoxEl.innerHTML;
        originalHTML = descriptionBoxEl.innerHTML;
        window.chrome.runtime.sendMessage({originalHTML: originalHTML});
    }
    if (descriptionBoxHTML.length > 0) {
        descriptionBoxEl.innerHTML = textTransform(descriptionBoxHTML);
    }
}

function viewingReset (descriptionBoxEl) {
    descriptionBoxEl.innerHTML = originalHTML;
}

function previewEditor (event) {
    var text = event.target.value || event.target.innerText;
    event.target.prev.innerHTML = textTransform(text);
}

function bugScroll (event) {
    document.querySelector('#markdown-preview').scrollTop = event.target.scrollingElement.scrollTop;
}

function userstoryScroll (event) {
    document.querySelector('#markdown-preview').scrollTop = event.target.scrollTop;
}


/**
 * Sets the markdown preview based on user entered text on editing pages.
 * @param  {object} element            This is an already selected element on the page to be the markdown source
 * @param  {object} destinationElement This is an already selected element on the page for the html to be injected
 */
function editingPage (elem, destinationElement, css) {
    var td = document.querySelector('#title-div');
    var mdp = document.querySelector('#markdown-preview');
    var mdpt = document.querySelector('#markdown-preview-title');
    var titleDiv;
    var markdownPreview;
    var markdownPreviewTitle;
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

    var initialKeydown = new CustomEvent('keydown');
    elem.addEventListener('keydown', previewEditor);
    elem.dispatchEvent(initialKeydown);

}

function editingReset (elem) {
    elem.removeEventListener('keydown', previewEditor);
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

function getIframe (iframeNum) {
    return document.querySelectorAll('iframe')[iframeNum];
}

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

function initialize () {
    // Depending on if it's a Bug or Story, there are different horrendous ID's used on the page
    // So we detect the URL and pass in the correct value to the correct function.
    var element;
    var destinationElement;
    var iframe;
    var checkIframeExistence;
    if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') == -1) {
        if (document.querySelector('#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer') !== null) {
            console.log('userstoryedit lightning'); // eslint-disable-line no-console
            element = document.getElementById(userStoryEditLightningID);
            destinationElement = element.parentElement;
            if (window.gusMarkdownRun) {
                element.addEventListener('scroll', userstoryScroll);
            } else {
                element.removeEventListener('scroll', userstoryScroll);
            }
            showOrHideMarkdown(element, true, destinationElement, userStoryEditLightningCss);
        } else {
            checkIframeExistence = setInterval(function () {
                if (typeof(iframe) == 'undefined') {
                    iframe = getIframe(0);
                } else {
                    console.log('bugedit lightning'); // eslint-disable-line no-console
                    element = iframe.contentDocument.getElementById(bugEditLightningID);
                    if (typeof(element) == 'undefined' || element === null) {
                        iframe.onload = function () {
                            element = iframe.contentDocument.getElementById(bugEditLightningID);
                            destinationElement = document.querySelectorAll(bugEditLightningIDDest)[1];
                            showOrHideMarkdown(element, true, destinationElement, bugEditLightningCss);
                            if (window.gusMarkdownRun) {
                                element.ownerDocument.addEventListener('scroll', bugScroll);
                            } else {
                                element.ownerDocument.removeEventListener('scroll', bugScroll);
                            }
                        };
                        clearInterval(checkIframeExistence);
                    } else {
                        destinationElement = document.querySelectorAll(bugEditLightningIDDest)[1];
                        showOrHideMarkdown(element, true, destinationElement, bugEditLightningCss);
                        if (window.gusMarkdownRun) {
                            element.ownerDocument.addEventListener('scroll', bugScroll);
                        } else {
                            element.ownerDocument.removeEventListener('scroll', bugScroll);
                        }
                        clearInterval(checkIframeExistence);
                    }
                }
            }, 200);
        }
    } else if (location.href.indexOf(bugEditClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
        console.log('bugedit classic'); // eslint-disable-line no-console
        checkIframeExistence = setInterval(function () {
            if (typeof(iframe) == 'undefined') {
                iframe = getIframe(1);
            } else {
                element = iframe.contentWindow.document.getElementById(bugEditClassicID);
                destinationElement = document.getElementById(bugEditClassicDestID);
                //In this case, the iframe has not yet loaded, so we wait for it to load
                //Otherwise, we just go right ahead and use the elements
                if (typeof(element) == 'undefined' || element === null) {
                    iframe.onload = function () {
                        element = iframe.contentWindow.document.getElementById(bugEditClassicID);
                        destinationElement = document.getElementById(bugEditClassicDestID);
                        showOrHideMarkdown(element, true, destinationElement, bugEditClassicCss);
                        if (window.gusMarkdownRun) {
                            element.ownerDocument.addEventListener('scroll', bugScroll);
                        } else {
                            element.ownerDocument.removeEventListener('scroll', bugScroll);
                        }
                    };
                    clearInterval(checkIframeExistence);
                } else {
                    showOrHideMarkdown(element, true, destinationElement, bugEditClassicCss);
                    if (window.gusMarkdownRun) {
                        element.ownerDocument.addEventListener('scroll', bugScroll);
                    } else {
                        element.ownerDocument.removeEventListener('scroll', bugScroll);
                    }
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
        if (window.gusMarkdownRun) {
            element.addEventListener('scroll', userstoryScroll);
        } else {
            element.removeEventListener('scroll', userstoryScroll);
        }

    } else if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') > -1) {
        console.log('userstorydetail lightning'); // eslint-disable-line no-console
        let getDescriptionElement = setInterval(function () {
            let element = document.querySelector('span.uiOutputTextArea');
            if (element !== null) {
                if (window.gusMarkdownRun) {
                    viewingPage(element);
                } else {
                    viewingReset(element);
                }
                clearInterval(getDescriptionElement);
            }
        }, 200);
        let getWorkTypeInterval = setInterval(function () {
            let workTypeDiv = document.querySelector('div.recordTypeName.slds-grow');
            if (workTypeDiv !== null) {
                let workType = workTypeDiv.childNodes[0].innerHTML;
                if (workType === 'Bug') {
                    console.log('bugdetail lightning'); // eslint-disable-line no-console
                    let element = document.querySelector('div.slds-rich-text-editor__output.uiOutputRichText.forceOutputRichText');
                    if (window.gusMarkdownRun) {
                        viewingPage(element);
                    } else {
                        viewingReset(element);
                    }
                    clearInterval(getWorkTypeInterval);
                }
            }
        }, 200);

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
