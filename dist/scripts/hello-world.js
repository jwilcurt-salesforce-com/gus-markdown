var bod = document.getElementsByTagName('body');
console.log(bod);
var helloEl = document.createElement("div");
helloEl.innerHTML = "Hello World";
bod[0].appendChild(helloEl);
