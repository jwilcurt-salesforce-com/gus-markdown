import marked from 'marked';

function textTransform (text) {
    var codeBlocks = [];
    // Replace sql select * from statements with the same thing in a markdown code block
    text = text.replace(/\nselect \* from([^\n]|\n(?!\n))*/g, '```$&\n```  \n');

    // Replace http request/response data with the same thing in a markdown code block
    text = text.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g, '```$&\n```  \n');
    text.replace(/(?:```(?:.|\n)*```)|(?:^(?: {4}|\t)(?:(?:.|\n)(?!(?:^ {0,3}\S)))*)/gm, function (match) {
        codeBlocks.push(match);
        return match;
    });
    var nonCodeTextArray = text.split(/(?:```(?:.|\n)*```)|(?:^(?: {4}|\t)(?:(?:.|\n)(?!(?:^ {0,3}\S)))*)/gm);
    for(var i = 0; i < nonCodeTextArray.length; i++) {
        let nonCodeText = nonCodeTextArray[i];


        nonCodeText = nonCodeText.split('\n<br>').join('\n');
        nonCodeText = nonCodeText.split('<br>').join('\n');
        nonCodeText = nonCodeText.replace(/\n\s?\d\)\s/g, '\n1. ');

        // The regex matches line breaks preceded by a word boundary and
        // a variable number of spaces. It replaces the line break and the
        // spaces with two spaces followed by the line break
        nonCodeText = nonCodeText.replace(/((\b[ ]*)\n(?=\S|\s))/g, '  \n');

        // This regex matches line breaks preceded by a word boundary, one
        // or more punctuation characters, and a variable number of spaces.
        // Since we have to keep the punctuation, it uses a function
        // to return the matched punctuation followed by the line break
        // (this may produce more than 2 spaces)
        nonCodeText = nonCodeText.replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g, function ($0, $1) {
            if ($1 !== undefined) {
                return $1 + '  \n';
            } else {
                return $0;
            }
        });

        // Replace sql select * from statements with the same thing in a markdown code block
        nonCodeText = nonCodeText.replace(/\nselect \* from([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');

        // Replace http request/response data with the same thing in a markdown code block
        nonCodeText = nonCodeText.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');

        // Make text followed by a colon before a period and then whitespace at the beginning of a line bold
        // For example -
        // 12: text text text, the "12:" would be bold
        nonCodeText = nonCodeText.replace(/^([^\.|\n]+)(?!\.)(:)(\s+)/gm, '****$1$2****$3');

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
        nonCodeTextArray[i] = nonCodeText;
    }
    var newText = '';
    for(var x = 0 ; x < codeBlocks.length; x++) {
        newText += nonCodeTextArray[x] + codeBlocks[x];
    }
    newText += nonCodeTextArray[nonCodeTextArray.length - 1];
    console.log(newText);
    return newText;
}

function transformWithMarked (text) {
    text = textTransform(text);
    return marked(text);
}

export { textTransform, transformWithMarked };
