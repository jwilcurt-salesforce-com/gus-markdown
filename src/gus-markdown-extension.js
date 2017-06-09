import textTransform from './texttransform.js';

window.run = true;
var originalHTML;

window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var responseObj = {received: true};
    if (request.changeRun) {
        window.run = !window.run;
        initialize();
    }
    responseObj.runState = window.run;
    sendResponse(responseObj);
});

function viewingPage (descriptionBoxID) {
    var descriptionBoxEl = document.getElementById(descriptionBoxID);
    var descriptionBoxHTML = '';
    if (descriptionBoxEl) {
        descriptionBoxHTML = originalHTML = descriptionBoxEl.innerHTML;
    }
    if (descriptionBoxHTML.length > 0) {
        descriptionBoxEl.innerHTML = textTransform(descriptionBoxHTML);
    }
}

function previewEditor (event) {
    var text = event.target.value || event.target.innerText;
    event.target.prev.innerHTML = textTransform(text);
}

/**
 * Sets the markedown preview based on user entered text on editing pages.
 * @param  {object} element            This is an already selected element on the page to be the markdown source
 * @param  {object} destinationElement This is an already selected element on the page for the html to be injected
 */

function editingPage (elem, destinationElement) {
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
        titleDiv.className = 'gusFormFieldLeft';
        titleDiv.style =
        'padding: 0px;' +
        'text-align: left;' +
        'margin: 8px 0px;';
    }
    if (mdp) {
        markdownPreview = mdp;
        markdownPreview.style.display = 'block';
    } else {
        markdownPreview = document.createElement('div');
        markdownPreview.id = 'markdown-preview';
        markdownPreview.className = 'inlineEditWrite';
        markdownPreview.style =
        'background: #FFF;' +
        'border: 1px solid #CCC;' +
        'border-radius: 4px;' +
        'padding: 0px 6px;' +
        'margin-top: 5px;' +
        'height: 160px;' +
        'overflow: auto;' +
        'line-height: 20px;';
    }
    if (mdpt) {
        markdownPreviewTitle = mdpt;
        markdownPreviewTitle.style.display = 'block';
    } else {
        markdownPreviewTitle = document.createElement('label');
        markdownPreviewTitle.id = 'markdown-preview-title';
        markdownPreviewTitle.innerHTML = 'Markdown Preview';
        titleDiv.appendChild(markdownPreviewTitle);
        destinationElement.appendChild(titleDiv);
        destinationElement.appendChild(markdownPreview);
        elem.prev = markdownPreview;
        elem.addEventListener('keydown', previewEditor);
        elem.style.height = '160px';
    }

    var initialKeydown = new CustomEvent('keydown');
    elem.dispatchEvent(initialKeydown);

}

function viewingReset (descriptionBoxID) {
    document.getElementById(descriptionBoxID).innerHTML = originalHTML;
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


var lightningLocation = 'gus.lightning.force';
var bugEditClassicLocation = '/apex/adm_bugedit';
var bugEditPreviewLocation = '/apex/ADM_WorkManager';
var userStoryEditClassicLocation = '/apex/adm_userstoryedit';
var userStoryDetailClassicLocation = '/apex/adm_userstorydetail';
var bugDetailClassicLocation = '/apex/adm_bugdetail';
var bugEditLightningID = 'bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body'; // eslint-disable-line no-unused-vars
var userStoryEditLightningID = 'userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer'; // eslint-disable-line no-unused-vars
var bugEditClassicID = 'bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body';
var bugEditClassicDestID = 'richDetailsWrapper';
var userStoryEditClassicID = 'userStoryWorkPage:storyWorkForm:detailsInput:formRow:input';
var userStoryDetailClassicID = 'userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner';
var bugDetailClassicID = 'bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div';

function waitForElem (el) {
    if (typeof el == 'undefined') {
        el = document.querySelectorAll('iframe')[1];
        setTimeout(waitForElem(el), 250);
    } else {
        el = el.contentWindow.document.getElementById(bugEditClassicID);
        var destEl = document.getElementById(bugEditClassicDestID);
        if (window.run) {
            editingPage(el, destEl);
        } else {
            editingReset(el);
        }
    }
}

function initialize () {
    // Depending on if it's a Bug or Story, there are different horrendous ID's used on the page
    // So we detect the URL and pass in the correct value to the correct function.
    var element;
    var destinationElement;
    //var iframe;
    //var iframeNum;
    /*
    if (location.href.indexOf(lightningLocation) > -1 && location.href.indexOf('view') == -1) {
        iframeNum = 0;
        iframe = document.querySelectorAll('iframe')[iframeNum];
        iframe = waitForIframe(iframe, iframeNum);
        if (iframe.contentWindow.document.getElementById(bugEditLightningID)) {
            console.log('bugedit lightning'); // eslint-disable-line no-console
            element = iframe.contentWindow.document.getElementById(bugEditLightningID);
            destinationElement = element.parentElement;
            if (window.run) {
                editingPage(element, destinationElement);
            } else {
                editingReset(element);
            }
        } else {
            console.log('userstoryedit lightning'); // eslint-disable-line no-console
            element = iframe.contentWindow.document.getElementById(userStoryEditLightningID);
            destinationElement = iframe.contentWindow.document.parentElement;
            if (window.run) {
                editingPage(element, destinationElement);
            } else {
                editingReset(element);
            }
        }

    } */
    if (location.href.indexOf(bugEditClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
        console.log('bugedit classic'); // eslint-disable-line no-console
        element = document.querySelectorAll('iframe')[1];
        waitForElem(element);

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
        if (window.run) {
            editingPage(element, destinationElement);
        } else {
            editingReset(element);
        }

    /*} else if (location.href.indexOf('/apex/adm_userstorydetail') > -1 && location.href.indexOf(lightningLocation) > -1) {
        console.log('userstorydetail lightning'); // eslint-disable-line no-console
        if (window.run) {
            viewingPage('userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner');
        } else {
            viewingReset('userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner');
        } */

    } else if (location.href.indexOf(userStoryDetailClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
        console.log('userstorydetail classic'); // eslint-disable-line no-console
        if (window.run) {
            viewingPage(userStoryDetailClassicID);
        } else {
            viewingReset(userStoryDetailClassicID);
        }

    /*} else if (location.href.indexOf('/apex/adm_bugdetail') > -1 && location.href.indexOf(lightningLocation) > -1) {
        console.log('bugdetail lightning'); // eslint-disable-line no-console
        if (window.run) {
            viewingPage('bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div');
        } else {
            viewingReset('bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div');
        } */

    } else if (location.href.indexOf(bugDetailClassicLocation) > -1 && location.href.indexOf(lightningLocation) == -1) {
        console.log('bugdetail classic'); // eslint-disable-line no-console
        if (window.run) {
            viewingPage(bugDetailClassicID);
        } else {
            viewingReset(bugDetailClassicID);
        }

    } else {
        window.run = false;
        console.log('not found'); // eslint-disable-line no-console
    }

}

initialize();
