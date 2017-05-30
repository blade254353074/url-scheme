!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.UrlScheme=t():e.UrlScheme=t()}(this,function(){return function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.i=function(e){return e},t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,r){"use strict";var n=String.prototype.replace,o=/%20/g;e.exports={default:"RFC3986",formatters:{RFC1738:function(e){return n.call(e,o,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"}},function(e,t,r){"use strict";var n=Object.prototype.hasOwnProperty,o=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}();t.arrayToObject=function(e,t){for(var r=t&&t.plainObjects?Object.create(null):{},n=0;n<e.length;++n)void 0!==e[n]&&(r[n]=e[n]);return r},t.merge=function(e,r,o){if(!r)return e;if("object"!=typeof r){if(Array.isArray(e))e.push(r);else{if("object"!=typeof e)return[e,r];(o.plainObjects||o.allowPrototypes||!n.call(Object.prototype,r))&&(e[r]=!0)}return e}if("object"!=typeof e)return[e].concat(r);var i=e;return Array.isArray(e)&&!Array.isArray(r)&&(i=t.arrayToObject(e,o)),Array.isArray(e)&&Array.isArray(r)?(r.forEach(function(r,i){n.call(e,i)?e[i]&&"object"==typeof e[i]?e[i]=t.merge(e[i],r,o):e.push(r):e[i]=r}),e):Object.keys(r).reduce(function(e,n){var i=r[n];return Object.prototype.hasOwnProperty.call(e,n)?e[n]=t.merge(e[n],i,o):e[n]=i,e},i)},t.decode=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(t){return e}},t.encode=function(e){if(0===e.length)return e;for(var t="string"==typeof e?e:String(e),r="",n=0;n<t.length;++n){var i=t.charCodeAt(n);45===i||46===i||95===i||126===i||i>=48&&i<=57||i>=65&&i<=90||i>=97&&i<=122?r+=t.charAt(n):i<128?r+=o[i]:i<2048?r+=o[192|i>>6]+o[128|63&i]:i<55296||i>=57344?r+=o[224|i>>12]+o[128|i>>6&63]+o[128|63&i]:(n+=1,i=65536+((1023&i)<<10|1023&t.charCodeAt(n)),r+=o[240|i>>18]+o[128|i>>12&63]+o[128|i>>6&63]+o[128|63&i])}return r},t.compact=function(e,r){if("object"!=typeof e||null===e)return e;var n=r||[],o=n.indexOf(e);if(-1!==o)return n[o];if(n.push(e),Array.isArray(e)){for(var i=[],a=0;a<e.length;++a)e[a]&&"object"==typeof e[a]?i.push(t.compact(e[a],n)):void 0!==e[a]&&i.push(e[a]);return i}return Object.keys(e).forEach(function(r){e[r]=t.compact(e[r],n)}),e},t.isRegExp=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},t.isBuffer=function(e){return null!==e&&void 0!==e&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))}},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(){}function a(e){return e=Number(e),!isNaN(e)&&e>=0}Object.defineProperty(t,"__esModule",{value:!0}),t.CancelToken=void 0;var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},u=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),l=r(6),s=n(l),f=r(5),p=n(f),d=6e4,y=+new Date,m=function(){function e(t){var r=this,n=t.url,u=t.query,l=t.cancelToken,f=t.name,p=t.timeout,d=t.beforeSend,m=t.param,b=void 0===m?"callback":m,h=t.prefix,v=void 0===h?"__jsonp":h;if(o(this,e),this.cleanup=function(e){var t=r.timer,n=r.jsonpId;window[n]=i,t&&clearTimeout(t)},"string"!=typeof n)throw new TypeError("url must be a string.");if(!n)throw new Error("url cannot be empty string.");if(null!=u&&"object"!==(void 0===u?"undefined":c(u)))throw new TypeError("query must be an object.");if(d&&"function"!=typeof d)throw new TypeError("beforeSend must be a function.");var g=e.defaults,w=n.indexOf(":")>0,j=null!=g.scheme;if(!w&&!j)throw new Error("scheme in url parameter or UrlScheme.defaults.scheme is required.");var O=w?n.split(":")[0]:g.scheme;O=(""+O).toLowerCase();var A=n.indexOf("?"),x=A>-1;u=x?Object.assign(s.default.parse(n.substring(A+1)),u):u||{},b in u&&console.warn("Param `"+b+"` override the same key in search query."),this.jsonpId=u[b]=f||""+v+y++;var k=s.default.stringify(u);return this.timeout=a(p)?p:g.timeout,this.schemeUrl=w?x?""+O+n.slice(O.length,A+1)+k:""+O+n.slice(O.length)+"?"+k:O+"://"+n.slice(0,A+1)+k,this.init({beforeSend:d,cancelToken:l,timeout:this.timeout})}return u(e,null,[{key:"isCancel",value:function(e){return!(!e||!e.__CANCEL__)}}]),u(e,[{key:"init",value:function(e){var t=this,r=e.beforeSend,n=e.cancelToken,o=e.timeout,i=this.jsonpId,a=this.schemeUrl,c=this.cleanup;return new Promise(function(e,u){n&&n.promise.then(function(e){c(),u(e)}),o>0&&(t.timer=setTimeout(function(){var e=new Error("URL Scheme request timeout.");e.type="timeout",c(),u(e)},o)),window[i]=function(t){if(c(),null==t)return e();if("string"==typeof t)try{e(JSON.parse(t))}catch(r){e(t)}else e(t)},"function"==typeof r&&r({schemeUrl:a,jsonpId:i}),t.request(a)})}},{key:"request",value:function(e){var t=document.createElement("iframe");t.setAttribute("style","display:none"),t.setAttribute("width","0"),t.setAttribute("height","0"),t.setAttribute("tabindex","-1"),t.setAttribute("src",e),document.documentElement.appendChild(t),t.parentNode.removeChild(t),t=null}}]),e}();m.defaults={scheme:null,get timeout(){return d},set timeout(e){if(!a(e))throw new TypeError("timeout must be a positive number.");d=e}},m.interceptors={},m.CancelToken=p.default,t.CancelToken=p.default,t.default=m},function(e,t,r){"use strict";var n=r(2),o=function(e){return e&&e.__esModule?e:{default:e}}(n);e.exports=o.default},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=function(){function e(t){n(this,e),this.__CANCEL__=!0,this.message=t}return o(e,[{key:"toString",value:function(){return"Cancel"+(this.message?": "+this.message:"")}}]),e}();t.default=i},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),i=r(4),a=function(e){return e&&e.__esModule?e:{default:e}}(i),c=function(){function e(t){if(n(this,e),"function"!=typeof t)throw new TypeError("executor must be a function.");var r=void 0;this.promise=new Promise(function(e){r=e});var o=this;t(function(e){o.reason||(o.reason=new a.default(e),r(o.reason))})}return o(e,null,[{key:"source",value:function(){var t=void 0;return{token:new e(function(e){t=e}),cancel:t}}}]),e}();t.default=c},function(e,t,r){"use strict";var n=r(8),o=r(7),i=r(0);e.exports={formats:i,parse:o,stringify:n}},function(e,t,r){"use strict";var n=r(1),o=Object.prototype.hasOwnProperty,i={allowDots:!1,allowPrototypes:!1,arrayLimit:20,decoder:n.decode,delimiter:"&",depth:5,parameterLimit:1e3,plainObjects:!1,strictNullHandling:!1},a=function(e,t){for(var r={},n=e.split(t.delimiter,t.parameterLimit===1/0?void 0:t.parameterLimit),i=0;i<n.length;++i){var a,c,u=n[i],l=-1===u.indexOf("]=")?u.indexOf("="):u.indexOf("]=")+1;-1===l?(a=t.decoder(u),c=t.strictNullHandling?null:""):(a=t.decoder(u.slice(0,l)),c=t.decoder(u.slice(l+1))),o.call(r,a)?r[a]=[].concat(r[a]).concat(c):r[a]=c}return r},c=function(e,t,r){if(!e.length)return t;var n,o=e.shift();if("[]"===o)n=[],n=n.concat(c(e,t,r));else{n=r.plainObjects?Object.create(null):{};var i="["===o.charAt(0)&&"]"===o.charAt(o.length-1)?o.slice(1,-1):o,a=parseInt(i,10);!isNaN(a)&&o!==i&&String(a)===i&&a>=0&&r.parseArrays&&a<=r.arrayLimit?(n=[],n[a]=c(e,t,r)):n[i]=c(e,t,r)}return n},u=function(e,t,r){if(e){var n=r.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,i=/(\[[^[\]]*])/,a=/(\[[^[\]]*])/g,u=i.exec(n),l=u?n.slice(0,u.index):n,s=[];if(l){if(!r.plainObjects&&o.call(Object.prototype,l)&&!r.allowPrototypes)return;s.push(l)}for(var f=0;null!==(u=a.exec(n))&&f<r.depth;){if(f+=1,!r.plainObjects&&o.call(Object.prototype,u[1].slice(1,-1))&&!r.allowPrototypes)return;s.push(u[1])}return u&&s.push("["+n.slice(u.index)+"]"),c(s,t,r)}};e.exports=function(e,t){var r=t||{};if(null!==r.decoder&&void 0!==r.decoder&&"function"!=typeof r.decoder)throw new TypeError("Decoder has to be a function.");if(r.delimiter="string"==typeof r.delimiter||n.isRegExp(r.delimiter)?r.delimiter:i.delimiter,r.depth="number"==typeof r.depth?r.depth:i.depth,r.arrayLimit="number"==typeof r.arrayLimit?r.arrayLimit:i.arrayLimit,r.parseArrays=!1!==r.parseArrays,r.decoder="function"==typeof r.decoder?r.decoder:i.decoder,r.allowDots="boolean"==typeof r.allowDots?r.allowDots:i.allowDots,r.plainObjects="boolean"==typeof r.plainObjects?r.plainObjects:i.plainObjects,r.allowPrototypes="boolean"==typeof r.allowPrototypes?r.allowPrototypes:i.allowPrototypes,r.parameterLimit="number"==typeof r.parameterLimit?r.parameterLimit:i.parameterLimit,r.strictNullHandling="boolean"==typeof r.strictNullHandling?r.strictNullHandling:i.strictNullHandling,""===e||null===e||void 0===e)return r.plainObjects?Object.create(null):{};for(var o="string"==typeof e?a(e,r):e,c=r.plainObjects?Object.create(null):{},l=Object.keys(o),s=0;s<l.length;++s){var f=l[s],p=u(f,o[f],r);c=n.merge(c,p,r)}return n.compact(c)}},function(e,t,r){"use strict";var n=r(1),o=r(0),i={brackets:function(e){return e+"[]"},indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},a=Date.prototype.toISOString,c={delimiter:"&",encode:!0,encoder:n.encode,encodeValuesOnly:!1,serializeDate:function(e){return a.call(e)},skipNulls:!1,strictNullHandling:!1},u=function e(t,r,o,i,a,c,u,l,s,f,p,d){var y=t;if("function"==typeof u)y=u(r,y);else if(y instanceof Date)y=f(y);else if(null===y){if(i)return c&&!d?c(r):r;y=""}if("string"==typeof y||"number"==typeof y||"boolean"==typeof y||n.isBuffer(y)){if(c){return[p(d?r:c(r))+"="+p(c(y))]}return[p(r)+"="+p(String(y))]}var m=[];if(void 0===y)return m;var b;if(Array.isArray(u))b=u;else{var h=Object.keys(y);b=l?h.sort(l):h}for(var v=0;v<b.length;++v){var g=b[v];a&&null===y[g]||(m=Array.isArray(y)?m.concat(e(y[g],o(r,g),o,i,a,c,u,l,s,f,p,d)):m.concat(e(y[g],r+(s?"."+g:"["+g+"]"),o,i,a,c,u,l,s,f,p,d)))}return m};e.exports=function(e,t){var r=e,n=t||{};if(null!==n.encoder&&void 0!==n.encoder&&"function"!=typeof n.encoder)throw new TypeError("Encoder has to be a function.");var a=void 0===n.delimiter?c.delimiter:n.delimiter,l="boolean"==typeof n.strictNullHandling?n.strictNullHandling:c.strictNullHandling,s="boolean"==typeof n.skipNulls?n.skipNulls:c.skipNulls,f="boolean"==typeof n.encode?n.encode:c.encode,p="function"==typeof n.encoder?n.encoder:c.encoder,d="function"==typeof n.sort?n.sort:null,y=void 0!==n.allowDots&&n.allowDots,m="function"==typeof n.serializeDate?n.serializeDate:c.serializeDate,b="boolean"==typeof n.encodeValuesOnly?n.encodeValuesOnly:c.encodeValuesOnly;if(void 0===n.format)n.format=o.default;else if(!Object.prototype.hasOwnProperty.call(o.formatters,n.format))throw new TypeError("Unknown format option provided.");var h,v,g=o.formatters[n.format];"function"==typeof n.filter?(v=n.filter,r=v("",r)):Array.isArray(n.filter)&&(v=n.filter,h=v);var w=[];if("object"!=typeof r||null===r)return"";var j;j=n.arrayFormat in i?n.arrayFormat:"indices"in n?n.indices?"indices":"repeat":"indices";var O=i[j];h||(h=Object.keys(r)),d&&h.sort(d);for(var A=0;A<h.length;++A){var x=h[A];s&&null===r[x]||(w=w.concat(u(r[x],x,O,l,s,f?p:null,v,d,y,m,g,b)))}return w.join(a)}}])});