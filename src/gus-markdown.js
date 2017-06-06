/* eslint-disable no-console */

// ==UserScript==
// @name         GUS Markdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gus.my.salesforce.com/apex/*
// @grant        none
// ==/UserScript==

import marked from 'marked';

(function () {
    console.log('tried to run');

    function viewingPage (descriptionBox) {
        var descriptionBoxEl = document.getElementById(descriptionBox);
        var descriptionBoxHTML = '';
        if (descriptionBoxEl) {
            descriptionBoxHTML = descriptionBoxEl.innerHTML;
        }
        if (descriptionBoxHTML.length > 0) {
            var md = descriptionBoxHTML.split('\n<br>').join('\n');
            md = md.split('<br>').join('\n');
            md = md.replace(/\n\s?\d\)\s/g, '\n1. ');
            //The regex matches line breaks preceded by a word boundary and
            //a variable number of spaces. It replaces the line break and the
            //spaces with two spaces followed by the line break
            md = md.replace(/((\b[ ]*)\n(?=\S|\s))/g, '  \n');
            //This regex matches line breaks preceded by a word boundary, one
            //or more punctuation characters, and a variable number of spaces.
            //Since we have to keep the punctuation, it uses a function
            //to return the matched punctuation followed by the line break
            //(this may produce more than 2 spaces)
            md = md.replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g, function ($0, $1) {
                if($1) {
                    return $1 + '  \n';
                }
                else {
                    return $0;
                }
            });
            //Replace sql select * from statements with the same thing in a markdown code block
            md = md.replace(/\nselect \* from([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');
            //Replace http request/response data with the same thing in a markdown code block
            md = md.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');
            //Escape marked default handling of underscores, making it so
            //underscores don't compile to italics
            md = md.replace(/\\_/g, '\\\\_');
            md = md.replace(/_/g, '\\_');
            //Escape marked default handling of asterisks, making it so
            //asterisks don't compile to italics
            //md = md.replace(/\\\*/g, '\\\\\*');
            //md = md.replace(/\*/g, '\\\*');
            var mdHTML = marked(md);
            descriptionBoxEl.innerHTML = mdHTML;
        }
    }

    /**
     * Sets the markedown preview based on user entered text on editing pages.
     * @param  {object} element            This is an already selected element on the page to be the markdown source
     * @param  {object} destinationElement This is an already selected element on the page for the html to be injected
     */

    function editingPage (element, destinationElement) {
        console.log(element);
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
        console.log(destinationElement);
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
            text = text.split('\n<br>').join('\n');
            text = text.split('<br>').join('\n');
            text = text.replace(/\n\s?\d\)\s/g, '\n1. ');
            text = text.replace(/((\b[ ]*)\n(?=\S|\s))/g, '  \n');
            text = text.replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g, function ($0, $1) {
                if($1) {
                    return $1 + '  \n';
                }
                else {
                    return $0;
                }
            });
            text = text.replace(/\nselect \* from([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');
            text = text.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');
            text = text.replace(/\\_/g, '\\\\_');
            text = text.replace(/_/g, '\\_');
            text = marked(text);
            markdownPreview.innerHTML = text;
        }

        element.addEventListener('keydown', previewEditor);
        previewEditor();

    }
    /*
        clears the markdown box by forcing the script to rerun by giving it a keyboard event,
        which causes the script to deselect the current element.
    */
    function clearMarkDownPreview () {
        element.focus();
        element.select();
        var keyboardEvent = document.createEvent('KeyboardEvent');
        var initMethod;
        if(typeof keyboardEvent.initKeyboardEvent !== 'undefined') {
            initMethod = 'initKeyboardEvent';
        }
        else {
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

    function waitForElem (elem) {
        if(typeof elem == 'undefined') {
            elem = document.querySelectorAll('iframe')[1];
            setTimeout(waitForElem(elem), 250);
        }
        else {
            elem = elem.contentWindow.document.getElementById('bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body');
            var de = document.getElementById('richDetailsWrapper');
            editingPage(elem, de);
        }
    }

    // Depending on if it's a Bug or Story, there are different horrendous ID's used on the page
    // So we detect the URL and pass in the correct value to the correct function.
    if (!window.ran && location.href.indexOf('/apex/adm_bugedit') > -1 && location.href.indexOf('gus.lightning.force') > -1) {
        console.log('bugedit lightning');
        var el = document.getElementById('bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body');
        var destElem = el.parentElement;
        editingPage(el, destElem);

    } else if (!window.ran && location.href.indexOf('/apex/adm_bugedit') > -1 && location.href.indexOf('gus.lightning.force') == -1) {
        console.log('bugedit classic');
        var ele = document.querySelectorAll('iframe')[1];
        waitForElem(ele);

    } else if(!window.ran && location.href.indexOf('/apex/ADM_WorkManager') > -1 && location.href.indexOf('gus.lightning.force') == -1){
        console.log('bugedit classic');
        var input = document.getElementById('descriptionInput');
        if(input != null){
            var destination = input.parentElement;
            editingPage(input, destination);
            var saveButton = document.getElementById('workSaveButton');
            var cancelButton = document.getElementById('workCancelButton');
            if(cancelButton.addEventListener){
                cancelButton.addEventListener('click', clearMarkDownPreview, false);
            }
            if(saveButton.addEventListener){
                saveButton.addEventListener('click', clearMarkDownPreview, false);
            }



        }

    } else if (!window.ran && location.href.indexOf('/apex/adm_userstoryedit') > -1 && location.href.indexOf('gus.lightning.force') > -1) {
        console.log('userstoryedit lightning');
        var e = document.getElementById('userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer');
        var destinationElement = e.parentElement;
        editingPage(e, destinationElement);

    } else if (!window.ran && location.href.indexOf('/apex/adm_userstoryedit') > -1 && location.href.indexOf('gus.lightning.force') == -1) {
        console.log('userstoryedit classic');
        var element = document.getElementById('userStoryWorkPage:storyWorkForm:detailsInput:formRow:input');
        var destElement = element.parentElement;
        editingPage(element, destElement);

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

})();
