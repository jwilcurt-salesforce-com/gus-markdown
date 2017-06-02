function textTransform (text) {
    console.log('hello');
    text = text.split('\n<br>').join('\n');
    text = text.split('<br>').join('\n');
    text = text.replace(/\n\s?\d\)\s/g, '\n1. ');

    // The regex matches line breaks preceded by a word boundary and
    // a variable number of spaces. It replaces the line break and the
    // spaces with two spaces followed by the line break
    text = text.replace(/((\b[ ]*)\n(?=\S|\s))/g, '  \n');

    // This regex matches line breaks preceded by a word boundary, one
    // or more punctuation characters, and a variable number of spaces.
    // Since we have to keep the punctuation, it uses a function
    // to return the matched punctuation followed by the line break
    // (this may produce more than 2 spaces)
    text = text.replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g, function ($0, $1) {
        return $1 ? $1 + '  \n' : $0;
    });

    // Replace sql select * from statements with the same thing in a markdown code block
    text = text.replace(/\nselect \* from([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');

    // Replace http request/response data with the same thing in a markdown code block
    text = text.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g, '```$&\n```  \n---');

    // Escape marked default handling of underscores, making it so
    // underscores don't compile to italics
    text = text.replace(/\\_/g, '\\\\_');
    text = text.replace(/_/g, '\\_');

    // Escape marked default handling of asterisks, making it so
    // asterisks don't compile to italics
    // text = text.replace(/\\\*/g, '\\\\\*');
    // text = text.replace(/\*/g, '\\\*');
    return marked(text);
}
