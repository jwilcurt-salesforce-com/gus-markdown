!function(){"use strict";function e(e){var t=[];(e=(e=e.replace(/\nselect \* from([^\n]|\n(?!\n))*/g,"```$&\n```  \n")).replace(/\nRequest URL:([^\n]|\n(?!\n))*/g,"```$&\n```  \n")).replace(/(?:```(?:.|\n)*```)|(?:^(?: {4}|\t)(?:(?:.|\n)(?!(?:^ {0,3}\S)))*)/gm,function(e){return t.push(e),e});for(var n=e.split(/(?:```(?:.|\n)*```)|(?:^(?: {4}|\t)(?:(?:.|\n)(?!(?:^ {0,3}\S)))*)/gm),r=0;r<n.length;r++){let e=n[r];e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=(e=e.split("\n<br>").join("\n")).split("<br>").join("\n")).replace(/\n\s?\d\)\s/g,"\n1. ")).replace(/((\b[ ]*)\n(?=\S|\s))/g,"  \n")).replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g,function(e,t){return void 0!==t?t+"  \n":e})).replace(/\nselect \* from([^\n]|\n(?!\n))*/g,"```$&\n```  \n---")).replace(/\nRequest URL:([^\n]|\n(?!\n))*/g,"```$&\n```  \n---")).replace(/^([^\.|\n]+)(?!\.)(:)(\s+)/gm,"****$1$2****$3")).replace(/(\\)(_)(?!(?:_)+)/g,"\\$1\\$2")).replace(/([^_])(_)(?!(?:_)+)/g,"$1\\$2")).replace(/^(_)(?!(?:_)+)/gm,"\\$1")).replace(/(\\)(_)(_)(?!(?:_)+)/g,"\\$1\\$2\\$3")).replace(/([^_])(_)(_)(?!(?:_)+)/g,"$1\\$2\\$3")).replace(/^(_)(_)(?!(?:_)+)/gm,"\\$1\\$2")).replace(/(\\)(_)(_)(_)(_)(?!(?:_)+)/g,"\\$1__")).replace(/([^_])(_)(_)(_)(_)(?!(?:_)+)/g,"$1__")).replace(/^(_)(_)(_)(_)(?!(?:_)+)/gm,"__")).replace(/(\\)(_)(_)(_)(?!(?:_)+)/g,"\\$1_")).replace(/([^_])(_)(_)(_)(?!(?:_)+)/g,"$1_")).replace(/^(_)(_)(_)(?!(?:_)+)/gm,"_")).replace(/(\\)(\*)(?!(?:\*)+)/g,"\\$1\\$2")).replace(/([^\*])(\*)(?!(?:\*)+)/g,"$1\\$2")).replace(/^(\*)(?!(?:\*)+)/gm,"\\$1")).replace(/(\\)(\*)(\*)(?!(?:\*)+)/g,"\\$1\\$2\\$3")).replace(/([^\*])(\*)(\*)(?!(?:\*)+)/g,"$1\\$2\\$3")).replace(/^(\*)(\*)(?!(?:\*)+)/gm,"\\$1\\$2")).replace(/(\\)(\*)(\*)(\*)(\*)(?!(?:\*)+)/g,"\\$1**")).replace(/([^\*])(\*)(\*)(\*)(\*)(?!(?:\*)+)/g,"$1**")).replace(/^(\*)(\*)(\*)(\*)(?!(?:\*)+)/gm,"**")).replace(/(\\)(\*)(\*)(\*)(?!(?:\*)+)/g,"\\$1*")).replace(/([^\*])(\*)(\*)(\*)(?!(?:\*)+)/g,"$1*")).replace(/^(\*)(\*)(\*)(?!(?:\*)+)/gm,"*"),n[r]=e}for(var i="",s=0;s<t.length;s++)i+=n[s]+t[s];return i+=n[n.length-1],console.log(i),i}function t(t){return t=e(t),y(t)}function n(){location.href.indexOf(_)>-1&&-1==location.href.indexOf("view")&&null===document.querySelector("#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer")?(m=!0,null===document.querySelector("body.desktop")&&(F=!0)):(m=!1,F=!1)}function r(e){var n="";e&&(n=e.innerHTML,P=e.innerHTML,window.chrome.runtime.sendMessage({originalHTML:P})),n.length>0&&(void 0!==W[location.href]?e.innerHTML=t(W[location.href]):e.innerHTML=t(n))}function i(e){e.innerHTML=W[location.href]}function s(e){var n=e.target.value||e.target.innerHTML;e.target.prev.innerHTML=t()(n)}function o(e){document.querySelector("#markdown-preview").scrollTop=e.target.scrollingElement.scrollTop}function l(e){document.querySelector("#markdown-preview").scrollTop=e.target.scrollTop}function a(e,t,n){var r,i,o,l=document.querySelector("#title-div"),a=document.querySelector("#markdown-preview"),u=document.querySelector("#markdown-preview-title");l?(r=l).style.display="block":((r=document.createElement("div")).id="title-div",r.className=n.classes.titleDiv),a?(i=a).style.display="block":((i=document.createElement("div")).id="markdown-preview",i.className=n.classes.mdPreview),u?(o=u).style.display="block":((o=document.createElement("label")).id="markdown-preview-title",o.innerHTML="Markdown Preview",o.className=n.classes.title,r.appendChild(o),t.appendChild(r),t.appendChild(i),e.prev=i);var c=new CustomEvent("keyup");e.addEventListener("keyup",s),e.dispatchEvent(c)}function u(e){e.removeEventListener("keyup",s),document.querySelector("#title-div").style.display="none",document.querySelector("#markdown-preview").style.display="none",document.querySelector("#markdown-preview-title").style.display="none"}function c(e){e.focus(),e.select();var t=document.createEvent("KeyboardEvent");t[void 0!==t.initKeyboardEvent?"initKeyboardEvent":"initKeyEvent"]("keydown",!0,!0,window,!1,!1,!1,!1,40,0),e.dispatchEvent(t)}function h(e){return document.querySelectorAll("iframe")[e]}function p(e,t,n,s){1==t?window.gusMarkdownRun?a(e,n,s):u(e):window.gusMarkdownRun?r(e):i(e)}function d(e,t,n){window.gusMarkdownRun?e.addEventListener(t,n):e.removeEventListener(t,n)}function g(e,t,n){for(var r=0;r<e.length;r++){let i=e[r];if(null!==i.offsetParent)return console.log(t),p(i,!1),clearInterval(n),!0}return!1}function f(){n();var e,t,r,i;if(!m||F&&m)if(location.href.indexOf(_)>-1&&-1==location.href.indexOf("view"))null!==document.querySelector("#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer")?(console.log("userstoryedit lightning"),e=document.getElementById($),t=e.parentElement,d(e,"scroll",l),p(e,!0,t,S)):i=setInterval(function(){void 0===r?r=h(0):(console.log("bugedit lightning"),void 0===(e=r.contentDocument.getElementById(x))||null===e?(r.onload=function(){e=r.contentDocument.getElementById(x),t=document.querySelectorAll(w)[1],p(e,!0,t,v),d(e.ownerDocument,"scroll",o)},clearInterval(i)):(t=document.querySelectorAll(w)[1],p(e,!0,t,v),d(e.ownerDocument,"scroll",o),clearInterval(i)))},200);else if(location.href.indexOf(E)>-1&&-1==location.href.indexOf(_))console.log("bugedit classic"),i=setInterval(function(){void 0===r?r=h(1):(e=r.contentDocument.getElementById(L),t=document.getElementById(q),void 0===e||null===e?(r.onload=function(){e=r.contentWindow.document.getElementById(L),t=document.getElementById(q),p(e,!0,t,I),d(e.ownerDocument,"scroll",o)},clearInterval(i)):(p(e,!0,t,I),d(e.ownerDocument,"scroll",o),clearInterval(i)))},200);else if(location.href.indexOf(b)>-1&&-1==location.href.indexOf(_)){if(console.log("bugedit classic preview"),setTimeout(function(){},200),null!=(e=document.getElementById("descriptionInput"))){t=e.parentElement,a(e,t);var s=document.getElementById("workSaveButton"),u=document.getElementById("workCancelButton");u.addEventListener&&u.addEventListener("click",function(){c(e)},!1),s.addEventListener&&s.addEventListener("click",function(){c(e)},!1)}}else if(location.href.indexOf(C)>-1&&-1==location.href.indexOf(_))console.log("userstoryedit classic"),e=document.getElementById(M),t=e.parentElement,p(e,!0,t,O),d(e,"scroll",l);else if(location.href.indexOf(_)>-1&&location.href.indexOf("view")>-1){let e=setInterval(function(){let t=document.querySelectorAll("div.slds-rich-text-editor__output.uiOutputRichText.forceOutputRichText");t.length>0?!1===g(t,"bugdetail lightning",e)&&(t=document.querySelectorAll("span.uiOutputTextArea")).length>0&&g(t,"userstorydetail lightning",e):(t=document.querySelectorAll("span.uiOutputTextArea")).length>0&&g(t,"userstorydetail lightning",e)},500)}else if(location.href.indexOf(A)>-1&&-1==location.href.indexOf(_)){console.log("userstorydetail classic");let e=document.getElementById(T);p(e,!1)}else if(location.href.indexOf(R)>-1&&-1==location.href.indexOf(_)){console.log("bugdetail classic");let e=document.getElementById(D);p(e,!1)}else window.gusMarkdownRun=!1,console.log("not found")}var m,k="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},y=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e,t){(function(){function t(e){this.tokens=[],this.tokens.links={},this.options=e||c.defaults,this.rules=h.normal,this.options.gfm&&(this.options.tables?this.rules=h.tables:this.rules=h.gfm)}function n(e,t){if(this.options=t||c.defaults,this.links=e,this.rules=p.normal,this.renderer=this.options.renderer||new r,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.gfm?this.options.breaks?this.rules=p.breaks:this.rules=p.gfm:this.options.pedantic&&(this.rules=p.pedantic)}function r(e){this.options=e||{}}function i(e){this.tokens=[],this.token=null,this.options=e||c.defaults,this.options.renderer=this.options.renderer||new r,this.renderer=this.options.renderer,this.renderer.options=this.options}function s(e,t){return e.replace(t?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function o(e){return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(e,t){return"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""})}function l(e,t){return e=e.source,t=t||"",function n(r,i){return r?(i=i.source||i,i=i.replace(/(^|[^\[])\^/g,"$1"),e=e.replace(r,i),n):new RegExp(e,t)}}function a(){}function u(e){for(var t,n,r=1;r<arguments.length;r++){t=arguments[r];for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}function c(e,n,r){if(r||"function"==typeof n){r||(r=n,n=null);var o,l,a=(n=u({},c.defaults,n||{})).highlight,h=0;try{o=t.lex(e,n)}catch(e){return r(e)}l=o.length;var p=function(e){if(e)return n.highlight=a,r(e);var t;try{t=i.parse(o,n)}catch(t){e=t}return n.highlight=a,e?r(e):r(null,t)};if(!a||a.length<3)return p();if(delete n.highlight,!l)return p();for(;h<o.length;h++)!function(e){"code"!==e.type?--l||p():a(e.text,e.lang,function(t,n){return t?p(t):null==n||n===e.text?--l||p():(e.text=n,e.escaped=!0,void(--l||p()))})}(o[h])}else try{return n&&(n=u({},c.defaults,n)),i.parse(t.lex(e,n),n)}catch(e){if(e.message+="\nPlease report this to https://github.com/chjj/marked.",(n||c.defaults).silent)return"<p>An error occured:</p><pre>"+s(e.message+"",!0)+"</pre>";throw e}}var h={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:a,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:a,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:a,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};h.bullet=/(?:[*+-]|\d+\.)/,h.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,h.item=l(h.item,"gm")(/bull/g,h.bullet)(),h.list=l(h.list)(/bull/g,h.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+h.def.source+")")(),h.blockquote=l(h.blockquote)("def",h.def)(),h._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b",h.html=l(h.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,h._tag)(),h.paragraph=l(h.paragraph)("hr",h.hr)("heading",h.heading)("lheading",h.lheading)("blockquote",h.blockquote)("tag","<"+h._tag)("def",h.def)(),h.normal=u({},h),h.gfm=u({},h.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/}),h.gfm.paragraph=l(h.paragraph)("(?!","(?!"+h.gfm.fences.source.replace("\\1","\\2")+"|"+h.list.source.replace("\\1","\\3")+"|")(),h.tables=u({},h.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}),t.rules=h,t.lex=function(e,n){return new t(n).lex(e)},t.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},t.prototype.token=function(e,t,n){for(var r,i,s,o,l,a,u,c,p,e=e.replace(/^ +$/gm,"");e;)if((s=this.rules.newline.exec(e))&&(e=e.substring(s[0].length),s[0].length>1&&this.tokens.push({type:"space"})),s=this.rules.code.exec(e))e=e.substring(s[0].length),s=s[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?s:s.replace(/\n+$/,"")});else if(s=this.rules.fences.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"code",lang:s[2],text:s[3]||""});else if(s=this.rules.heading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:s[1].length,text:s[2]});else if(t&&(s=this.rules.nptable.exec(e))){for(e=e.substring(s[0].length),a={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/\n$/,"").split("\n")},c=0;c<a.align.length;c++)/^ *-+: *$/.test(a.align[c])?a.align[c]="right":/^ *:-+: *$/.test(a.align[c])?a.align[c]="center":/^ *:-+ *$/.test(a.align[c])?a.align[c]="left":a.align[c]=null;for(c=0;c<a.cells.length;c++)a.cells[c]=a.cells[c].split(/ *\| */);this.tokens.push(a)}else if(s=this.rules.lheading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:"="===s[2]?1:2,text:s[1]});else if(s=this.rules.hr.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"hr"});else if(s=this.rules.blockquote.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"blockquote_start"}),s=s[0].replace(/^ *> ?/gm,""),this.token(s,t,!0),this.tokens.push({type:"blockquote_end"});else if(s=this.rules.list.exec(e)){for(e=e.substring(s[0].length),o=s[2],this.tokens.push({type:"list_start",ordered:o.length>1}),r=!1,p=(s=s[0].match(this.rules.item)).length,c=0;c<p;c++)u=(a=s[c]).length,~(a=a.replace(/^ *([*+-]|\d+\.) +/,"")).indexOf("\n ")&&(u-=a.length,a=this.options.pedantic?a.replace(/^ {1,4}/gm,""):a.replace(new RegExp("^ {1,"+u+"}","gm"),"")),this.options.smartLists&&c!==p-1&&(o===(l=h.bullet.exec(s[c+1])[0])||o.length>1&&l.length>1||(e=s.slice(c+1).join("\n")+e,c=p-1)),i=r||/\n\n(?!\s*$)/.test(a),c!==p-1&&(r="\n"===a.charAt(a.length-1),i||(i=r)),this.tokens.push({type:i?"loose_item_start":"list_item_start"}),this.token(a,!1,n),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(s=this.rules.html.exec(e))e=e.substring(s[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===s[1]||"script"===s[1]||"style"===s[1]),text:s[0]});else if(!n&&t&&(s=this.rules.def.exec(e)))e=e.substring(s[0].length),this.tokens.links[s[1].toLowerCase()]={href:s[2],title:s[3]};else if(t&&(s=this.rules.table.exec(e))){for(e=e.substring(s[0].length),a={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/(?: *\| *)?\n$/,"").split("\n")},c=0;c<a.align.length;c++)/^ *-+: *$/.test(a.align[c])?a.align[c]="right":/^ *:-+: *$/.test(a.align[c])?a.align[c]="center":/^ *:-+ *$/.test(a.align[c])?a.align[c]="left":a.align[c]=null;for(c=0;c<a.cells.length;c++)a.cells[c]=a.cells[c].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(a)}else if(t&&(s=this.rules.paragraph.exec(e)))e=e.substring(s[0].length),this.tokens.push({type:"paragraph",text:"\n"===s[1].charAt(s[1].length-1)?s[1].slice(0,-1):s[1]});else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"text",text:s[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens};var p={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:a,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:a,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};p._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,p._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,p.link=l(p.link)("inside",p._inside)("href",p._href)(),p.reflink=l(p.reflink)("inside",p._inside)(),p.normal=u({},p),p.pedantic=u({},p.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}),p.gfm=u({},p.normal,{escape:l(p.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:l(p.text)("]|","~]|")("|","|https?://|")()}),p.breaks=u({},p.gfm,{br:l(p.br)("{2,}","*")(),text:l(p.gfm.text)("{2,}","*")()}),n.rules=p,n.output=function(e,t,r){return new n(t,r).output(e)},n.prototype.output=function(e){for(var t,n,r,i,o="";e;)if(i=this.rules.escape.exec(e))e=e.substring(i[0].length),o+=i[1];else if(i=this.rules.autolink.exec(e))e=e.substring(i[0].length),"@"===i[2]?(n=":"===i[1].charAt(6)?this.mangle(i[1].substring(7)):this.mangle(i[1]),r=this.mangle("mailto:")+n):r=n=s(i[1]),o+=this.renderer.link(r,null,n);else if(this.inLink||!(i=this.rules.url.exec(e))){if(i=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(i[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(i[0])&&(this.inLink=!1),e=e.substring(i[0].length),o+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(i[0]):s(i[0]):i[0];else if(i=this.rules.link.exec(e))e=e.substring(i[0].length),this.inLink=!0,o+=this.outputLink(i,{href:i[2],title:i[3]}),this.inLink=!1;else if((i=this.rules.reflink.exec(e))||(i=this.rules.nolink.exec(e))){if(e=e.substring(i[0].length),t=(i[2]||i[1]).replace(/\s+/g," "),!(t=this.links[t.toLowerCase()])||!t.href){o+=i[0].charAt(0),e=i[0].substring(1)+e;continue}this.inLink=!0,o+=this.outputLink(i,t),this.inLink=!1}else if(i=this.rules.strong.exec(e))e=e.substring(i[0].length),o+=this.renderer.strong(this.output(i[2]||i[1]));else if(i=this.rules.em.exec(e))e=e.substring(i[0].length),o+=this.renderer.em(this.output(i[2]||i[1]));else if(i=this.rules.code.exec(e))e=e.substring(i[0].length),o+=this.renderer.codespan(s(i[2],!0));else if(i=this.rules.br.exec(e))e=e.substring(i[0].length),o+=this.renderer.br();else if(i=this.rules.del.exec(e))e=e.substring(i[0].length),o+=this.renderer.del(this.output(i[1]));else if(i=this.rules.text.exec(e))e=e.substring(i[0].length),o+=this.renderer.text(s(this.smartypants(i[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else e=e.substring(i[0].length),r=n=s(i[1]),o+=this.renderer.link(r,null,n);return o},n.prototype.outputLink=function(e,t){var n=s(t.href),r=t.title?s(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(n,r,this.output(e[1])):this.renderer.image(n,r,s(e[1]))},n.prototype.smartypants=function(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e},n.prototype.mangle=function(e){if(!this.options.mangle)return e;for(var t,n="",r=e.length,i=0;i<r;i++)t=e.charCodeAt(i),Math.random()>.5&&(t="x"+t.toString(16)),n+="&#"+t+";";return n},r.prototype.code=function(e,t,n){if(this.options.highlight){var r=this.options.highlight(e,t);null!=r&&r!==e&&(n=!0,e=r)}return t?'<pre><code class="'+this.options.langPrefix+s(t,!0)+'">'+(n?e:s(e,!0))+"\n</code></pre>\n":"<pre><code>"+(n?e:s(e,!0))+"\n</code></pre>"},r.prototype.blockquote=function(e){return"<blockquote>\n"+e+"</blockquote>\n"},r.prototype.html=function(e){return e},r.prototype.heading=function(e,t,n){return"<h"+t+' id="'+this.options.headerPrefix+n.toLowerCase().replace(/[^\w]+/g,"-")+'">'+e+"</h"+t+">\n"},r.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},r.prototype.list=function(e,t){var n=t?"ol":"ul";return"<"+n+">\n"+e+"</"+n+">\n"},r.prototype.listitem=function(e){return"<li>"+e+"</li>\n"},r.prototype.paragraph=function(e){return"<p>"+e+"</p>\n"},r.prototype.table=function(e,t){return"<table>\n<thead>\n"+e+"</thead>\n<tbody>\n"+t+"</tbody>\n</table>\n"},r.prototype.tablerow=function(e){return"<tr>\n"+e+"</tr>\n"},r.prototype.tablecell=function(e,t){var n=t.header?"th":"td";return(t.align?"<"+n+' style="text-align:'+t.align+'">':"<"+n+">")+e+"</"+n+">\n"},r.prototype.strong=function(e){return"<strong>"+e+"</strong>"},r.prototype.em=function(e){return"<em>"+e+"</em>"},r.prototype.codespan=function(e){return"<code>"+e+"</code>"},r.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},r.prototype.del=function(e){return"<del>"+e+"</del>"},r.prototype.link=function(e,t,n){if(this.options.sanitize){try{var r=decodeURIComponent(o(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(0===r.indexOf("javascript:")||0===r.indexOf("vbscript:"))return""}var i='<a href="'+e+'"';return t&&(i+=' title="'+t+'"'),i+=">"+n+"</a>"},r.prototype.image=function(e,t,n){var r='<img src="'+e+'" alt="'+n+'"';return t&&(r+=' title="'+t+'"'),r+=this.options.xhtml?"/>":">"},r.prototype.text=function(e){return e},i.parse=function(e,t,n){return new i(t,n).parse(e)},i.prototype.parse=function(e){this.inline=new n(e.links,this.options,this.renderer),this.tokens=e.reverse();for(var t="";this.next();)t+=this.tok();return t},i.prototype.next=function(){return this.token=this.tokens.pop()},i.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},i.prototype.parseText=function(){for(var e=this.token.text;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)},i.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":var e,t,n,r,i="",s="";for(n="",e=0;e<this.token.header.length;e++)({header:!0,align:this.token.align[e]}),n+=this.renderer.tablecell(this.inline.output(this.token.header[e]),{header:!0,align:this.token.align[e]});for(i+=this.renderer.tablerow(n),e=0;e<this.token.cells.length;e++){for(t=this.token.cells[e],n="",r=0;r<t.length;r++)n+=this.renderer.tablecell(this.inline.output(t[r]),{header:!1,align:this.token.align[r]});s+=this.renderer.tablerow(n)}return this.renderer.table(i,s);case"blockquote_start":for(s="";"blockquote_end"!==this.next().type;)s+=this.tok();return this.renderer.blockquote(s);case"list_start":for(var s="",o=this.token.ordered;"list_end"!==this.next().type;)s+=this.tok();return this.renderer.list(s,o);case"list_item_start":for(s="";"list_item_end"!==this.next().type;)s+="text"===this.token.type?this.parseText():this.tok();return this.renderer.listitem(s);case"loose_item_start":for(s="";"list_item_end"!==this.next().type;)s+=this.tok();return this.renderer.listitem(s);case"html":var l=this.token.pre||this.options.pedantic?this.token.text:this.inline.output(this.token.text);return this.renderer.html(l);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}},a.exec=a,c.options=c.setOptions=function(e){return u(c.defaults,e),c},c.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,sanitizer:null,mangle:!0,smartLists:!1,silent:!1,highlight:null,langPrefix:"lang-",smartypants:!1,headerPrefix:"",renderer:new r,xhtml:!1},c.Parser=i,c.parser=i.parse,c.Renderer=r,c.Lexer=t,c.lexer=t.lex,c.InlineLexer=n,c.inlineLexer=n.output,c.parse=c,e.exports=c}).call(function(){return this||("undefined"!=typeof window?window:k)}())}),_="gus.lightning.force",b="/apex/ADM_WorkManager",x="bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body",w="div.slds-col.slds-col--padded.slds-p-bottom--medium.slds-size--1-of-1.slds-medium-size--1-of-1.slds-large-size--1-of-1",v={classes:{mdPreview:"bugedit-lightning-mdpreview",titleDiv:"bugedit-lightning-titlediv",title:"slds-form-element__label"}},$="userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer",S={classes:{mdPreview:"userstoryedit-lightning-mdpreview",titleDiv:"userstoryedit-lightning-titlediv",title:"slds-form-element__label"}},E="/apex/adm_bugedit",L="bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body",q="richDetailsWrapper",I={classes:{mdPreview:"inlineEditWrite bugedit-classic-mdpreview",titleDiv:"gusFormFieldLeft bugedit-classic-titlediv",title:""}},C="/apex/adm_userstoryedit",M="userStoryWorkPage:storyWorkForm:detailsInput:formRow:input",O={classes:{mdPreview:"userstoryedit-classic-mdpreview",titleDiv:"gusFormFieldLeft userstoryedit-classic-titlediv",title:""}},A="/apex/adm_userstorydetail",T="userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner",R="/apex/adm_bugdetail",D="bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div",F=!1;window.gusMarkdownRun=!0;var P="",W={};window.chrome.runtime.onMessage.addListener(function(e,t,n){var r={received:!0};e.originalHTML&&(W[location.href]=e.originalHTML),e.changeRun&&(window.gusMarkdownRun=!window.gusMarkdownRun,f()),e.init&&(window.gusMarkdownRun=!0,f()),e.getCurrentRunState&&(r.runState=window.gusMarkdownRun),n(r)}),f()}();
