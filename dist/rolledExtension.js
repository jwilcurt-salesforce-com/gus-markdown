!function(){"use strict";function e(e){return e=e.split("\n<br>").join("\n"),e=e.split("<br>").join("\n"),e=e.replace(/\n\s?\d\)\s/g,"\n1. "),e=e.replace(/((\b[ ]*)\n(?=\S|\s))/g,"  \n"),e=e.replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g,function(e,t){return void 0!==t?t+"  \n":e}),e=e.replace(/\nselect \* from([^\n]|\n(?!\n))*/g,"```$&\n```  \n---"),e=e.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g,"```$&\n```  \n---"),e=e.replace(/\\_/g,"\\\\_"),e=e.replace(/_/g,"\\_"),m(e)}function t(){location.href.indexOf(k)>-1&&-1==location.href.indexOf("view")&&null===document.querySelector("#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer")?(g=!0,null===document.querySelector("body.desktop")&&(D=!0,window.chrome.runtime.sendMessage({iframe:!0}))):(g=!1,D=!1)}function n(t){var n="";t&&(n=t.innerHTML,P=t.innerHTML,window.chrome.runtime.sendMessage({originalHTML:P})),n.length>0&&(void 0!==R[location.href]?t.innerHTML=e(R[location.href]):t.innerHTML=e(n))}function i(e){e.innerHTML=R[location.href]}function r(t){var n=t.target.value||t.target.innerHTML;t.target.prev.innerHTML=e(n)}function s(e){document.querySelector("#markdown-preview").scrollTop=e.target.scrollingElement.scrollTop}function o(e){document.querySelector("#markdown-preview").scrollTop=e.target.scrollTop}function l(e,t,n){var i,s,o,l=document.querySelector("#title-div"),a=document.querySelector("#markdown-preview"),u=document.querySelector("#markdown-preview-title");l?(i=l).style.display="block":((i=document.createElement("div")).id="title-div",i.className=n.classes.titleDiv),a?(s=a).style.display="block":((s=document.createElement("div")).id="markdown-preview",s.className=n.classes.mdPreview),u?(o=u).style.display="block":((o=document.createElement("label")).id="markdown-preview-title",o.innerHTML="Markdown Preview",o.className=n.classes.title,i.appendChild(o),t.appendChild(i),t.appendChild(s),e.prev=s);var c=new CustomEvent("keyup");e.addEventListener("keyup",r),e.dispatchEvent(c)}function a(e){e.removeEventListener("keyup",r),document.querySelector("#title-div").style.display="none",document.querySelector("#markdown-preview").style.display="none",document.querySelector("#markdown-preview-title").style.display="none"}function u(e){e.focus(),e.select();var t=document.createEvent("KeyboardEvent");t[void 0!==t.initKeyboardEvent?"initKeyboardEvent":"initKeyEvent"]("keydown",!0,!0,window,!1,!1,!1,!1,40,0),e.dispatchEvent(t)}function c(e){return document.querySelectorAll("iframe")[e]}function h(e,t,r,s){1==t?window.gusMarkdownRun?l(e,r,s):a(e):window.gusMarkdownRun?n(e):i(e)}function d(e,t,n){window.gusMarkdownRun?e.addEventListener(t,n):e.removeEventListener(t,n)}function p(){var e,t,n,i;if(!g||D&&g)if(location.href.indexOf(k)>-1&&-1==location.href.indexOf("view"))null!==document.querySelector("#userStoryEdit\\:j_id0\\:workSds\\:storyWorkForm\\:descriptionInput\\:inputComponent\\:inputFieldWithContainer")?(console.log("userstoryedit lightning"),e=document.getElementById(v),t=e.parentElement,d(e,"scroll",o),h(e,!0,t,_)):i=setInterval(function(){void 0===n?n=c(0):(console.log("bugedit lightning"),void 0===(e=n.contentDocument.getElementById(b))||null===e?(n.onload=function(){e=n.contentDocument.getElementById(b),t=document.querySelectorAll(x)[1],h(e,!0,t,w),d(e.ownerDocument,"scroll",s)},clearInterval(i)):(t=document.querySelectorAll(x)[1],h(e,!0,t,w),d(e.ownerDocument,"scroll",s),clearInterval(i)))},200);else if(location.href.indexOf(S)>-1&&-1==location.href.indexOf(k))console.log("bugedit classic"),i=setInterval(function(){void 0===n?n=c(1):(e=n.contentDocument.getElementById(E),t=document.getElementById(L),void 0===e||null===e?(n.onload=function(){e=n.contentWindow.document.getElementById(E),t=document.getElementById(L),h(e,!0,t,I),d(e.ownerDocument,"scroll",s)},clearInterval(i)):(h(e,!0,t,I),d(e.ownerDocument,"scroll",s),clearInterval(i)))},200);else if(location.href.indexOf(y)>-1&&-1==location.href.indexOf(k)){if(console.log("bugedit classic preview"),setTimeout(function(){},200),null!=(e=document.getElementById("descriptionInput"))){t=e.parentElement,l(e,t);var r=document.getElementById("workSaveButton"),a=document.getElementById("workCancelButton");a.addEventListener&&a.addEventListener("click",function(){u(e)},!1),r.addEventListener&&r.addEventListener("click",function(){u(e)},!1)}}else if(location.href.indexOf(q)>-1&&-1==location.href.indexOf(k))console.log("userstoryedit classic"),e=document.getElementById($),t=e.parentElement,h(e,!0,t,C),d(e,"scroll",o);else if(location.href.indexOf(k)>-1&&location.href.indexOf("view")>-1){let t=setInterval(function(){let n=document.querySelectorAll("div.slds-rich-text-editor__output.uiOutputRichText.forceOutputRichText");n.length>0?(n.forEach(function(n){null!==n.offsetParent&&(e=n,console.log("bugdetail lightning"),h(e,!1),clearInterval(t))}),void 0===e&&(n=document.querySelectorAll("span.uiOutputTextArea")).length>0&&n.forEach(function(n){null!==n.offsetParent&&(e=n,console.log("userstorydetail lightning"),h(e,!1),clearInterval(t))})):(n=document.querySelectorAll("span.uiOutputTextArea")).length>0&&n.forEach(function(n){null!==n.offsetParent&&(e=n,console.log("userstorydetail lightning"),h(e,!1),clearInterval(t))})},500)}else if(location.href.indexOf(M)>-1&&-1==location.href.indexOf(k)){console.log("userstorydetail classic");let e=document.getElementById(O);h(e,!1)}else if(location.href.indexOf(A)>-1&&-1==location.href.indexOf(k)){console.log("bugdetail classic");let e=document.getElementById(T);h(e,!1)}else window.gusMarkdownRun=!1,console.log("not found")}var g,f="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},m=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e,t){(function(){function t(e){this.tokens=[],this.tokens.links={},this.options=e||c.defaults,this.rules=h.normal,this.options.gfm&&(this.options.tables?this.rules=h.tables:this.rules=h.gfm)}function n(e,t){if(this.options=t||c.defaults,this.links=e,this.rules=d.normal,this.renderer=this.options.renderer||new i,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.gfm?this.options.breaks?this.rules=d.breaks:this.rules=d.gfm:this.options.pedantic&&(this.rules=d.pedantic)}function i(e){this.options=e||{}}function r(e){this.tokens=[],this.token=null,this.options=e||c.defaults,this.options.renderer=this.options.renderer||new i,this.renderer=this.options.renderer,this.renderer.options=this.options}function s(e,t){return e.replace(t?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function o(e){return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(e,t){return"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""})}function l(e,t){return e=e.source,t=t||"",function n(i,r){return i?(r=r.source||r,r=r.replace(/(^|[^\[])\^/g,"$1"),e=e.replace(i,r),n):new RegExp(e,t)}}function a(){}function u(e){for(var t,n,i=1;i<arguments.length;i++){t=arguments[i];for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}function c(e,n,i){if(i||"function"==typeof n){i||(i=n,n=null);var o,l,a=(n=u({},c.defaults,n||{})).highlight,h=0;try{o=t.lex(e,n)}catch(e){return i(e)}l=o.length;var d=function(e){if(e)return n.highlight=a,i(e);var t;try{t=r.parse(o,n)}catch(t){e=t}return n.highlight=a,e?i(e):i(null,t)};if(!a||a.length<3)return d();if(delete n.highlight,!l)return d();for(;h<o.length;h++)!function(e){"code"!==e.type?--l||d():a(e.text,e.lang,function(t,n){return t?d(t):null==n||n===e.text?--l||d():(e.text=n,e.escaped=!0,void(--l||d()))})}(o[h])}else try{return n&&(n=u({},c.defaults,n)),r.parse(t.lex(e,n),n)}catch(e){if(e.message+="\nPlease report this to https://github.com/chjj/marked.",(n||c.defaults).silent)return"<p>An error occured:</p><pre>"+s(e.message+"",!0)+"</pre>";throw e}}var h={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:a,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:a,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:a,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};h.bullet=/(?:[*+-]|\d+\.)/,h.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,h.item=l(h.item,"gm")(/bull/g,h.bullet)(),h.list=l(h.list)(/bull/g,h.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+h.def.source+")")(),h.blockquote=l(h.blockquote)("def",h.def)(),h._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b",h.html=l(h.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,h._tag)(),h.paragraph=l(h.paragraph)("hr",h.hr)("heading",h.heading)("lheading",h.lheading)("blockquote",h.blockquote)("tag","<"+h._tag)("def",h.def)(),h.normal=u({},h),h.gfm=u({},h.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/}),h.gfm.paragraph=l(h.paragraph)("(?!","(?!"+h.gfm.fences.source.replace("\\1","\\2")+"|"+h.list.source.replace("\\1","\\3")+"|")(),h.tables=u({},h.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}),t.rules=h,t.lex=function(e,n){return new t(n).lex(e)},t.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},t.prototype.token=function(e,t,n){for(var i,r,s,o,l,a,u,c,d,e=e.replace(/^ +$/gm,"");e;)if((s=this.rules.newline.exec(e))&&(e=e.substring(s[0].length),s[0].length>1&&this.tokens.push({type:"space"})),s=this.rules.code.exec(e))e=e.substring(s[0].length),s=s[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?s:s.replace(/\n+$/,"")});else if(s=this.rules.fences.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"code",lang:s[2],text:s[3]||""});else if(s=this.rules.heading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:s[1].length,text:s[2]});else if(t&&(s=this.rules.nptable.exec(e))){for(e=e.substring(s[0].length),a={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/\n$/,"").split("\n")},c=0;c<a.align.length;c++)/^ *-+: *$/.test(a.align[c])?a.align[c]="right":/^ *:-+: *$/.test(a.align[c])?a.align[c]="center":/^ *:-+ *$/.test(a.align[c])?a.align[c]="left":a.align[c]=null;for(c=0;c<a.cells.length;c++)a.cells[c]=a.cells[c].split(/ *\| */);this.tokens.push(a)}else if(s=this.rules.lheading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:"="===s[2]?1:2,text:s[1]});else if(s=this.rules.hr.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"hr"});else if(s=this.rules.blockquote.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"blockquote_start"}),s=s[0].replace(/^ *> ?/gm,""),this.token(s,t,!0),this.tokens.push({type:"blockquote_end"});else if(s=this.rules.list.exec(e)){for(e=e.substring(s[0].length),o=s[2],this.tokens.push({type:"list_start",ordered:o.length>1}),i=!1,d=(s=s[0].match(this.rules.item)).length,c=0;c<d;c++)u=(a=s[c]).length,~(a=a.replace(/^ *([*+-]|\d+\.) +/,"")).indexOf("\n ")&&(u-=a.length,a=this.options.pedantic?a.replace(/^ {1,4}/gm,""):a.replace(new RegExp("^ {1,"+u+"}","gm"),"")),this.options.smartLists&&c!==d-1&&(o===(l=h.bullet.exec(s[c+1])[0])||o.length>1&&l.length>1||(e=s.slice(c+1).join("\n")+e,c=d-1)),r=i||/\n\n(?!\s*$)/.test(a),c!==d-1&&(i="\n"===a.charAt(a.length-1),r||(r=i)),this.tokens.push({type:r?"loose_item_start":"list_item_start"}),this.token(a,!1,n),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(s=this.rules.html.exec(e))e=e.substring(s[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===s[1]||"script"===s[1]||"style"===s[1]),text:s[0]});else if(!n&&t&&(s=this.rules.def.exec(e)))e=e.substring(s[0].length),this.tokens.links[s[1].toLowerCase()]={href:s[2],title:s[3]};else if(t&&(s=this.rules.table.exec(e))){for(e=e.substring(s[0].length),a={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/(?: *\| *)?\n$/,"").split("\n")},c=0;c<a.align.length;c++)/^ *-+: *$/.test(a.align[c])?a.align[c]="right":/^ *:-+: *$/.test(a.align[c])?a.align[c]="center":/^ *:-+ *$/.test(a.align[c])?a.align[c]="left":a.align[c]=null;for(c=0;c<a.cells.length;c++)a.cells[c]=a.cells[c].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(a)}else if(t&&(s=this.rules.paragraph.exec(e)))e=e.substring(s[0].length),this.tokens.push({type:"paragraph",text:"\n"===s[1].charAt(s[1].length-1)?s[1].slice(0,-1):s[1]});else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"text",text:s[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens};var d={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:a,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:a,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};d._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,d._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,d.link=l(d.link)("inside",d._inside)("href",d._href)(),d.reflink=l(d.reflink)("inside",d._inside)(),d.normal=u({},d),d.pedantic=u({},d.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}),d.gfm=u({},d.normal,{escape:l(d.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:l(d.text)("]|","~]|")("|","|https?://|")()}),d.breaks=u({},d.gfm,{br:l(d.br)("{2,}","*")(),text:l(d.gfm.text)("{2,}","*")()}),n.rules=d,n.output=function(e,t,i){return new n(t,i).output(e)},n.prototype.output=function(e){for(var t,n,i,r,o="";e;)if(r=this.rules.escape.exec(e))e=e.substring(r[0].length),o+=r[1];else if(r=this.rules.autolink.exec(e))e=e.substring(r[0].length),"@"===r[2]?(n=":"===r[1].charAt(6)?this.mangle(r[1].substring(7)):this.mangle(r[1]),i=this.mangle("mailto:")+n):i=n=s(r[1]),o+=this.renderer.link(i,null,n);else if(this.inLink||!(r=this.rules.url.exec(e))){if(r=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(r[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(r[0])&&(this.inLink=!1),e=e.substring(r[0].length),o+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(r[0]):s(r[0]):r[0];else if(r=this.rules.link.exec(e))e=e.substring(r[0].length),this.inLink=!0,o+=this.outputLink(r,{href:r[2],title:r[3]}),this.inLink=!1;else if((r=this.rules.reflink.exec(e))||(r=this.rules.nolink.exec(e))){if(e=e.substring(r[0].length),t=(r[2]||r[1]).replace(/\s+/g," "),!(t=this.links[t.toLowerCase()])||!t.href){o+=r[0].charAt(0),e=r[0].substring(1)+e;continue}this.inLink=!0,o+=this.outputLink(r,t),this.inLink=!1}else if(r=this.rules.strong.exec(e))e=e.substring(r[0].length),o+=this.renderer.strong(this.output(r[2]||r[1]));else if(r=this.rules.em.exec(e))e=e.substring(r[0].length),o+=this.renderer.em(this.output(r[2]||r[1]));else if(r=this.rules.code.exec(e))e=e.substring(r[0].length),o+=this.renderer.codespan(s(r[2],!0));else if(r=this.rules.br.exec(e))e=e.substring(r[0].length),o+=this.renderer.br();else if(r=this.rules.del.exec(e))e=e.substring(r[0].length),o+=this.renderer.del(this.output(r[1]));else if(r=this.rules.text.exec(e))e=e.substring(r[0].length),o+=this.renderer.text(s(this.smartypants(r[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else e=e.substring(r[0].length),i=n=s(r[1]),o+=this.renderer.link(i,null,n);return o},n.prototype.outputLink=function(e,t){var n=s(t.href),i=t.title?s(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(n,i,this.output(e[1])):this.renderer.image(n,i,s(e[1]))},n.prototype.smartypants=function(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e},n.prototype.mangle=function(e){if(!this.options.mangle)return e;for(var t,n="",i=e.length,r=0;r<i;r++)t=e.charCodeAt(r),Math.random()>.5&&(t="x"+t.toString(16)),n+="&#"+t+";";return n},i.prototype.code=function(e,t,n){if(this.options.highlight){var i=this.options.highlight(e,t);null!=i&&i!==e&&(n=!0,e=i)}return t?'<pre><code class="'+this.options.langPrefix+s(t,!0)+'">'+(n?e:s(e,!0))+"\n</code></pre>\n":"<pre><code>"+(n?e:s(e,!0))+"\n</code></pre>"},i.prototype.blockquote=function(e){return"<blockquote>\n"+e+"</blockquote>\n"},i.prototype.html=function(e){return e},i.prototype.heading=function(e,t,n){return"<h"+t+' id="'+this.options.headerPrefix+n.toLowerCase().replace(/[^\w]+/g,"-")+'">'+e+"</h"+t+">\n"},i.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},i.prototype.list=function(e,t){var n=t?"ol":"ul";return"<"+n+">\n"+e+"</"+n+">\n"},i.prototype.listitem=function(e){return"<li>"+e+"</li>\n"},i.prototype.paragraph=function(e){return"<p>"+e+"</p>\n"},i.prototype.table=function(e,t){return"<table>\n<thead>\n"+e+"</thead>\n<tbody>\n"+t+"</tbody>\n</table>\n"},i.prototype.tablerow=function(e){return"<tr>\n"+e+"</tr>\n"},i.prototype.tablecell=function(e,t){var n=t.header?"th":"td";return(t.align?"<"+n+' style="text-align:'+t.align+'">':"<"+n+">")+e+"</"+n+">\n"},i.prototype.strong=function(e){return"<strong>"+e+"</strong>"},i.prototype.em=function(e){return"<em>"+e+"</em>"},i.prototype.codespan=function(e){return"<code>"+e+"</code>"},i.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},i.prototype.del=function(e){return"<del>"+e+"</del>"},i.prototype.link=function(e,t,n){if(this.options.sanitize){try{var i=decodeURIComponent(o(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(0===i.indexOf("javascript:")||0===i.indexOf("vbscript:"))return""}var r='<a href="'+e+'"';return t&&(r+=' title="'+t+'"'),r+=">"+n+"</a>"},i.prototype.image=function(e,t,n){var i='<img src="'+e+'" alt="'+n+'"';return t&&(i+=' title="'+t+'"'),i+=this.options.xhtml?"/>":">"},i.prototype.text=function(e){return e},r.parse=function(e,t,n){return new r(t,n).parse(e)},r.prototype.parse=function(e){this.inline=new n(e.links,this.options,this.renderer),this.tokens=e.reverse();for(var t="";this.next();)t+=this.tok();return t},r.prototype.next=function(){return this.token=this.tokens.pop()},r.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},r.prototype.parseText=function(){for(var e=this.token.text;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)},r.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":var e,t,n,i,r="",s="";for(n="",e=0;e<this.token.header.length;e++)({header:!0,align:this.token.align[e]}),n+=this.renderer.tablecell(this.inline.output(this.token.header[e]),{header:!0,align:this.token.align[e]});for(r+=this.renderer.tablerow(n),e=0;e<this.token.cells.length;e++){for(t=this.token.cells[e],n="",i=0;i<t.length;i++)n+=this.renderer.tablecell(this.inline.output(t[i]),{header:!1,align:this.token.align[i]});s+=this.renderer.tablerow(n)}return this.renderer.table(r,s);case"blockquote_start":for(s="";"blockquote_end"!==this.next().type;)s+=this.tok();return this.renderer.blockquote(s);case"list_start":for(var s="",o=this.token.ordered;"list_end"!==this.next().type;)s+=this.tok();return this.renderer.list(s,o);case"list_item_start":for(s="";"list_item_end"!==this.next().type;)s+="text"===this.token.type?this.parseText():this.tok();return this.renderer.listitem(s);case"loose_item_start":for(s="";"list_item_end"!==this.next().type;)s+=this.tok();return this.renderer.listitem(s);case"html":var l=this.token.pre||this.options.pedantic?this.token.text:this.inline.output(this.token.text);return this.renderer.html(l);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}},a.exec=a,c.options=c.setOptions=function(e){return u(c.defaults,e),c},c.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,sanitizer:null,mangle:!0,smartLists:!1,silent:!1,highlight:null,langPrefix:"lang-",smartypants:!1,headerPrefix:"",renderer:new i,xhtml:!1},c.Parser=r,c.parser=r.parse,c.Renderer=i,c.Lexer=t,c.lexer=t.lex,c.InlineLexer=n,c.inlineLexer=n.output,c.parse=c,e.exports=c}).call(function(){return this||("undefined"!=typeof window?window:f)}())}),k="gus.lightning.force",y="/apex/ADM_WorkManager",b="bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body",x="div.slds-col.slds-col--padded.slds-p-bottom--medium.slds-size--1-of-1.slds-medium-size--1-of-1.slds-large-size--1-of-1",w={classes:{mdPreview:"bugedit-lightning-mdpreview",titleDiv:"bugedit-lightning-titlediv",title:"slds-form-element__label"}},v="userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer",_={classes:{mdPreview:"userstoryedit-lightning-mdpreview",titleDiv:"userstoryedit-lightning-titlediv",title:"slds-form-element__label"}},S="/apex/adm_bugedit",E="bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body",L="richDetailsWrapper",I={classes:{mdPreview:"inlineEditWrite bugedit-classic-mdpreview",titleDiv:"gusFormFieldLeft bugedit-classic-titlediv",title:""}},q="/apex/adm_userstoryedit",$="userStoryWorkPage:storyWorkForm:detailsInput:formRow:input",C={classes:{mdPreview:"userstoryedit-classic-mdpreview",titleDiv:"gusFormFieldLeft userstoryedit-classic-titlediv",title:""}},M="/apex/adm_userstorydetail",O="userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner",A="/apex/adm_bugdetail",T="bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div",D=!1;window.gusMarkdownRun=!0;var P="",R={};window.chrome.runtime.onMessage.addListener(function(e,n,i){var r={received:!0};e.originalHTML&&(R[location.href]=e.originalHTML),e.changeRun&&(t(),window.gusMarkdownRun=!window.gusMarkdownRun,p()),e.init&&(console.log("received init message"),t(),window.gusMarkdownRun=!0,p()),r.runState=window.gusMarkdownRun,i(r)}),t(),p()}();
