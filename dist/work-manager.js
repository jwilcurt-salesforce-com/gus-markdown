(function () {
'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var marked = createCommonjsModule(function (module, exports) {
/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if ('object' !== 'undefined' && 'object' === 'object') {
  module.exports = marked;
} else {}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : commonjsGlobal);
}());
});

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
        var endRes = endRegex.exec(str);
        if (endRes !== null) {
            var beginCount = 0;
            var innerRes = innerRegex.exec(str);
            // Look for any more duplicate html start tags that come before the closing html tag
            // so we know how many closing tags to skip before we've arrived at the matching tag
            // for the outer html element
            while (innerRes !== null && innerRegex.lastIndex <= endRegex.lastIndex) {
                innerRes = innerRegex.exec(str);
                beginCount++;
            }
            while (beginCount > 0) {
                endRes = endRegex.exec(str);
                beginCount--;
            }
            if (endRes !== null) {
                var lastIndex = endRegex.lastIndex;
                var match = str.substring(firstIndex, lastIndex);
                if (typeof(replaceRegex) != undefined && typeof(replaceString) != undefined) {
                    match = match.replace(replaceRegex, replacer);
                    var beginString = str.slice(0, firstIndex);
                    var endString = str.slice(lastIndex);
                    str = beginString + match + endString;
                    matchesArr.push({match: match, firstIndex: firstIndex, lastIndex: firstIndex + match.length});
                } else {
                    matchesArr.push({match: match, firstIndex: firstIndex, lastIndex: lastIndex});
                }
                beginRegex.lastIndex = firstIndex + match.length;
            } else {
                // If invalid HTML, just return anything we have already found but ignore the invalid HTML
                matchesArr.push({newString: str});
                return matchesArr;
            }
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
 * Receive HTML input and transform it so that it won't look horrible when it is passed through a markdown interpreter
 * @param  {string}     text the html text to transform
 * @return {string}     the transformed text
 */
function textTransform (text) {
    console.log(text);
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

    // Get all of the ul codeblocks in the text, at the same time add a newline at the beginning of each one
    // and consolidate any two or more newlines in a row within the codeblock to be just one newline
    var codeBlocks = matchBetweenOuterHTMLElements(text, 'ul', /^(.|\n)|(\n{2,})/g, outerHTMLWhitespaceReplacer);
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
        // If an outer html element is inside of a code block, we dont want to have it listed twice in the code blocks
        // array that we are ignoring
        codeBlocks = codeBlocks.filter((element) => {
            return element.firstIndex < offset || element.lastIndex > (offset + match.length);
        });
        codeBlocks.push({match: match, firstIndex: offset, lastIndex: offset + match.length});
        return match;
    });

    // Find all of the '4 spaces before' code blocks and add them to the codeBlocks list
    text.replace(/(?:^(?: {4}|\t)(?:(?:.|\n)(?!(?:^ {0,3}\S)))*)/gm, function (match, offset, string) {
        // If an outer html element is inside of a code block or the code block is inside the outer html element,
        // we dont want to have it listed twice in the code blocks array that we are ignoring. We have the extra
        // check because sometimes the 4 spaces before shows up inside the GUS description outer HTML blocks, and we dont want
        // that to be recognized as a code block because we are already recognizing the GUS description outer HTML blocks
        var addToCodeBlocks = true;
        for (var element of codeBlocks) {
            if (!(element.firstIndex > offset && element.lastIndex < (offset + match.length))) {
                addToCodeBlocks = false;
                break;
            }
        }
        if (addToCodeBlocks === true) {
            codeBlocks.push({match: match, firstIndex: offset, lastIndex: offset + match.length});
        }
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
    var nonCodeTextArray = [];
    var startNonCodeIndex = 0;
    for (var y = 0; y < codeBlocks.length; y++) {
        nonCodeTextArray.push(text.substring(startNonCodeIndex, codeBlocks[y].firstIndex));
        startNonCodeIndex = codeBlocks[y].lastIndex;
    }
    nonCodeTextArray.push(text.slice(startNonCodeIndex));
    for (var i = 0; i < nonCodeTextArray.length; i++) {

        let nonCodeText = nonCodeTextArray[i];

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
        nonCodeTextArray[i] = nonCodeText;
    }
    var newText = '';
    // Recombine the freshly changed noncodetext with the code block text
    for (var x = 0 ; x < codeBlocks.length; x++) {
        newText += nonCodeTextArray[x] + codeBlocks[x].match;
    }
    newText += nonCodeTextArray[nonCodeTextArray.length - 1];
    return newText;
}

// Run the transformed text through the marked markdown interpreter
function transformWithMarked (text) {
    text = textTransform(text);
    return marked(text);
}

var userStoryID = 'descriptionInput';
var bugID = 'detailsAndStepsInput';
var investigationID = 'detailsAndStepsInputInvestigation';
var workManagerRun = false;
var specificWorkSelector = 'h2.slds-text-heading--medium a';
var css = {
    classes: {
        mdPreview: 'work-manager-mdpreview',
        titleDiv: 'bugedit-lightning-titlediv',
        title: 'slds-form-element__label'
    }
};
var titleDivs = [];
var mdps = [];
var mdpts = [];
var workID;
var workInterval;
var styleInterval;
var getOffsetParents;
var element;
var destinationElement;

window.chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var responseObj = {received: true};
    // Request.changeRun is set when the chrome extension icon is clicked. The background page
    // gets notified of that event and tells the script to switch what it was doing and run
    // the opposite way (i.e. view vs reset, edit vs reset)
    if (request.changeRun) {
        workManagerRun = !workManagerRun;
        showOrHidePreview();
    }

    if (request.getCurrentRunState) {
        responseObj.runState = workManagerRun;
    }

    if (request.getCurrentWorkID) {
        if (typeof(workID) != 'undefined') {
            responseObj.workID = workID;
        }
    }

    // Here, we send back the script's run state to the background page, so the chrome extension
    // icon can be set accordingly
    sendResponse(responseObj);
});

/**
 * Sets the markdown preview's inner HTML to whatever the markdown would be
 * after being passed through the textTransform function
 * @param  {Event} event The event that is fired by the edit box
 */
function previewEditor (event) {
    var text = event.target.value || event.target.innerHTML;
    // Event.target is the edit box, event.target.prev is the markdown preview box
    if(typeof(workID) !== 'undefined') {
        mdps[workID].innerHTML = transformWithMarked(text);
    }
}

/**
 * Scrolling event handler for edits that scrolls the markdown preview as the edit scrolls,
 * keeping the two in sync
 * @param  {Event} event The event that is fired by the edit box
 */
function scrollEvent (event) {
    if (typeof(workID) != 'undefined') {
        mdps[workID].scrollTop = event.target.scrollTop;
    }
}

/**
 * Appends a markdown preview to the page
 * @param  {object} css   contains css classes to be applied to new preview elements
 */
function editingPage (css) {
    if (typeof(workID) != 'undefined') {
        var td = titleDivs[workID];
        var mdp = mdps[workID];
        var mdpt = mdpts[workID];
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
            titleDivs[workID] = titleDiv;
        }
        if (mdp) {
            markdownPreview = mdp;
            markdownPreview.style.display = 'block';
        } else {
            markdownPreview = document.createElement('div');
            markdownPreview.id = 'markdown-preview';
            markdownPreview.className = css.classes.mdPreview;
            mdps[workID] = markdownPreview;
        }
        if (mdpt) {
            markdownPreviewTitle = mdpt;
            markdownPreviewTitle.style.display = 'block';
        } else {
            markdownPreviewTitle = document.createElement('label');
            markdownPreviewTitle.id = 'markdown-preview-title';
            markdownPreviewTitle.innerHTML = 'Markdown Preview';
            markdownPreviewTitle.className = css.classes.title;
            mdpts[workID] = markdownPreviewTitle;
            titleDiv.appendChild(markdownPreviewTitle);
            destinationElement.appendChild(titleDiv);
            destinationElement.appendChild(markdownPreview);
        }

        // Tell the editing box to listen to keyup events, so that rendered
        // markdown can be displayed live as the user types
        var initialKeyup = new CustomEvent('keyup');
        element.addEventListener('keyup', previewEditor);
        // We have to do an initial keyup so that when the page loads the user
        // will see the preview immediately
        element.dispatchEvent(initialKeyup);
        element.addEventListener('scroll', scrollEvent);
    }
}

/**
 * Hides the markdown preview
 */
function editingReset () {
    if (typeof(workID) != 'undefined') {
        if (titleDivs[workID]) {
            titleDivs[workID].style.display = 'none';
        }
        if (mdps[workID]) {
            mdps[workID].style.display = 'none';
        }
        if(mdpts[workID]) {
            mdpts[workID].style.display = 'none';
        }
    }
}

function inputChange (event) {
    if (event.target.checked === true) {
        if (event.target.id === 'recordTypeInputBug') {
            element = document.querySelector('#' + bugID);
        } else if (event.target.id === 'recordTypeInputUserStory') {
            element = document.querySelector('#' + userStoryID);
        } else {
            element = document.querySelector('#' + investigationID);
        }
        destinationElement = element.parentElement;
        if (workManagerRun === true) {
            editingPage(css);
        } else {
            editingReset();
        }
    }
}

function showOrHidePreview() {
    if (typeof(workID) !== 'undefined') {
        var userStoryInput = document.querySelector('#recordTypeInputUserStory');
        var bugInput = document.querySelector('#recordTypeInputBug');
        if (userStoryInput.checked === true) {
            element = document.querySelector('#' + userStoryID);
        } else if (bugInput.checked === true) {
            element = document.querySelector('#' + bugID);
        } else {
            element = document.querySelector('#' + investigationID);
        }
        destinationElement = element.parentElement;
        if (workManagerRun === true) {
            editingPage(css);
        } else {
            editingReset();
        }
    }
}

function leaveEvent(event) {
    if (typeof(workID) != 'undefined') {
        if (element !== null && typeof(element) != 'undefined') {
            element.removeEventListener('scroll', scrollEvent);
            element.removeEventListener('keyup', previewEditor);
        }
        if (titleDivs[workID]) {
            titleDivs[workID].style.display = 'none';
        }
        if (mdps[workID]) {
            mdps[workID].style.display = 'none';
        }
        if(mdpts[workID]) {
            mdpts[workID].style.display = 'none';
        }
    }
    clearInterval(styleInterval);
    clearInterval(getOffsetParents);
    clearInterval(workInterval);
    workID = undefined;
    window.chrome.runtime.sendMessage({setIcon: false});
}

function linkClickFunction (event, interval) {
    workInterval = setInterval(function () {
        workID = document.querySelector(specificWorkSelector);
        if (workID !== null) {
            workID = workID.innerHTML;
            clearInterval(workInterval);
        }
    }, 400);
    window.chrome.runtime.sendMessage({setIcon: true});
    workManagerRun = true;
    var userStoryInput = document.querySelector('#recordTypeInputUserStory');
    var bugInput = document.querySelector('#recordTypeInputBug');
    var investigationInput = document.querySelector('#recordTypeInputInvestigation');
    userStoryInput.addEventListener('change', inputChange);
    bugInput.addEventListener('change', inputChange);
    investigationInput.addEventListener('change', inputChange);
    var changeEvent = new Event('change');
    getOffsetParents = setInterval(function () {
        var userStoryOffsetParent = document.querySelector('#' + userStoryID).offsetParent;
        var bugOffsetParent = document.querySelector('#' + bugID).offsetParent;
        var investigationOffsetParent = document.querySelector('#' + investigationID).offsetParent;
        if (userStoryOffsetParent !== null || bugOffsetParent !== null || investigationOffsetParent !== null) {
            if (bugOffsetParent === null && investigationOffsetParent === null) {
                userStoryInput.dispatchEvent(changeEvent);
                clearInterval(getOffsetParents);
            } else if (userStoryOffsetParent === null && bugOffsetParent === null) {
                investigationInput.dispatchEvent(changeEvent);
                clearInterval(getOffsetParents);
            } else if (userStoryOffsetParent === null && investigationOffsetParent === null) {
                bugInput.dispatchEvent(changeEvent);
                clearInterval(getOffsetParents);
            } else {
                styleInterval = setInterval(function () {
                    if (bugOffsetParent.style.display === '') {
                        bugInput.dispatchEvent(changeEvent);
                    } else if (userStoryOffsetParent.style.display === '') {
                        userStoryInput.dispatchEvent(changeEvent);
                    } else {
                        investigationInput.dispatchEvent(changeEvent);
                    }
                    clearInterval(styleInterval);
                }, 400);
                clearInterval(getOffsetParents);
            }
        }
    }, 1000);
}

var workSaveButton = document.getElementById('workSaveButton');
var workCancelButton = document.getElementById('workCancelButton');
workCancelButton.addEventListener('click', leaveEvent);
workSaveButton.addEventListener('click', leaveEvent);

setInterval(function () {
    var workLinks = document.querySelectorAll('div.long-subject-cell a');
    if (workLinks !== null && workLinks.length > 0) {
        for (var i = 0; i < workLinks.length; i++) {
            workLinks[i].addEventListener('click', linkClickFunction);
        }
    }
}, 200);

}());