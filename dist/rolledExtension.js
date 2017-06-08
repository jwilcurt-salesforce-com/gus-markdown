!function(){"use strict";function e(e){return e=e.split("\n<br>").join("\n"),e=e.split("<br>").join("\n"),e=e.replace(/\n\s?\d\)\s/g,"\n1. "),e=e.replace(/((\b[ ]*)\n(?=\S|\s))/g,"  \n"),e=e.replace(/(\b[^a-zA-Z0-9 \n]+[ ]*)\n(?=\S|\s)/g,function(e,t){return void 0!==t?t+"  \n":e}),e=e.replace(/\nselect \* from([^\n]|\n(?!\n))*/g,"```$&\n```  \n---"),e=e.replace(/\nRequest URL:([^\n]|\n(?!\n))*/g,"```$&\n```  \n---"),e=e.replace(/\\_/g,"\\\\_"),e=e.replace(/_/g,"\\_"),h(e)}function t(t){var n=document.getElementById(t),i="";n&&(i=p=n.innerHTML),i.length>0&&(n.innerHTML=e(i))}function n(t){var n=t.target.value||t.target.innerText;t.target.prev.innerHTML=e(n)}function i(e,t){var i,r,s,o=document.querySelector("#title-div"),l=document.querySelector("#markdown-preview"),a=document.querySelector("#markdown-preview-title");o?(i=o).style.display="block":((i=document.createElement("div")).id="title-div",i.className="gusFormFieldLeft",i.style="padding: 0px;text-align: left;margin: 8px 0px;"),l?(r=l).style.display="block":((r=document.createElement("div")).id="markdown-preview",r.className="inlineEditWrite",r.style="background: #FFF;border: 1px solid #CCC;border-radius: 4px;padding: 0px 6px;margin-top: 5px;height: 160px;overflow: auto;line-height: 20px;"),a?(s=a).style.display="block":((s=document.createElement("label")).id="markdown-preview-title",s.innerHTML="Markdown Preview",i.appendChild(s),t.appendChild(i),t.appendChild(r),e.prev=r,e.addEventListener("keydown",n),e.style.height="160px");var u=new CustomEvent("keydown");e.dispatchEvent(u)}function r(e){document.getElementById(e).innerHTML=p}function s(e){e.removeEventListener("keydown",n),document.querySelector("#title-div").style.display="none",document.querySelector("#markdown-preview").style.display="none",document.querySelector("#markdown-preview-title").style.display="none"}function o(e){e.focus(),e.select();var t=document.createEvent("KeyboardEvent");t[void 0!==t.initKeyboardEvent?"initKeyboardEvent":"initKeyEvent"]("keydown",!0,!0,window,!1,!1,!1,!1,40,0),e.dispatchEvent(t)}function l(e,t){if(void 0===t)t=document.querySelectorAll("iframe")[1],setTimeout(l,250);else{t=t.contentWindow.document.getElementById("bugWorkPage:bugWorkForm:richDetailsInput:textAreaDelegate_Details_and_Steps_to_Reproduce__c_rta_body");var n=document.getElementById("richDetailsWrapper");e?i(t,n):s(t)}}function a(){var e,n;if(location.href.indexOf("/apex/adm_bugedit")>-1&&location.href.indexOf("gus.lightning.force")>-1)console.log("bugedit lightning"),n=(e=document.getElementById("bugEdit:j_id0:workSds:storyWorkForm:dstpInput:inputComponent:inputFieldWithContainer:textAreaDelegate_Details_And_Steps_To_Reproduce__c_rta_body")).parentElement,window.run?i(e,n):s(e);else if(location.href.indexOf("/apex/adm_bugedit")>-1&&-1==location.href.indexOf("gus.lightning.force"))console.log("bugedit classic"),l(e=document.querySelectorAll("iframe")[1]);else if(location.href.indexOf("/apex/ADM_WorkManager")>-1&&-1==location.href.indexOf("gus.lightning.force")){if(console.log("bugedit classic preview"),setTimeout(function(){},200),null!=(e=document.getElementById("descriptionInput"))){n=e.parentElement,i(e,n);var a=document.getElementById("workSaveButton"),u=document.getElementById("workCancelButton");u.addEventListener&&u.addEventListener("click",function(){o(e)},!1),a.addEventListener&&a.addEventListener("click",function(){o(e)},!1)}}else location.href.indexOf("/apex/adm_userstoryedit")>-1&&location.href.indexOf("gus.lightning.force")>-1?(console.log("userstoryedit lightning"),n=(e=document.getElementById("userStoryEdit:j_id0:workSds:storyWorkForm:descriptionInput:inputComponent:inputFieldWithContainer")).parentElement,window.run?i(e,n):s(e)):location.href.indexOf("/apex/adm_userstoryedit")>-1&&-1==location.href.indexOf("gus.lightning.force")?(console.log("userstoryedit classic"),n=(e=document.getElementById("userStoryWorkPage:storyWorkForm:detailsInput:formRow:input")).parentElement,window.run?i(e,n):s(e)):location.href.indexOf("/apex/adm_userstorydetail")>-1&&location.href.indexOf("gus.lightning.force")>-1?(console.log("userstorydetail lightning"),window.run?t("userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner"):r("userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner")):location.href.indexOf("/apex/adm_userstorydetail")>-1&&-1==location.href.indexOf("gus.lightning.force")?(console.log("userstorydetail classic"),window.run?t("userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner"):r("userStoryDetailPage_userStoryWorkForm_detailsInput_inputComponent_outputStandalone_ileinner")):location.href.indexOf("/apex/adm_bugdetail")>-1&&location.href.indexOf("gus.lightning.force")>-1?(console.log("bugdetail lightning"),window.run?t("bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div"):r("bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div")):location.href.indexOf("/apex/adm_bugdetail")>-1&&-1==location.href.indexOf("gus.lightning.force")?(console.log("bugdetail classic"),window.run?t("bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div"):r("bugDetailPage:bugWorkForm:j_id89bugDetailPage:bugWorkForm:j_id89_00NB0000000FiIs_div")):(window.run=!1,console.log("not found"))}var u="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},h=function(e,t){return t={exports:{}},e(t,t.exports),t.exports}(function(e,t){(function(){function t(e){this.tokens=[],this.tokens.links={},this.options=e||h.defaults,this.rules=p.normal,this.options.gfm&&(this.options.tables?this.rules=p.tables:this.rules=p.gfm)}function n(e,t){if(this.options=t||h.defaults,this.links=e,this.rules=c.normal,this.renderer=this.options.renderer||new i,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.gfm?this.options.breaks?this.rules=c.breaks:this.rules=c.gfm:this.options.pedantic&&(this.rules=c.pedantic)}function i(e){this.options=e||{}}function r(e){this.tokens=[],this.token=null,this.options=e||h.defaults,this.options.renderer=this.options.renderer||new i,this.renderer=this.options.renderer,this.renderer.options=this.options}function s(e,t){return e.replace(t?/&/g:/&(?!#?\w+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function o(e){return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g,function(e,t){return t=t.toLowerCase(),"colon"===t?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""})}function l(e,t){return e=e.source,t=t||"",function n(i,r){return i?(r=r.source||r,r=r.replace(/(^|[^\[])\^/g,"$1"),e=e.replace(i,r),n):new RegExp(e,t)}}function a(){}function u(e){for(var t,n,i=1;i<arguments.length;i++){t=arguments[i];for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])}return e}function h(e,n,i){if(i||"function"==typeof n){i||(i=n,n=null);var o,l,a=(n=u({},h.defaults,n||{})).highlight,p=0;try{o=t.lex(e,n)}catch(e){return i(e)}l=o.length;var c=function(e){if(e)return n.highlight=a,i(e);var t;try{t=r.parse(o,n)}catch(t){e=t}return n.highlight=a,e?i(e):i(null,t)};if(!a||a.length<3)return c();if(delete n.highlight,!l)return c();for(;p<o.length;p++)!function(e){"code"!==e.type?--l||c():a(e.text,e.lang,function(t,n){return t?c(t):null==n||n===e.text?--l||c():(e.text=n,e.escaped=!0,void(--l||c()))})}(o[p])}else try{return n&&(n=u({},h.defaults,n)),r.parse(t.lex(e,n),n)}catch(e){if(e.message+="\nPlease report this to https://github.com/chjj/marked.",(n||h.defaults).silent)return"<p>An error occured:</p><pre>"+s(e.message+"",!0)+"</pre>";throw e}}var p={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:a,hr:/^( *[-*_]){3,} *(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,nptable:a,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,blockquote:/^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:/^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,table:a,paragraph:/^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,text:/^[^\n]+/};p.bullet=/(?:[*+-]|\d+\.)/,p.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,p.item=l(p.item,"gm")(/bull/g,p.bullet)(),p.list=l(p.list)(/bull/g,p.bullet)("hr","\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def","\\n+(?="+p.def.source+")")(),p.blockquote=l(p.blockquote)("def",p.def)(),p._tag="(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b",p.html=l(p.html)("comment",/<!--[\s\S]*?-->/)("closed",/<(tag)[\s\S]+?<\/\1>/)("closing",/<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g,p._tag)(),p.paragraph=l(p.paragraph)("hr",p.hr)("heading",p.heading)("lheading",p.lheading)("blockquote",p.blockquote)("tag","<"+p._tag)("def",p.def)(),p.normal=u({},p),p.gfm=u({},p.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/}),p.gfm.paragraph=l(p.paragraph)("(?!","(?!"+p.gfm.fences.source.replace("\\1","\\2")+"|"+p.list.source.replace("\\1","\\3")+"|")(),p.tables=u({},p.gfm,{nptable:/^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,table:/^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/}),t.rules=p,t.lex=function(e,n){return new t(n).lex(e)},t.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},t.prototype.token=function(e,t,n){for(var i,r,s,o,l,a,u,h,c,e=e.replace(/^ +$/gm,"");e;)if((s=this.rules.newline.exec(e))&&(e=e.substring(s[0].length),s[0].length>1&&this.tokens.push({type:"space"})),s=this.rules.code.exec(e))e=e.substring(s[0].length),s=s[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?s:s.replace(/\n+$/,"")});else if(s=this.rules.fences.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"code",lang:s[2],text:s[3]||""});else if(s=this.rules.heading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:s[1].length,text:s[2]});else if(t&&(s=this.rules.nptable.exec(e))){for(e=e.substring(s[0].length),a={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/\n$/,"").split("\n")},h=0;h<a.align.length;h++)/^ *-+: *$/.test(a.align[h])?a.align[h]="right":/^ *:-+: *$/.test(a.align[h])?a.align[h]="center":/^ *:-+ *$/.test(a.align[h])?a.align[h]="left":a.align[h]=null;for(h=0;h<a.cells.length;h++)a.cells[h]=a.cells[h].split(/ *\| */);this.tokens.push(a)}else if(s=this.rules.lheading.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"heading",depth:"="===s[2]?1:2,text:s[1]});else if(s=this.rules.hr.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"hr"});else if(s=this.rules.blockquote.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"blockquote_start"}),s=s[0].replace(/^ *> ?/gm,""),this.token(s,t,!0),this.tokens.push({type:"blockquote_end"});else if(s=this.rules.list.exec(e)){for(e=e.substring(s[0].length),o=s[2],this.tokens.push({type:"list_start",ordered:o.length>1}),i=!1,c=(s=s[0].match(this.rules.item)).length,h=0;h<c;h++)u=(a=s[h]).length,~(a=a.replace(/^ *([*+-]|\d+\.) +/,"")).indexOf("\n ")&&(u-=a.length,a=this.options.pedantic?a.replace(/^ {1,4}/gm,""):a.replace(new RegExp("^ {1,"+u+"}","gm"),"")),this.options.smartLists&&h!==c-1&&(o===(l=p.bullet.exec(s[h+1])[0])||o.length>1&&l.length>1||(e=s.slice(h+1).join("\n")+e,h=c-1)),r=i||/\n\n(?!\s*$)/.test(a),h!==c-1&&(i="\n"===a.charAt(a.length-1),r||(r=i)),this.tokens.push({type:r?"loose_item_start":"list_item_start"}),this.token(a,!1,n),this.tokens.push({type:"list_item_end"});this.tokens.push({type:"list_end"})}else if(s=this.rules.html.exec(e))e=e.substring(s[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===s[1]||"script"===s[1]||"style"===s[1]),text:s[0]});else if(!n&&t&&(s=this.rules.def.exec(e)))e=e.substring(s[0].length),this.tokens.links[s[1].toLowerCase()]={href:s[2],title:s[3]};else if(t&&(s=this.rules.table.exec(e))){for(e=e.substring(s[0].length),a={type:"table",header:s[1].replace(/^ *| *\| *$/g,"").split(/ *\| */),align:s[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:s[3].replace(/(?: *\| *)?\n$/,"").split("\n")},h=0;h<a.align.length;h++)/^ *-+: *$/.test(a.align[h])?a.align[h]="right":/^ *:-+: *$/.test(a.align[h])?a.align[h]="center":/^ *:-+ *$/.test(a.align[h])?a.align[h]="left":a.align[h]=null;for(h=0;h<a.cells.length;h++)a.cells[h]=a.cells[h].replace(/^ *\| *| *\| *$/g,"").split(/ *\| */);this.tokens.push(a)}else if(t&&(s=this.rules.paragraph.exec(e)))e=e.substring(s[0].length),this.tokens.push({type:"paragraph",text:"\n"===s[1].charAt(s[1].length-1)?s[1].slice(0,-1):s[1]});else if(s=this.rules.text.exec(e))e=e.substring(s[0].length),this.tokens.push({type:"text",text:s[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens};var c={escape:/^\\([\\`*{}\[\]()#+\-.!_>])/,autolink:/^<([^ >]+(@|:\/)[^ >]+)>/,url:a,tag:/^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,link:/^!?\[(inside)\]\(href\)/,reflink:/^!?\[(inside)\]\s*\[([^\]]*)\]/,nolink:/^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,strong:/^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,em:/^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,code:/^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,br:/^ {2,}\n(?!\s*$)/,del:a,text:/^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/};c._inside=/(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/,c._href=/\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/,c.link=l(c.link)("inside",c._inside)("href",c._href)(),c.reflink=l(c.reflink)("inside",c._inside)(),c.normal=u({},c),c.pedantic=u({},c.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/}),c.gfm=u({},c.normal,{escape:l(c.escape)("])","~|])")(),url:/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,del:/^~~(?=\S)([\s\S]*?\S)~~/,text:l(c.text)("]|","~]|")("|","|https?://|")()}),c.breaks=u({},c.gfm,{br:l(c.br)("{2,}","*")(),text:l(c.gfm.text)("{2,}","*")()}),n.rules=c,n.output=function(e,t,i){return new n(t,i).output(e)},n.prototype.output=function(e){for(var t,n,i,r,o="";e;)if(r=this.rules.escape.exec(e))e=e.substring(r[0].length),o+=r[1];else if(r=this.rules.autolink.exec(e))e=e.substring(r[0].length),"@"===r[2]?(n=":"===r[1].charAt(6)?this.mangle(r[1].substring(7)):this.mangle(r[1]),i=this.mangle("mailto:")+n):i=n=s(r[1]),o+=this.renderer.link(i,null,n);else if(this.inLink||!(r=this.rules.url.exec(e))){if(r=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(r[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(r[0])&&(this.inLink=!1),e=e.substring(r[0].length),o+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(r[0]):s(r[0]):r[0];else if(r=this.rules.link.exec(e))e=e.substring(r[0].length),this.inLink=!0,o+=this.outputLink(r,{href:r[2],title:r[3]}),this.inLink=!1;else if((r=this.rules.reflink.exec(e))||(r=this.rules.nolink.exec(e))){if(e=e.substring(r[0].length),t=(r[2]||r[1]).replace(/\s+/g," "),!(t=this.links[t.toLowerCase()])||!t.href){o+=r[0].charAt(0),e=r[0].substring(1)+e;continue}this.inLink=!0,o+=this.outputLink(r,t),this.inLink=!1}else if(r=this.rules.strong.exec(e))e=e.substring(r[0].length),o+=this.renderer.strong(this.output(r[2]||r[1]));else if(r=this.rules.em.exec(e))e=e.substring(r[0].length),o+=this.renderer.em(this.output(r[2]||r[1]));else if(r=this.rules.code.exec(e))e=e.substring(r[0].length),o+=this.renderer.codespan(s(r[2],!0));else if(r=this.rules.br.exec(e))e=e.substring(r[0].length),o+=this.renderer.br();else if(r=this.rules.del.exec(e))e=e.substring(r[0].length),o+=this.renderer.del(this.output(r[1]));else if(r=this.rules.text.exec(e))e=e.substring(r[0].length),o+=this.renderer.text(s(this.smartypants(r[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else e=e.substring(r[0].length),i=n=s(r[1]),o+=this.renderer.link(i,null,n);return o},n.prototype.outputLink=function(e,t){var n=s(t.href),i=t.title?s(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(n,i,this.output(e[1])):this.renderer.image(n,i,s(e[1]))},n.prototype.smartypants=function(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e},n.prototype.mangle=function(e){if(!this.options.mangle)return e;for(var t,n="",i=e.length,r=0;r<i;r++)t=e.charCodeAt(r),Math.random()>.5&&(t="x"+t.toString(16)),n+="&#"+t+";";return n},i.prototype.code=function(e,t,n){if(this.options.highlight){var i=this.options.highlight(e,t);null!=i&&i!==e&&(n=!0,e=i)}return t?'<pre><code class="'+this.options.langPrefix+s(t,!0)+'">'+(n?e:s(e,!0))+"\n</code></pre>\n":"<pre><code>"+(n?e:s(e,!0))+"\n</code></pre>"},i.prototype.blockquote=function(e){return"<blockquote>\n"+e+"</blockquote>\n"},i.prototype.html=function(e){return e},i.prototype.heading=function(e,t,n){return"<h"+t+' id="'+this.options.headerPrefix+n.toLowerCase().replace(/[^\w]+/g,"-")+'">'+e+"</h"+t+">\n"},i.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},i.prototype.list=function(e,t){var n=t?"ol":"ul";return"<"+n+">\n"+e+"</"+n+">\n"},i.prototype.listitem=function(e){return"<li>"+e+"</li>\n"},i.prototype.paragraph=function(e){return"<p>"+e+"</p>\n"},i.prototype.table=function(e,t){return"<table>\n<thead>\n"+e+"</thead>\n<tbody>\n"+t+"</tbody>\n</table>\n"},i.prototype.tablerow=function(e){return"<tr>\n"+e+"</tr>\n"},i.prototype.tablecell=function(e,t){var n=t.header?"th":"td";return(t.align?"<"+n+' style="text-align:'+t.align+'">':"<"+n+">")+e+"</"+n+">\n"},i.prototype.strong=function(e){return"<strong>"+e+"</strong>"},i.prototype.em=function(e){return"<em>"+e+"</em>"},i.prototype.codespan=function(e){return"<code>"+e+"</code>"},i.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},i.prototype.del=function(e){return"<del>"+e+"</del>"},i.prototype.link=function(e,t,n){if(this.options.sanitize){try{var i=decodeURIComponent(o(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return""}if(0===i.indexOf("javascript:")||0===i.indexOf("vbscript:"))return""}var r='<a href="'+e+'"';return t&&(r+=' title="'+t+'"'),r+=">"+n+"</a>"},i.prototype.image=function(e,t,n){var i='<img src="'+e+'" alt="'+n+'"';return t&&(i+=' title="'+t+'"'),i+=this.options.xhtml?"/>":">"},i.prototype.text=function(e){return e},r.parse=function(e,t,n){return new r(t,n).parse(e)},r.prototype.parse=function(e){this.inline=new n(e.links,this.options,this.renderer),this.tokens=e.reverse();for(var t="";this.next();)t+=this.tok();return t},r.prototype.next=function(){return this.token=this.tokens.pop()},r.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},r.prototype.parseText=function(){for(var e=this.token.text;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)},r.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,this.token.text);case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":var e,t,n,i,r="",s="";for(n="",e=0;e<this.token.header.length;e++)({header:!0,align:this.token.align[e]}),n+=this.renderer.tablecell(this.inline.output(this.token.header[e]),{header:!0,align:this.token.align[e]});for(r+=this.renderer.tablerow(n),e=0;e<this.token.cells.length;e++){for(t=this.token.cells[e],n="",i=0;i<t.length;i++)n+=this.renderer.tablecell(this.inline.output(t[i]),{header:!1,align:this.token.align[i]});s+=this.renderer.tablerow(n)}return this.renderer.table(r,s);case"blockquote_start":for(s="";"blockquote_end"!==this.next().type;)s+=this.tok();return this.renderer.blockquote(s);case"list_start":for(var s="",o=this.token.ordered;"list_end"!==this.next().type;)s+=this.tok();return this.renderer.list(s,o);case"list_item_start":for(s="";"list_item_end"!==this.next().type;)s+="text"===this.token.type?this.parseText():this.tok();return this.renderer.listitem(s);case"loose_item_start":for(s="";"list_item_end"!==this.next().type;)s+=this.tok();return this.renderer.listitem(s);case"html":var l=this.token.pre||this.options.pedantic?this.token.text:this.inline.output(this.token.text);return this.renderer.html(l);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}},a.exec=a,h.options=h.setOptions=function(e){return u(h.defaults,e),h},h.defaults={gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,sanitizer:null,mangle:!0,smartLists:!1,silent:!1,highlight:null,langPrefix:"lang-",smartypants:!1,headerPrefix:"",renderer:new i,xhtml:!1},h.Parser=r,h.parser=r.parse,h.Renderer=i,h.Lexer=t,h.lexer=t.lex,h.InlineLexer=n,h.inlineLexer=n.output,h.parse=h,e.exports=h}).call(function(){return this||("undefined"!=typeof window?window:u)}())});window.run=!0;var p;window.chrome.runtime.onMessage.addListener(function(e,t,n){var i={received:!0};e.changeRun&&(window.run=!window.run,a()),i.runState=window.run,n(i)}),a()}();
