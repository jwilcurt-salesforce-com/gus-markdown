import marked from 'marked';
import he from 'he';

/**
 * Uses regular expressions to match an outer html element with its corresponding
 * closing element and everything in between. An outer html element is an html element
 * that is located at the beginning of a line (^) when using multiline regex mode. We
 * need to match these elements because the GUS rich text editor sometimes returns html
 * uls or ols, we just want to leave these as is and not run all of the regular transformations
 * on them. Also, there are optional arguments replaceRegex and replacer which are equivalent to
 * the arguments used in String.prototype.replace. A String.prototype.replace will be run on
 * each match using these arguments.
 * @param  {string} str                             the string we are looking for outer html elements in
 * @param  {string} elem                            the html element we want to find, for example 'body'
 * @param  {string or RegExp object} replaceRegex   the regex to replace within a match
 * @param  {string or function} replacer            the replacement string or function
 * @return {array of objects}                       an array of matches containing the matched text, the beginning index
 *                                                  at which the match occurs in the string, and the index the match ended
 *                                                  at (one past the last character in the match). also contains in the last index the updated string
 */
function matchBetweenOuterHTMLElements (str, elem, replaceRegex, replacer) {
    // this is the regex to find the start tag of outer html element we are looking for
    var beginRegex = new RegExp('^<' + elem + '>', 'gm');
    // this stores the matches we find
    var matchesArr = [];
    // Loop through each outer html element start tag
    var res = beginRegex.exec(str);
    while (res !== null) {
        // Use this to find instances where there are nested elements inside the outer html
        // tag that we are looking for that have the same tag
        var innerRegex = new RegExp('<' + elem + '>', 'gm');
        // Use this to find the ending tags for the outer html element we are looking for
        var endRegex = new RegExp('<\/' + elem + '>', 'gm');
        // Location of the beginning of the outer html tag
        var firstIndex = beginRegex.lastIndex - (elem.length + 2);
        // Update the inner regex and end regex lastindex properties so we can begin searching
        // from where we left off
        innerRegex.lastIndex = beginRegex.lastIndex;
        endRegex.lastIndex = beginRegex.lastIndex;
        var beforeCount = 1;
        do {
            var innerRes = [];
            var endRes = endRegex.exec(str);
            if (endRes === null) {
                break;
            }
            while (innerRes !== null && innerRegex.lastIndex <= endRegex.lastIndex) {
                innerRes = innerRegex.exec(str);
                if (innerRes !== null && innerRegex.lastIndex <= endRegex.lastIndex) {
                    beforeCount++;
                }
            }
            innerRegex.lastIndex = endRegex.lastIndex;
            beforeCount--;
        } while (beforeCount > 0);

        if (endRes !== null) {
            var lastIndex = endRegex.lastIndex;
            var match = str.substring(firstIndex, lastIndex);
            if (typeof(replaceRegex) != undefined && typeof(replaceString) != undefined) {
                match = match.replace(replaceRegex, replacer);
                var beginString = str.slice(0, firstIndex);
                var endString = str.slice(lastIndex);
                str = beginString + match + endString;
                matchesArr.push({match: match, firstIndex: firstIndex, lastIndex: firstIndex + match.length, type: 'html'});
            } else {
                matchesArr.push({match: match, firstIndex: firstIndex, lastIndex: lastIndex, type: 'html'});
            }
            beginRegex.lastIndex = firstIndex + match.length;
        } else {
            // If invalid HTML, just return anything we have already found but ignore the invalid HTML
            matchesArr.push({newString: str});
            return matchesArr;
        }
        res = beginRegex.exec(str);
    }
    matchesArr.push({newString: str});
    return matchesArr;
}

// Helper function for HTML outer element replacements
function outerHTMLWhitespaceReplacer (match, p1, p2) {
    if (p1) {
        return '\n' + p1;
    } else {
        return '\n';
    }
}

/**
 * Decides whether to add a code block to the list of current code blocks
 * or not, also may remove old code blocks if they are inside the current
 * code block
 * @param  {list} codeBlocks    the list of code blocks
 * @param  {string} match       the current code block as a string
 * @param  {number} offset      the index in the original string where the beginning of match occurred
 * @return {list}               returns an updated list of code blocks
 */
function updateCodeBlocks (codeBlocks, match, offset) {
    codeBlocks = codeBlocks.filter((block) => {
        return block.firstIndex < offset || block.lastIndex > (offset + match.length);
    });
    var addToCodeBlocks = true;
    for (var i = 0; i < codeBlocks.length; i++) {
        var codeBlock = codeBlocks[i];
        if ((offset >= codeBlock.firstIndex && offset <= codeBlock.lastIndex) || offset >= codeBlock.firstIndex && ((offset + match.length) <= codeBlock.lastIndex)) {
            addToCodeBlocks = false;
            break;
        }
    }
    if (addToCodeBlocks === true) {
        codeBlocks.push({match: match, firstIndex: offset, lastIndex: offset + match.length, type: 'code'});
    }
    return codeBlocks;
}

/**
 * Receive HTML input and transform it so that it won't look horrible when it is passed through a markdown interpreter
 * @param  {string}     text the html text to transform
 * @return {string}     the transformed text
 */
function textTransform (text) {
    // Gets rid of data-aura-rendered-by attribute on lightning tags
    text = text.replace(/(<\w+) data-aura-rendered-by=".*?"/g, '$1');

    // Replace <br> tags with newline tags
    text = text.split('\n<br>').join('\n');
    text = text.split('<br>').join('\n');

    // Super weird case where a textual list followed by an html list generated by GUS
    // doesn't contain line breaks which screws up the markdown rendering
    text = text.replace(/(\d\. [^\n<]+)\n?(<ul>|<ol>)/g, '$1\n\n$2');

    // Remove unnecessary (imo) nonbreaking spaces at the end of lines
    text = text.split(/&nbsp;$/gm).join('');
    // Replace sql select * from statements with the same thing in a markdown code block
    text = text.replace(/\nselect \* from([^\n]|\n(?!\n))*/g, '```$&\n```  \n');

    // Replace http request/response data with the same thing in a markdown code block
    text = text.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g, '```$&\n```  \n');

    // If two code blocks are on top of each other, give them a little space for formatting purposes
    text = text.replace(/(```)(\s*)(```)/g, '$1\n<br>\n$3');

    var codeBlocks = [];
    // Get all of the ul codeblocks in the text, at the same time add a newline at the beginning of each one
    // and consolidate any two or more newlines in a row within the codeblock to be just one newline
    codeBlocks = matchBetweenOuterHTMLElements(text, 'ul', /^(.|\n)|(\n{2,})/g, outerHTMLWhitespaceReplacer);
    // Update our text with the replaced text
    text = codeBlocks[codeBlocks.length - 1].newString;
    // Remove the replaced text from the codeBlocks array
    codeBlocks.pop();
    // Do the same thing as above but with ol instead of ul, add them to the codeBlocks list
    codeBlocks = [...codeBlocks, ...matchBetweenOuterHTMLElements(text, 'ol', /^(.|\n)|(\n\n)/g, outerHTMLWhitespaceReplacer)];
    text = codeBlocks[codeBlocks.length - 1].newString;
    codeBlocks.pop();

    // Find all of the '```' code blocks and add them to the codeBlocks list
    text.replace(/(?:```(?:.|\n)*?```)/gm, function (match, offset, string) {
        codeBlocks = updateCodeBlocks(codeBlocks, match, offset);
        return match;
    });

    // Find all of the inline code blocks and add them to the codeBlocks list
    text.replace(/(?:`(?:[^`])+?`(?!`))/gm, function (match, offset, string) {
        codeBlocks = updateCodeBlocks(codeBlocks, match, offset);
        return match;
    });

    // Find all of the '4 spaces before' code blocks and add them to the codeBlocks list
    text.replace(/(?:^(?: {4}|\t)(?:(?:.|\n)(?!(?:^ {0,3}\S)))*)/gm, function (match, offset, string) {
        codeBlocks = updateCodeBlocks(codeBlocks, match, offset);
        return match;
    });
    // Sort the codeBlocks by firstIndex ascending
    codeBlocks.sort((a, b) => {
        if (a.firstIndex < b.firstIndex) {
            return -1;
        } else {
            return 1;
        }
    });

    // Do all these parses on the rest of the code blocks
    var otherTextArray = [];
    var startOtherIndex = 0;
    for (var y = 0; y < codeBlocks.length; y++) {
        otherTextArray.push(text.substring(startOtherIndex, codeBlocks[y].firstIndex));
        startOtherIndex = codeBlocks[y].lastIndex;
    }
    otherTextArray.push(text.slice(startOtherIndex));
    for (var i = 0; i < otherTextArray.length; i++) {

        let nonCodeText = otherTextArray[i];

        // Replace lists like 1) with markdown equivalent 1.
        nonCodeText = nonCodeText.replace(/^\s*\d\)\s+/gm, '1. ');

        // The regex matches line breaks preceded by a word boundary and
        // a variable number of spaces. It replaces the line break and the
        // spaces with two spaces followed by the line break
        nonCodeText = nonCodeText.replace(/((\b *)\n(?=\S|\s))/g, '  \n');

        // This regex matches line breaks preceded by a punctuation character
        // and a variable number of spaces. It puts two spaces and a line break
        // after the punctuation, which renders into a new paragraph in
        // markdown for better readability.
        nonCodeText = nonCodeText.replace(/([^a-zA-Z0-9\n ])( )*\n/g, '$1  \n');

        // Make text followed by a colon before a period and then whitespace at the beginning of a line bold
        // For example -
        // 12: text text text, the "12:" would be bold
        nonCodeText = nonCodeText.replace(/^([^\.|\n|:|>|<]+)(:)/gm, '****$1$2****');
        nonCodeText = nonCodeText.replace(/>([^\.|\n|:|>|<]+)(:)/g, '>****$1$2****');
        nonCodeText = nonCodeText.replace(/\*\*\*\*(http|https):\*\*\*\*/g, '$1:');

        // Escape marked default handling of underscores, making it so
        // one or two underscores don't receive emphasis/strong, however
        // three or four underscores in a row will achieve the same effect.
        // More than that gives undefined behavior. Also, marked screws
        // up when trying to put an underscore inside italics I noticed
        nonCodeText = nonCodeText.replace(/(\\)(_)(?!(?:_)+)/g, '\\$1\\$2');
        nonCodeText = nonCodeText.replace(/([^_])(_)(?!(?:_)+)/g, '$1\\$2');
        nonCodeText = nonCodeText.replace(/^(_)(?!(?:_)+)/gm, '\\$1');
        nonCodeText = nonCodeText.replace(/(\\)(_)(_)(?!(?:_)+)/g, '\\$1\\$2\\$3');
        nonCodeText = nonCodeText.replace(/([^_])(_)(_)(?!(?:_)+)/g, '$1\\$2\\$3');
        nonCodeText = nonCodeText.replace(/^(_)(_)(?!(?:_)+)/gm, '\\$1\\$2');
        nonCodeText = nonCodeText.replace(/(\\)(_)(_)(_)(_)(?!(?:_)+)/g, '\\$1__');
        nonCodeText = nonCodeText.replace(/([^_])(_)(_)(_)(_)(?!(?:_)+)/g, '$1__');
        nonCodeText = nonCodeText.replace(/^(_)(_)(_)(_)(?!(?:_)+)/gm, '__');
        nonCodeText = nonCodeText.replace(/(\\)(_)(_)(_)(?!(?:_)+)/g, '\\$1_');
        nonCodeText = nonCodeText.replace(/([^_])(_)(_)(_)(?!(?:_)+)/g, '$1_');
        nonCodeText = nonCodeText.replace(/^(_)(_)(_)(?!(?:_)+)/gm, '_');

        // Escape marked default handling of asterisks, making it so
        // one or two asterisks don't receive emphasis/strong, however
        // three or four asterisks in a row will achieve the same effect.
        // More than that gives undefined behavior. Use --- or - - - for
        // horizontal rule
        nonCodeText = nonCodeText.replace(/(\\)(\*)(?!(?:\*)+)/g, '\\$1\\$2');
        nonCodeText = nonCodeText.replace(/([^\*])(\*)(?!(?:\*)+)/g, '$1\\$2');
        nonCodeText = nonCodeText.replace(/^(\*)(?!(?:\*)+)/gm, '\\$1');
        nonCodeText = nonCodeText.replace(/(\\)(\*)(\*)(?!(?:\*)+)/g, '\\$1\\$2\\$3');
        nonCodeText = nonCodeText.replace(/([^\*])(\*)(\*)(?!(?:\*)+)/g, '$1\\$2\\$3');
        nonCodeText = nonCodeText.replace(/^(\*)(\*)(?!(?:\*)+)/gm, '\\$1\\$2');
        nonCodeText = nonCodeText.replace(/(\\)(\*)(\*)(\*)(\*)(?!(?:\*)+)/g, '\\$1**');
        nonCodeText = nonCodeText.replace(/([^\*])(\*)(\*)(\*)(\*)(?!(?:\*)+)/g, '$1**');
        nonCodeText = nonCodeText.replace(/^(\*)(\*)(\*)(\*)(?!(?:\*)+)/gm, '**');
        nonCodeText = nonCodeText.replace(/(\\)(\*)(\*)(\*)(?!(?:\*)+)/g, '\\$1*');
        nonCodeText = nonCodeText.replace(/([^\*])(\*)(\*)(\*)(?!(?:\*)+)/g, '$1*');
        nonCodeText = nonCodeText.replace(/^(\*)(\*)(\*)(?!(?:\*)+)/gm, '*');
        otherTextArray[i] = nonCodeText;
    }

    // Decode HTML entities inside code blocks, so Marked won't parse through them and
    // make encodings we don't want (ex. encoding &lt; to &amp;lt;)
    // For the HTML entities generated by GUS that aren't inside of code blocks, I
    // believe marked will just leave them as is
    for (var ind = 0; ind < codeBlocks.length; ind++) {
        if (codeBlocks[ind].type === 'code') {
            codeBlocks[ind].match = he.decode(codeBlocks[ind].match);
        }
    }

    var newText = '';
    // Recombine the freshly changed noncodetext with the code block text
    for (var x = 0 ; x < codeBlocks.length; x++) {
        newText += otherTextArray[x] + codeBlocks[x].match;
    }
    newText += otherTextArray[otherTextArray.length - 1];
    return newText;
}

// Run the transformed text through the marked markdown interpreter
function transformWithMarked (text) {
    text = textTransform(text);
    // Get all of the ul codeblocks in the text
    var outerHTML = matchBetweenOuterHTMLElements(text, 'ul');
    // Update our text with the replaced text
    text = outerHTML[outerHTML.length - 1].newString;
    // Remove the replaced text from the codeBlocks array
    outerHTML.pop();
    // Do the same thing as above but with ol instead of ul, add them to the codeBlocks list
    outerHTML = [...outerHTML, ...matchBetweenOuterHTMLElements(text, 'ol')];
    text = outerHTML[outerHTML.length - 1].newString;
    outerHTML.pop();
    var nonOuterHTML = [];
    var startOuterIndex = 0;
    for (var i = 0; i < outerHTML.length; i++) {
        nonOuterHTML.push(text.substring(startOuterIndex, outerHTML[i].firstIndex));
        startOuterIndex = outerHTML[i].lastIndex;
    }
    nonOuterHTML.push(text.slice(startOuterIndex));
    for (var x = 0; x < nonOuterHTML.length; x++) {
        nonOuterHTML[x] = marked(nonOuterHTML[x]);
    }
    var newText = '';
    for (var y = 0; y < outerHTML.length; y++) {
        newText += nonOuterHTML[y] + outerHTML[y].match;
    }
    newText += nonOuterHTML[nonOuterHTML.length - 1];
    return newText;
}

export { textTransform, transformWithMarked };
