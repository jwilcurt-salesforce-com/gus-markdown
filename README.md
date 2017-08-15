# gus-markdown

Markdown for GUS (Salesforce ticketing system)

This is a **Chrome Extension** and/or **TamperMonkey userscript**. It works on Classic and Lightning interfaces.

This extension will take common ways of conveying meaning in your text and apply formatting to them. It supports all common markdown formatting and will also look for other common ways of conveying formatting and convert it to markdown then HTML.

* * *

## Install Instructions

**In Chrome:**

Download/install this extension. Click on the extension to enable/disable it on the current page.

* https://chrome.google.com/webstore/search/gus%20markdown

**In other browsers:**

Download TamperMonkey or a similar extension

* http://tampermonkey.net

Then use use the `rolledAnyBrowser.js` script:

* https://raw.githubusercontent.com/jwilcurt-salesforce-com/gus-markdown/master/dist/rolledAnyBrowserScript.js

Copy/paste that script into your TamperMonkey instance.

* * *

## Why Markdown in Gus?

Markdown is used on websites that cater to programmers:

* GitHub
* GitLab
* BitBucket
* StackOverflow
* HackerNews
* CodePen
* Medium
* Reddit
* etc.

GUS markets itself as a tool for programmers, however without markdown support, it is hard to take it serious. It's become an expectation that tools for developers should support markdown natively. Until that time, this extension/script fills in the gap.

* * *

# Markdown examples:

* * *

```
* Example
* of
  * a
    * bulleted
* list
```

* Example
* of
  * a
    * bulleted
* list

* * *

```
1. Example
   1. of a
      1. ordered
1. list
```

1. Example
   1. of a
      1. ordered
1. list

* * *

```
If you surround text with one asterisk it will *become italic*.
```
If you surround text with one asterisk it will *become italic*.

* * *

```
If you surround text with two asterisks it will **become bold**.
```
If you surround text with two asterisks it will **become bold**.

* * *

```
If you surround text with three asterisks it will ***become bold italic***.
```
If you surround text with three asterisks it will ***become bold italic***.

* * *

```
If you surround text with one grave it will `become inline code`.
```

If you surround text with one grave it will `become inline code`.

* * *

To create multiline codeblocks use 3 graves, a file extension (optional), a return, your code, a return, and 3 graves.

    ```js
    if (usingMultilineCodeBlock) {
        var explaination = 'Multiline codeblocks use ' +
            '3 graves, ' +
            'a file extension (optional), ' +
            'a return, ' +
            'your code, ' +
            'a return, ' +
            'and 3 graves.';
        console.log(explanation);
    }
    ```

```js
if (usingMultilineCodeBlock) {
    var explaination = 'Multiline codeblocks use ' +
        '3 graves, ' +
        'a file extension (optional), ' +
        'a return, ' +
        'your code, ' +
        'a return, ' +
        'and 3 graves.';
    console.log(explanation);
}
```

* * *

Horrizontal rules can be created with asterisks or hyphens:

```
* * *
---
```

* * *
---

You can also add a link in your text, like so:

```
To learn more about Markdown syntax, [click here](https://daringfireball.net/projects/markdown/syntax).
```

To learn more about Markdown syntax, [click here](https://daringfireball.net/projects/markdown/syntax).

Until markdown is officially supported by GUS, it is probably better to structure your links like this however, so that it will still look nice for those who do not have the gus-markdown extension:

```
To learn more about Markdown syntax:

* https://daringfireball.net/projects/markdown/syntax
```

To learn more about Markdown syntax:

* https://daringfireball.net/projects/markdown/syntax
