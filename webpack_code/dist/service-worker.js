if(!self.define){let i,e={};const t=(t,n)=>(t=new URL(t+".js",n).href,e[t]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=t,i.onload=e,document.head.appendChild(i)}else i=t,importScripts(t),e()})).then((()=>{let i=e[t];if(!i)throw new Error(`Module ${t} didn’t register its module`);return i})));self.define=(n,s)=>{const l=i||("document"in self?document.currentScript.src:"")||location.href;if(e[l])return;let r={};const c=i=>t(i,l),o={module:{uri:l},exports:r,require:c};e[l]=Promise.all(n.map((i=>o[i]||c(i)))).then((i=>(s(...i),r)))}}define(["./workbox-460519b3"],(function(i){"use strict";self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"index.html",revision:"63cb7c8ec8f8973f4c700cdab831ca97"},{url:"static/css/main.c9997b0.css",revision:null},{url:"static/js/main.83ccaf4.js",revision:null},{url:"static/js/math.chunk8997b95.js",revision:null},{url:"static/js/runtime~main.js.76e402c.js",revision:null},{url:"static/media/iconfont.36f2a4e.woff?t=1666494725937",revision:null},{url:"static/media/iconfont.97f2ca8.woff2?t=1666494725937",revision:null},{url:"static/media/iconfont.b90edb2.ttf?t=1666494725937",revision:null},{url:"static/media/img_2.ef58669.jpg",revision:null},{url:"static/media/img_3.ec9f840.png",revision:null}],{})}));
//# sourceMappingURL=service-worker.js.map