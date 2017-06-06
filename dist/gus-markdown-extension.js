function viewingPage (descriptionBox) {
    var descriptionBoxEl = document.getElementById(descriptionBox);
    var descriptionBoxHTML = '';
    if (descriptionBoxEl) {
        descriptionBoxHTML = descriptionBoxEl.innerHTML;
    }
    if (descriptionBoxHTML.length > 0) {
        descriptionBoxEl.innerHTML = texttransform(descriptionBoxHTML);
    }
}

/**
 * Sets the markedown preview based on user entered text on editing pages.
 * @param  {object} element            This is an already selected element on the page to be the markdown source
 * @param  {object} destinationElement This is an already selected element on the page for the html to be injected
 */

function editingPage (element, destinationElement) {
    var titleDiv = document.createElement('div');
    titleDiv.id = 'title-div';
    titleDiv.className = 'gusFormFieldLeft';
    titleDiv.style =
    'padding: 0px;' +
    'text-align: left;' +
    'margin: 8px 0px;';
    var markdownPreviewTitle = document.createElement('label');
    markdownPreviewTitle.id = 'markdown-preview-title';
    markdownPreviewTitle.innerHTML = 'Markdown Preview';
    titleDiv.appendChild(markdownPreviewTitle);
    destinationElement.appendChild(titleDiv);
    var markdownPreview = document.createElement('div');
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
    destinationElement.appendChild(markdownPreview);

    element.style.height = '160px';


    function previewEditor () {

        var text = element.value || element.innerText;
        markdownPreview.innerHTML = texttransform(text);
    }

    element.addEventListener('keydown', previewEditor);
    previewEditor();

}
/*
    clears the markdown box by forcing the script to rerun by giving it a keyboard event,
    which causes the script to deselect the current element.
*/
function clearMarkDownPreview(){
    element.focus();
    element.select();
    var keyboardEvent = document.createEvent("KeyboardEvent");
    var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
    keyboardEvent[initMethod](
       "keydown", // event type : keydown, keyup, keypress
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


// Depending on if it's a Bug or Story, there are different horrendous ID's used on the page
// So we detect the URL and pass in the correct value to the correct function.
if (!window.ran && location.href.indexOf('/apex/adm_bugedit') > -1 && location.href.indexOf('gus.lightning.force') > -1) {
    console.log('bugedit lightning');
    var element = document.getElementById('bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body');
    var destinationElement = element.parentElement;
    editingPage(element, destinationElement);

} else if (!window.ran && location.href.indexOf('/apex/adm_bugedit') > -1 && location.href.indexOf('gus.lightning.force') == -1) {
    console.log('bugedit classic');
    var element = document.querySelectorAll('iframe')[1];
    function waitForElem() {
        if(typeof element == 'undefined') {
            element = document.querySelectorAll('iframe')[1];
            setTimeout(waitForElem, 250);
        }
        else {
            element = element.contentWindow.document.getElementById('bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body');
            var destinationElement = document.getElementById('richDetailsWrapper');
            editingPage(element, destinationElement);

        }
    }
    waitForElem();

} else if(!window.ran && location.href.indexOf('/apex/ADM_WorkManager') > -1 && location.href.indexOf('gus.lightning.force') == -1){
    console.log('bugedit classic');
    setTimeout(function(){}, 200);
    var element = document.getElementById('descriptionInput');
    if(element != null){
        destinationElement = element.parentElement;
        editingPage(element, destinationElement);
        var saveButton = document.getElementById('workSaveButton');
        var cancelButton = document.getElementById('workCancelButton');
        if(cancelButton.addEventListener){
            cancelButton.addEventListener("click", clearMarkDownPreview, false);
        }
        if(saveButton.addEventListener){
            saveButton.addEventListener("click", clearMarkDownPreview, false);
        }
    }

} else if (!window.ran && location.href.indexOf('/apex/adm_userstoryedit') > -1 && location.href.indexOf('gus.lightning.force') > -1) {
    console.log('userstoryedit lightning');
    var element = document.getElementById('userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer');
    var destinationElement = element.parentElement;
    editingPage(element, destinationElement);

} else if (!window.ran && location.href.indexOf('/apex/adm_userstoryedit') > -1 && location.href.indexOf('gus.lightning.force') == -1) {
    console.log('userstoryedit classic');
    var element = document.getElementById('userStoryWorkPage:storyWorkForm:detailsInput:formRow:input');
    var destinationElement = element.parentElement;
    editingPage(element, destinationElement);

} else if (!window.ran && location.href.indexOf('/apex/adm_userstorydetail') > -1 && location.href.indexOf('gus.lightning.force') > -1) {
    console.log('userstorydetail lightning');
    viewingPage('userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner');

} else if (!window.ran && location.href.indexOf('/apex/adm_userstorydetail') > -1 && location.href.indexOf('gus.lightning.force') == -1) {
    console.log('userstorydetail classic');
    viewingPage('userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner');

} else if (!window.ran && location.href.indexOf('/apex/adm_bugdetail') > -1 && location.href.indexOf('gus.lightning.force') > -1) {
    console.log('bugdetail lightning');
    viewingPage('bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div');
} else if (!window.ran && location.href.indexOf('/apex/adm_bugdetail') > -1 && location.href.indexOf('gus.lightning.force') == -1) {
    console.log('bugdetail classic');
    viewingPage('bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div');
} else {
    console.log('not found'); // eslint-disable-line no-console
}

window.ran = true;