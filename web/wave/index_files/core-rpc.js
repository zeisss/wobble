window['___jsl'] = window['___jsl'] || {};window['___jsl']['u'] = 'https:\/\/wave.google.com\/gadgets\/js\/core:rpc.js';window['___jsl']['f'] = ['core','rpc'];window['___jsl']['ms'] = 'https://apis.google.com';(window['___jsl']['ci'] = (window['___jsl']['ci'] || [])).push({"rpc":{"commSwf":"//xpc.googleusercontent.com/gadgets/xpc.swf","passReferrer":"p2c:query","parentRelayUrl":"/rpc_relay.html"},"core.io":{"jsonProxyUrl":"//%host%/gadgets/makeRequest","proxyUrl":"//www.gmodules.com/gadgets/proxy/refresh=%refresh%&container=%container%%rewriteMime%&gadget=%gadget%/%rawurl%"}});
/* [start] feature=gapi-globals */
var gapi=window.gapi||{};
;

/* [end] feature=gapi-globals */

/* [start] feature=globals */
var gadgets=window.gadgets||{},shindig=window.shindig||{},osapi=window.osapi=window.osapi||{},google=window.google||{};
;

/* [end] feature=globals */

/* [start] feature=taming */
var safeJSON=window.safeJSON;
var tamings___=window.tamings___||[];
var bridge___;
var caja___=window.caja___;
var ___=window.___;;

/* [end] feature=taming */

/* [start] feature=core.config.base */
window['___cfg'] = window['___cfg'] || window['___gcfg'];;
if(!window.gadgets["config"]){gadgets.config=function(){var f;
var h={};
var b={};
function c(j,l){for(var k in l){if(!l.hasOwnProperty(k)){continue
}if(typeof j[k]==="object"&&typeof l[k]==="object"){c(j[k],l[k])
}else{j[k]=l[k]
}}}function i(){var j=document.scripts||document.getElementsByTagName("script");
if(!j||j.length==0){return null
}var m;
if(f.u){for(var k=0;
!m&&k<j.length;
++k){var l=j[k];
if(l.src&&l.src.indexOf(f.u)==0){m=l
}}}if(!m){m=j[j.length-1]
}if(!m.src){return null
}return m
}function a(j){var k="";
if(j.nodeType==3||j.nodeType==4){k=j.nodeValue
}else{if(j.innerText){k=j.innerText
}else{if(j.innerHTML){k=j.innerHTML
}else{if(j.firstChild){var l=[];
for(var m=j.firstChild;
m;
m=m.nextSibling){l.push(a(m))
}k=l.join("")
}}}}return k
}function e(k){if(!k){return{}
}var j;
while(k.charCodeAt(k.length-1)==0){k=k.substring(0,k.length-1)
}try{j=(new Function("return ("+k+"\n)"))()
}catch(l){}if(typeof j==="object"){return j
}try{j=(new Function("return ({"+k+"\n})"))()
}catch(l){}return typeof j==="object"?j:{}
}function g(n){var p=window.___cfg;
if(p){c(n,p)
}var o=i();
if(!o){return
}var k=a(o);
var j=e(k);
if(f.f&&f.f.length==1){var m=f.f[0];
if(!j[m]){var l={};
l[f.f[0]]=j;
j=l
}}c(n,j)
}function d(o){for(var l in h){if(h.hasOwnProperty(l)){var n=h[l];
for(var m=0,k=n.length;
m<k;
++m){o(l,n[m])
}}}}return{register:function(l,k,j,m){var n=h[l];
if(!n){n=[];
h[l]=n
}n.push({validators:k||{},callback:j,callOnUpdate:m})
},get:function(j){if(j){return b[j]||{}
}return b
},init:function(k,j){f=window.___jsl||{};
c(b,k);
g(b);
var l=window.___config||{};
c(b,l);
d(function(q,p){var o=b[q];
if(o&&!j){var m=p.validators;
for(var n in m){if(m.hasOwnProperty(n)){if(!m[n](o[n])){throw new Error('Invalid config value "'+o[n]+'" for parameter "'+n+'" in component "'+q+'"')
}}}}if(p.callback){p.callback(b)
}})
},update:function(k,o){var n=[];
d(function(p,j){if(k.hasOwnProperty(p)||(o&&b&&b[p])){if(j.callback&&j.callOnUpdate){n.push(j.callback)
}}});
b=o?{}:b||{};
c(b,k);
for(var m=0,l=n.length;
m<l;
++m){n[m](b)
}}}
}()
}else{gadgets.config=window.gadgets["config"];
gadgets.config.register=gadgets.config.register;
gadgets.config.get=gadgets.config.get;
gadgets.config.init=gadgets.config.init;
gadgets.config.update=gadgets.config.update
};;

/* [end] feature=core.config.base */

/* [start] feature=core.log */
gadgets.log=(function(){var e=1;
var a=2;
var f=3;
var c=4;
var d=function(i){b(e,i)
};
gadgets.warn=function(i){b(a,i)
};
gadgets.error=function(i){b(f,i)
};
gadgets.setLogLevel=function(i){h=i
};
function b(j,i){if(j<h||!g){return
}if(j===a&&g.warn){g.warn(i)
}else{if(j===f&&g.error){g.error(i)
}else{if(g.log){g.log(i)
}}}}d.INFO=e;
d.WARNING=a;
d.NONE=c;
var h=e;
var g=window.console?window.console:window.opera?window.opera.postError:undefined;
return d
})();;
;

/* [end] feature=core.log */

/* [start] feature=core.config */
(function(){gadgets.config.EnumValidator=function(d){var c=[];
if(arguments.length>1){for(var b=0,a;
(a=arguments[b]);
++b){c.push(a)
}}else{c=d
}return function(f){for(var e=0,g;
(g=c[e]);
++e){if(f===c[e]){return true
}}return false
}
};
gadgets.config.RegExValidator=function(a){return function(b){return a.test(b)
}
};
gadgets.config.ExistsValidator=function(a){return typeof a!=="undefined"
};
gadgets.config.NonEmptyStringValidator=function(a){return typeof a==="string"&&a.length>0
};
gadgets.config.BooleanValidator=function(a){return typeof a==="boolean"
};
gadgets.config.LikeValidator=function(a){return function(c){for(var d in a){if(a.hasOwnProperty(d)){var b=a[d];
if(!b(c[d])){return false
}}}return true
}
}
})();;

/* [end] feature=core.config */

/* [start] feature=core.util.base */
gadgets.util=gadgets.util||{};
(function(){gadgets.util.makeClosure=function(d,f,e){var c=[];
for(var b=2,a=arguments.length;
b<a;
++b){c.push(arguments[b])
}return function(){var g=c.slice();
for(var k=0,h=arguments.length;
k<h;
++k){g.push(arguments[k])
}return f.apply(d,g)
}
};
gadgets.util.makeEnum=function(b){var c,a,d={};
for(c=0;
(a=b[c]);
++c){d[a]=a
}return d
}
})();;

/* [end] feature=core.util.base */

/* [start] feature=core.util.dom */
gadgets.util=gadgets.util||{};
(function(){var c="http://www.w3.org/1999/xhtml";
function b(f,e){var h=e||{};
for(var g in h){if(h.hasOwnProperty(g)){f[g]=h[g]
}}}function d(g,f){var e=["<",g];
var i=f||{};
for(var h in i){if(i.hasOwnProperty(h)){e.push(" ");
e.push(h);
e.push('="');
e.push(gadgets.util.escapeString(i[h]));
e.push('"')
}}e.push("></");
e.push(g);
e.push(">");
return e.join("")
}function a(f){var g="";
if(f.nodeType==3||f.nodeType==4){g=f.nodeValue
}else{if(f.innerText){g=f.innerText
}else{if(f.innerHTML){g=f.innerHTML
}else{if(f.firstChild){var e=[];
for(var h=f.firstChild;
h;
h=h.nextSibling){e.push(a(h))
}g=e.join("")
}}}}return g
}gadgets.util.createElement=function(f){var e;
if((!document.body)||document.body.namespaceURI){try{e=document.createElementNS(c,f)
}catch(g){}}return e||document.createElement(f)
};
gadgets.util.createIframeElement=function(g){var i=gadgets.util.createElement("iframe");
try{var e=d("iframe",g);
var f=gadgets.util.createElement(e);
if(f&&((!i)||((f.tagName==i.tagName)&&(f.namespaceURI==i.namespaceURI)))){i=f
}}catch(h){}b(i,g);
return i
};
gadgets.util.getBodyElement=function(){if(document.body){return document.body
}try{var f=document.getElementsByTagNameNS(c,"body");
if(f&&(f.length==1)){return f[0]
}}catch(e){}return document.documentElement||document
};
gadgets.util.getInnerText=function(e){return a(e)
}
})();;

/* [end] feature=core.util.dom */

/* [start] feature=core.util.event */
gadgets.util=gadgets.util||{};
(function(){gadgets.util.attachBrowserEvent=function(c,b,d,a){if(typeof c.addEventListener!="undefined"){c.addEventListener(b,d,a)
}else{if(typeof c.attachEvent!="undefined"){c.attachEvent("on"+b,d)
}else{gadgets.warn("cannot attachBrowserEvent: "+b)
}}};
gadgets.util.removeBrowserEvent=function(c,b,d,a){if(c.removeEventListener){c.removeEventListener(b,d,a)
}else{if(c.detachEvent){c.detachEvent("on"+b,d)
}else{gadgets.warn("cannot removeBrowserEvent: "+b)
}}}
})();;

/* [end] feature=core.util.event */

/* [start] feature=core.util.onload */
gadgets.util=gadgets.util||{};
(function(){var a=[];
gadgets.util.registerOnLoadHandler=function(b){a.push(b)
};
gadgets.util.runOnLoadHandlers=function(){for(var c=0,b=a.length;
c<b;
++c){a[c]()
}}
})();;

/* [end] feature=core.util.onload */

/* [start] feature=core.util.string */
gadgets.util=gadgets.util||{};
(function(){var a={0:false,10:true,13:true,34:true,39:true,60:true,62:true,92:true,8232:true,8233:true,65282:true,65287:true,65308:true,65310:true,65340:true};
function b(c,d){return String.fromCharCode(d)
}gadgets.util.escape=function(c,g){if(!c){return c
}else{if(typeof c==="string"){return gadgets.util.escapeString(c)
}else{if(typeof c==="array"){for(var f=0,d=c.length;
f<d;
++f){c[f]=gadgets.util.escape(c[f])
}}else{if(typeof c==="object"&&g){var e={};
for(var h in c){if(c.hasOwnProperty(h)){e[gadgets.util.escapeString(h)]=gadgets.util.escape(c[h],true)
}}return e
}}}}return c
};
gadgets.util.escapeString=function(g){if(!g){return g
}var d=[],f,h;
for(var e=0,c=g.length;
e<c;
++e){f=g.charCodeAt(e);
h=a[f];
if(h===true){d.push("&#",f,";")
}else{if(h!==false){d.push(g.charAt(e))
}}}return d.join("")
};
gadgets.util.unescapeString=function(c){if(!c){return c
}return c.replace(/&#([0-9]+);/g,b)
}
})();;

/* [end] feature=core.util.string */

/* [start] feature=core.util.urlparams */
gadgets.util=gadgets.util||{};
(function(){var a=null;
function b(e){var f;
var c=e.indexOf("?");
var d=e.indexOf("#");
if(d===-1){f=e.substr(c+1)
}else{f=[e.substr(c+1,d-c-1),"&",e.substr(d+1)].join("")
}return f.split("&")
}gadgets.util.getUrlParameters=function(p){var d=typeof p==="undefined";
if(a!==null&&d){return a
}var l={};
var f=b(p||document.location.href);
var n=window.decodeURIComponent?decodeURIComponent:unescape;
for(var h=0,g=f.length;
h<g;
++h){var m=f[h].indexOf("=");
if(m===-1){continue
}var c=f[h].substring(0,m);
var o=f[h].substring(m+1);
o=o.replace(/\+/g," ");
try{l[c]=n(o)
}catch(k){}}if(d){a=l
}return l
};
gadgets.util.getUrlParameters()
})();;

/* [end] feature=core.util.urlparams */

/* [start] feature=core.util */
gadgets.util=gadgets.util||{};
(function(){var b={};
var a={};
function c(d){b=d["core.util"]||{}
}if(gadgets.config){gadgets.config.register("core.util",null,c)
}gadgets.util.getFeatureParameters=function(d){return typeof b[d]==="undefined"?null:b[d]
};
gadgets.util.hasFeature=function(d){return typeof b[d]!=="undefined"
};
gadgets.util.getServices=function(){return a
}
})();;

/* [end] feature=core.util */

/* [start] feature=shindig.auth */
shindig.Auth=function(){var authToken=null;
var trusted=null;
function addParamsToToken(urlParams){var args=authToken.split("&");
for(var i=0;
i<args.length;
i++){var nameAndValue=args[i].split("=");
if(nameAndValue.length===2){var name=nameAndValue[0];
var value=nameAndValue[1];
if(value==="$"){value=encodeURIComponent(urlParams[name]);
args[i]=name+"="+value
}}}authToken=args.join("&")
}function init(configuration){var urlParams=gadgets.util.getUrlParameters();
var config=configuration["shindig.auth"]||{};
if(config.authToken){authToken=config.authToken
}else{if(urlParams.st){authToken=urlParams.st
}}if(authToken!==null){addParamsToToken(urlParams)
}if(config.trustedJson){trusted=(eval("("+config.trustedJson+")"))
}}gadgets.config.register("shindig.auth",null,init);
return{getSecurityToken:function(){return authToken
},updateSecurityToken:function(newToken){authToken=newToken
},getTrustedData:function(){return trusted
}}
};;
shindig.auth=new shindig.Auth();;

/* [end] feature=shindig.auth */

/* [start] feature=core.json */
if(window.JSON&&window.JSON.parse&&window.JSON.stringify){gadgets.json=(function(){var a=/___$/;
function b(d,e){var c=this[d];
return c
}return{parse:function(d){try{return window.JSON.parse(d)
}catch(c){return false
}},stringify:function(d){var h=window.JSON.stringify;
function f(e){return h.call(this,e,b)
}var g=(Array.prototype.toJSON&&h([{x:1}])==='"[{\\"x\\": 1}]"')?f:h;
try{return g(d,function(i,e){return !a.test(i)?e:void 0
})
}catch(c){return null
}}}
})()
};;
;
if(!(window.JSON&&window.JSON.parse&&window.JSON.stringify)){gadgets.json=function(){function f(n){return n<10?"0"+n:n
}Date.prototype.toJSON=function(){return[this.getUTCFullYear(),"-",f(this.getUTCMonth()+1),"-",f(this.getUTCDate()),"T",f(this.getUTCHours()),":",f(this.getUTCMinutes()),":",f(this.getUTCSeconds()),"Z"].join("")
};
var m={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function stringify(value){var a,i,k,l,r=/[\"\\\x00-\x1f\x7f-\x9f]/g,v;
switch(typeof value){case"string":return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];
if(c){return c
}c=a.charCodeAt();
return"\\u00"+Math.floor(c/16).toString(16)+(c%16).toString(16)
})+'"':'"'+value+'"';
case"number":return isFinite(value)?String(value):"null";
case"boolean":case"null":return String(value);
case"object":if(!value){return"null"
}a=[];
if(typeof value.length==="number"&&!value.propertyIsEnumerable("length")){l=value.length;
for(i=0;
i<l;
i+=1){a.push(stringify(value[i])||"null")
}return"["+a.join(",")+"]"
}for(k in value){if(/___$/.test(k)){continue
}if(value.hasOwnProperty(k)){if(typeof k==="string"){v=stringify(value[k]);
if(v){a.push(stringify(k)+":"+v)
}}}}return"{"+a.join(",")+"}"
}return""
}return{stringify:stringify,parse:function(text){if(/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/b-u]/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){return eval("("+text+")")
}return false
}}
}()
};;
gadgets.json.flatten=function(c){var d={};
if(c===null||c===undefined){return d
}for(var a in c){if(c.hasOwnProperty(a)){var b=c[a];
if(null===b||undefined===b){continue
}d[a]=(typeof b==="string")?b:gadgets.json.stringify(b)
}}return d
};;

/* [end] feature=core.json */

/* [start] feature=core.io */
gadgets.io=function(){var config={};
var oauthState;
function makeXhr(){var x;
var wrapperXhr=window.shindig&&window.shindig["xhrwrapper"]&&window.shindig["xhrwrapper"]["createXHR"];
if(wrapperXhr){return wrapperXhr()
}else{if(typeof ActiveXObject!="undefined"){x=new ActiveXObject("Msxml2.XMLHTTP");
if(!x){x=new ActiveXObject("Microsoft.XMLHTTP")
}return x
}else{if(typeof XMLHttpRequest!="undefined"||window.XMLHttpRequest){return new window.XMLHttpRequest()
}else{throw ("no xhr available")
}}}}function hadError(xobj,callback){if(xobj.readyState!==4){return true
}try{if(xobj.status!==200){var error=(""+xobj.status);
if(xobj.responseText){error=error+" "+xobj.responseText
}callback({errors:[error],rc:xobj.status,text:xobj.responseText});
return true
}}catch(e){callback({errors:[e.number+" Error not specified"],rc:e.number,text:e.description});
return true
}return false
}function processNonProxiedResponse(url,callback,params,xobj){if(hadError(xobj,callback)){return
}var data={body:xobj.responseText};
callback(transformResponseData(params,data))
}var UNPARSEABLE_CRUFT="throw 1; < don't be evil' >";
function processResponse(url,callback,params,xobj){if(hadError(xobj,callback)){return
}var txt=xobj.responseText;
var offset=txt.indexOf(UNPARSEABLE_CRUFT)+UNPARSEABLE_CRUFT.length;
if(offset<UNPARSEABLE_CRUFT.length){return
}txt=txt.substr(offset);
var data=eval("("+txt+")");
data=data[url];
if(data.oauthState){oauthState=data.oauthState
}if(data.st){shindig.auth.updateSecurityToken(data.st)
}callback(transformResponseData(params,data))
}function transformResponseData(params,data){var resp={text:data.body,rc:data.rc||200,headers:data.headers,oauthApprovalUrl:data.oauthApprovalUrl,oauthError:data.oauthError,oauthErrorText:data.oauthErrorText,errors:[]};
if(resp.rc<200||resp.rc>=400){resp.errors=[resp.rc+" Error"]
}else{if(resp.text){if(resp.rc>=300&&resp.rc<400){params.CONTENT_TYPE="TEXT"
}switch(params.CONTENT_TYPE){case"JSON":case"FEED":resp.data=gadgets.json.parse(resp.text);
if(!resp.data){resp.errors.push("500 Failed to parse JSON");
resp.rc=500;
resp.data=null
}break;
case"DOM":var dom;
if(typeof ActiveXObject!="undefined"){dom=new ActiveXObject("Microsoft.XMLDOM");
dom.async=false;
dom.validateOnParse=false;
dom.resolveExternals=false;
if(!dom.loadXML(resp.text)){resp.errors.push("500 Failed to parse XML");
resp.rc=500
}else{resp.data=dom
}}else{var parser=new DOMParser();
dom=parser.parseFromString(resp.text,"text/xml");
if("parsererror"===dom.documentElement.nodeName){resp.errors.push("500 Failed to parse XML");
resp.rc=500
}else{resp.data=dom
}}break;
default:resp.data=resp.text;
break
}}}return resp
}function makeXhrRequest(realUrl,proxyUrl,callback,paramData,method,params,processResponseFunction,opt_headers){var xhr=makeXhr();
if(proxyUrl.indexOf("//")==0){proxyUrl=document.location.protocol+proxyUrl
}xhr.open(method,proxyUrl,true);
if(callback){xhr.onreadystatechange=gadgets.util.makeClosure(null,processResponseFunction,realUrl,callback,params,xhr)
}if(paramData!==null){var contentTypeHeader="Content-Type";
var contentType="application/x-www-form-urlencoded";
if(typeof opt_headers==="string"){contentType=opt_headers;
opt_headers={}
}var headers=opt_headers||{};
if(!headers[contentTypeHeader]){headers[contentTypeHeader]=contentType
}for(var headerName in headers){xhr.setRequestHeader(headerName,headers[headerName])
}}xhr.send(paramData)
}function respondWithPreload(postData,params,callback){if(gadgets.io.preloaded_&&postData.httpMethod==="GET"){for(var i=0;
i<gadgets.io.preloaded_.length;
i++){var preload=gadgets.io.preloaded_[i];
if(preload&&(preload.id===postData.url)){delete gadgets.io.preloaded_[i];
if(preload.rc!==200){callback({rc:preload.rc,errors:[preload.rc+" Error"]})
}else{if(preload.oauthState){oauthState=preload.oauthState
}var resp={body:preload.body,rc:preload.rc,headers:preload.headers,oauthApprovalUrl:preload.oauthApprovalUrl,oauthError:preload.oauthError,oauthErrorText:preload.oauthErrorText,errors:[]};
callback(transformResponseData(params,resp))
}return true
}}}return false
}function init(configuration){config=configuration["core.io"]||{}
}gadgets.config.register("core.io",null,init);
return{makeRequest:function(url,callback,opt_params){var params=opt_params||{};
var httpMethod=params.METHOD||"GET";
var refreshInterval=params.REFRESH_INTERVAL;
var auth,st;
if(params.AUTHORIZATION&&params.AUTHORIZATION!=="NONE"){auth=params.AUTHORIZATION.toLowerCase();
st=shindig.auth.getSecurityToken()
}else{if(httpMethod==="GET"&&refreshInterval===undefined){refreshInterval=3600
}}var signOwner=true;
if(typeof params.OWNER_SIGNED!=="undefined"){signOwner=params.OWNER_SIGNED
}var signViewer=true;
if(typeof params.VIEWER_SIGNED!=="undefined"){signViewer=params.VIEWER_SIGNED
}var headers=params.HEADERS||{};
if(httpMethod==="POST"&&!headers["Content-Type"]){headers["Content-Type"]="application/x-www-form-urlencoded"
}var urlParams=gadgets.util.getUrlParameters();
var paramData={url:url,httpMethod:httpMethod,headers:gadgets.io.encodeValues(headers,false),postData:params.POST_DATA||"",authz:auth||"",st:st||"",contentType:params.CONTENT_TYPE||"TEXT",numEntries:params.NUM_ENTRIES||"3",getSummaries:!!params.GET_SUMMARIES,signOwner:signOwner,signViewer:signViewer,gadget:urlParams.url,container:urlParams.container||urlParams.synd||"default",bypassSpecCache:gadgets.util.getUrlParameters()["nocache"]||"",getFullHeaders:!!params.GET_FULL_HEADERS};
if(auth==="oauth"||auth==="signed"){if(gadgets.io.oauthReceivedCallbackUrl_){paramData.OAUTH_RECEIVED_CALLBACK=gadgets.io.oauthReceivedCallbackUrl_;
gadgets.io.oauthReceivedCallbackUrl_=null
}paramData.oauthState=oauthState||"";
for(var opt in params){if(params.hasOwnProperty(opt)){if(opt.indexOf("OAUTH_")===0){paramData[opt]=params[opt]
}}}}var proxyUrl=config.jsonProxyUrl.replace("%host%",document.location.host);
if(!respondWithPreload(paramData,params,callback)){if(httpMethod==="GET"&&refreshInterval>0){var extraparams="?refresh="+refreshInterval+"&"+gadgets.io.encodeValues(paramData);
makeXhrRequest(url,proxyUrl+extraparams,callback,null,"GET",params,processResponse)
}else{makeXhrRequest(url,proxyUrl,callback,gadgets.io.encodeValues(paramData),"POST",params,processResponse)
}}},makeNonProxiedRequest:function(relativeUrl,callback,opt_params,opt_headers){var params=opt_params||{};
makeXhrRequest(relativeUrl,relativeUrl,callback,params.POST_DATA,params.METHOD,params,processNonProxiedResponse,opt_headers)
},clearOAuthState:function(){oauthState=undefined
},encodeValues:function(fields,opt_noEscaping){var escape=!opt_noEscaping;
var buf=[];
var first=false;
for(var i in fields){if(fields.hasOwnProperty(i)&&!/___$/.test(i)){if(!first){first=true
}else{buf.push("&")
}buf.push(escape?encodeURIComponent(String(i)):i);
buf.push("=");
buf.push(escape?encodeURIComponent(String(fields[i])):fields[i])
}}return buf.join("")
},getProxyUrl:function(url,opt_params){var params=opt_params||{};
var refresh=params.REFRESH_INTERVAL;
if(refresh===undefined){refresh="3600"
}var urlParams=gadgets.util.getUrlParameters();
var rewriteMimeParam=params.rewriteMime?"&rewriteMime="+encodeURIComponent(String(params.rewriteMime)):"";
var ret=config.proxyUrl.replace("%url%",encodeURIComponent(url)).replace("%host%",document.location.host).replace("%rawurl%",url).replace("%refresh%",encodeURIComponent(String(refresh))).replace("%gadget%",encodeURIComponent(urlParams.url)).replace("%container%",encodeURIComponent(urlParams.container||urlParams.synd||"default")).replace("%rewriteMime%",rewriteMimeParam);
if(ret.indexOf("//")==0){ret=window.location.protocol+ret
}return ret
}}
}();
gadgets.io.RequestParameters=gadgets.util.makeEnum(["METHOD","CONTENT_TYPE","POST_DATA","HEADERS","AUTHORIZATION","NUM_ENTRIES","GET_SUMMARIES","GET_FULL_HEADERS","REFRESH_INTERVAL","OAUTH_SERVICE_NAME","OAUTH_USE_TOKEN","OAUTH_TOKEN_NAME","OAUTH_REQUEST_TOKEN","OAUTH_REQUEST_TOKEN_SECRET","OAUTH_RECEIVED_CALLBACK"]);
gadgets.io.MethodType=gadgets.util.makeEnum(["GET","POST","PUT","DELETE","HEAD"]);
gadgets.io.ContentType=gadgets.util.makeEnum(["TEXT","DOM","JSON","FEED"]);
gadgets.io.AuthorizationType=gadgets.util.makeEnum(["NONE","SIGNED","OAUTH"]);;

/* [end] feature=core.io */

/* [start] feature=core.prefs */
(function(){var i=null;
var j={};
var f=gadgets.util.escapeString;
var d={};
var h={};
var e="en";
var b="US";
var a=0;
function c(){var l=gadgets.util.getUrlParameters();
for(var k in l){if(l.hasOwnProperty(k)){if(k.indexOf("up_")===0&&k.length>3){j[k.substr(3)]=String(l[k])
}else{if(k==="country"){b=l[k]
}else{if(k==="lang"){e=l[k]
}else{if(k==="mid"){a=l[k]
}}}}}}}function g(){for(var k in h){if(typeof j[k]==="undefined"){j[k]=h[k]
}}}gadgets.Prefs=function(){if(!i){c();
g();
i=this
}return i
};
gadgets.Prefs.setInternal_=function(n,p){var o=false;
if(typeof n==="string"){if(!j.hasOwnProperty(n)||j[n]!==p){o=true
}j[n]=p
}else{for(var m in n){if(n.hasOwnProperty(m)){var l=n[m];
if(!j.hasOwnProperty(m)||j[m]!==l){o=true
}j[m]=l
}}}return o
};
gadgets.Prefs.setMessages_=function(k){d=k
};
gadgets.Prefs.setDefaultPrefs_=function(k){h=k
};
gadgets.Prefs.prototype.getString=function(k){if(k===".lang"){k="lang"
}return j[k]?f(j[k]):""
};
gadgets.Prefs.prototype.setDontEscape_=function(){f=function(l){return l
}
};
gadgets.Prefs.prototype.getInt=function(k){var l=parseInt(j[k],10);
return isNaN(l)?0:l
};
gadgets.Prefs.prototype.getFloat=function(k){var l=parseFloat(j[k]);
return isNaN(l)?0:l
};
gadgets.Prefs.prototype.getBool=function(k){var l=j[k];
if(l){return l==="true"||l===true||!!parseInt(l,10)
}return false
};
gadgets.Prefs.prototype.set=function(k,l){throw new Error("setprefs feature required to make this call.")
};
gadgets.Prefs.prototype.getArray=function(n){var o=j[n];
if(o){var k=o.split("|");
for(var m=0,l=k.length;
m<l;
++m){k[m]=f(k[m].replace(/%7C/g,"|"))
}return k
}return[]
};
gadgets.Prefs.prototype.setArray=function(k,l){throw new Error("setprefs feature required to make this call.")
};
gadgets.Prefs.prototype.getMsg=function(k){return d[k]||""
};
gadgets.Prefs.prototype.getCountry=function(){return b
};
gadgets.Prefs.prototype.getLang=function(){return e
};
gadgets.Prefs.prototype.getModuleId=function(){return a
}
})();;

/* [end] feature=core.prefs */

/* [start] feature=core.legacy */
var JSON=window.JSON||gadgets.json;
var _IG_Prefs=(function(){var a=null;
var b=function(){if(!a){a=new gadgets.Prefs();
a.setDontEscape_()
}return a
};
b._parseURL=gadgets.Prefs.parseUrl;
return b
})();
function _IG_Fetch_wrapper(b,a){b(a.data?a.data:"")
}function _IG_FetchContent(b,g,c){var f=c||{};
if(f.refreshInterval){f.REFRESH_INTERVAL=f.refreshInterval
}else{f.REFRESH_INTERVAL=3600
}for(var e in f){var d=f[e];
delete f[e];
f[e.toUpperCase()]=d
}var a=gadgets.util.makeClosure(null,_IG_Fetch_wrapper,g);
gadgets.io.makeRequest(b,a,f)
}function _IG_FetchXmlContent(b,e,c){var d=c||{};
if(d.refreshInterval){d.REFRESH_INTERVAL=d.refreshInterval
}else{d.REFRESH_INTERVAL=3600
}d.CONTENT_TYPE="DOM";
var a=gadgets.util.makeClosure(null,_IG_Fetch_wrapper,e);
gadgets.io.makeRequest(b,a,d)
}function _IG_FetchFeedAsJSON(b,f,c,a,d){var e=d||{};
e.CONTENT_TYPE="FEED";
e.NUM_ENTRIES=c;
e.GET_SUMMARIES=a;
gadgets.io.makeRequest(b,function(j){j.data=j.data||{};
if(j.errors&&j.errors.length>0){j.data.ErrorMsg=j.errors[0]
}if(j.data.link){j.data.URL=b
}if(j.data.title){j.data.Title=j.data.title
}if(j.data.description){j.data.Description=j.data.description
}if(j.data.link){j.data.Link=j.data.link
}if(j.data.items&&j.data.items.length>0){j.data.Entry=j.data.items;
for(var h=0;
h<j.data.Entry.length;
++h){var i=j.data.Entry[h];
i.Title=i.title;
i.Link=i.link;
i.Summary=i.summary||i.description;
i.Date=i.pubDate
}}for(var g=0;
g<j.data.Entry.length;
++g){var i=j.data.Entry[g];
i.Date=(i.Date/1000)
}f(j.data)
},e)
}function _IG_GetCachedUrl(a,b){var c=b||{};
c.REFRESH_INTERVAL=3600;
if(c.refreshInterval){c.REFRESH_INTERVAL=c.refreshInterval
}return gadgets.io.getProxyUrl(a,c)
}function _IG_GetImageUrl(a,b){return _IG_GetCachedUrl(a,b)
}function _IG_GetImage(b){var a=document.createElement("img");
a.src=_IG_GetCachedUrl(b);
return a
}function _IG_RegisterOnloadHandler(a){gadgets.util.registerOnLoadHandler(a)
}function _IG_Callback(b,c){var a=arguments;
return function(){var d=Array.prototype.slice.call(arguments);
b.apply(null,d.concat(Array.prototype.slice.call(a,1)))
}
}var _args=gadgets.util.getUrlParameters;
function _gel(a){return document.getElementById?document.getElementById(a):null
}function _gelstn(a){if(a==="*"&&document.all){return document.all
}return document.getElementsByTagName?document.getElementsByTagName(a):[]
}function _gelsbyregex(d,f){var c=_gelstn(d);
var e=[];
for(var b=0,a=c.length;
b<a;
++b){if(f.test(c[b].id)){e.push(c[b])
}}return e
}function _esc(a){return window.encodeURIComponent?encodeURIComponent(a):escape(a)
}function _unesc(a){return window.decodeURIComponent?decodeURIComponent(a):unescape(a)
}function _hesc(a){return gadgets.util.escapeString(a)
}function _striptags(a){return a.replace(/<\/?[^>]+>/g,"")
}function _trim(a){return a.replace(/^\s+|\s+$/g,"")
}function _toggle(a){a=(typeof a==="string")?_gel(a):a;
if(a!==null){if(a.style.display.length===0||a.style.display==="block"){a.style.display="none"
}else{if(a.style.display==="none"){a.style.display="block"
}}}}var _uid=(function(){var a=0;
return function(){return a++
}
})();
function _min(d,c){return(d<c?d:c)
}function _max(d,c){return(d>c?d:c)
}function _exportSymbols(a,c){var m=window;
var f=a.split(".");
for(var h=0,g=f.length;
h<g;
h++){var b=f[h];
m[b]=m[b]||{};
m=m[b]
}for(var e=0,d=c.length;
e<d;
e+=2){m[c[e]]=c[e+1]
}}function _IG_AddDOMEventHandler(c,b,a){gadgets.warn("_IG_AddDOMEventHandler not implemented - see SHINDIG-198")
};;

/* [end] feature=core.legacy */

/* [start] feature=core.tracking */
(function(){function e(b,c,a){b={msg:b||"",line:a||0,jsUrl:window.location.href.indexOf(c)==0?"-top-":c,fullUrl:window.location};try{if(++window._varz_numerrors,gadgets&&!(f>3)){c={};c[gadgets.io.RequestParameters.METHOD]=gadgets.io.MethodType.GET;var a=encodeURIComponent||escape,d=gadgets.util.getUrlParameters(),e=d.container||d.synd,g=d.gadget||d.url,i=["/gadgets/evthdlr?t=err&gadget=",a(g),"&container=",a(e),"&jsurl=",a(b.jsUrl),"&line=",a(b.line),"&session=",h,"&count=",f,"&msg=",a(b.msg)];gadgets.io.makeNonProxiedRequest(i.join(""),
null,c);f++}}catch(j){}}window._varz_numerrors=0;var h=(new Date).getTime(),f=0;if(window.location.href.indexOf("&debug=1")==-1&&window.location.href.indexOf("?debug=1")==-1)window.onerror=e})();
;

/* [end] feature=core.tracking */

/* [start] feature=core */
{var html4={},html,html_sanitize;html4.atype={'NONE':0,'URI':1,'URI_FRAGMENT':11,'SCRIPT':2,'STYLE':3,'ID':4,'IDREF':5,'IDREFS':6,'GLOBAL_NAME':7,'LOCAL_NAME':8,'CLASSES':9,'FRAME_TARGET':10},html4.ATTRIBS={'*::class':9,'*::dir':0,'*::id':4,'*::lang':0,'*::onclick':2,'*::ondblclick':2,'*::onkeydown':2,'*::onkeypress':2,'*::onkeyup':2,'*::onload':2,'*::onmousedown':2,'*::onmousemove':2,'*::onmouseout':2,'*::onmouseover':2,'*::onmouseup':2,'*::style':3,'*::title':0,'a::accesskey':0,'a::coords':0,'a::href':1,'a::hreflang':0,'a::name':7,'a::onblur':2,'a::onfocus':2,'a::rel':0,'a::rev':0,'a::shape':0,'a::tabindex':0,'a::target':10,'a::type':0,'area::accesskey':0,'area::alt':0,'area::coords':0,'area::href':1,'area::nohref':0,'area::onblur':2,'area::onfocus':2,'area::shape':0,'area::tabindex':0,'area::target':10,'bdo::dir':0,'blockquote::cite':1,'br::clear':0,'button::accesskey':0,'button::disabled':0,'button::name':8,'button::onblur':2,'button::onfocus':2,'button::tabindex':0,'button::type':0,'button::value':0,'canvas::height':0,'canvas::width':0,'caption::align':0,'col::align':0,'col::char':0,'col::charoff':0,'col::span':0,'col::valign':0,'col::width':0,'colgroup::align':0,'colgroup::char':0,'colgroup::charoff':0,'colgroup::span':0,'colgroup::valign':0,'colgroup::width':0,'del::cite':1,'del::datetime':0,'dir::compact':0,'div::align':0,'dl::compact':0,'font::color':0,'font::face':0,'font::size':0,'form::accept':0,'form::action':1,'form::autocomplete':0,'form::enctype':0,'form::method':0,'form::name':7,'form::onreset':2,'form::onsubmit':2,'form::target':10,'h1::align':0,'h2::align':0,'h3::align':0,'h4::align':0,'h5::align':0,'h6::align':0,'hr::align':0,'hr::noshade':0,'hr::size':0,'hr::width':0,'iframe::align':0,'iframe::frameborder':0,'iframe::height':0,'iframe::marginheight':0,'iframe::marginwidth':0,'iframe::width':0,'img::align':0,'img::alt':0,'img::border':0,'img::height':0,'img::hspace':0,'img::ismap':0,'img::name':7,'img::src':1,'img::usemap':11,'img::vspace':0,'img::width':0,'input::accept':0,'input::accesskey':0,'input::align':0,'input::alt':0,'input::autocomplete':0,'input::checked':0,'input::disabled':0,'input::ismap':0,'input::maxlength':0,'input::name':8,'input::onblur':2,'input::onchange':2,'input::onfocus':2,'input::onselect':2,'input::readonly':0,'input::size':0,'input::src':1,'input::tabindex':0,'input::type':0,'input::usemap':11,'input::value':0,'ins::cite':1,'ins::datetime':0,'label::accesskey':0,'label::for':5,'label::onblur':2,'label::onfocus':2,'legend::accesskey':0,'legend::align':0,'li::type':0,'li::value':0,'map::name':7,'menu::compact':0,'ol::compact':0,'ol::start':0,'ol::type':0,'optgroup::disabled':0,'optgroup::label':0,'option::disabled':0,'option::label':0,'option::selected':0,'option::value':0,'p::align':0,'pre::width':0,'q::cite':1,'select::disabled':0,'select::multiple':0,'select::name':8,'select::onblur':2,'select::onchange':2,'select::onfocus':2,'select::size':0,'select::tabindex':0,'table::align':0,'table::bgcolor':0,'table::border':0,'table::cellpadding':0,'table::cellspacing':0,'table::frame':0,'table::rules':0,'table::summary':0,'table::width':0,'tbody::align':0,'tbody::char':0,'tbody::charoff':0,'tbody::valign':0,'td::abbr':0,'td::align':0,'td::axis':0,'td::bgcolor':0,'td::char':0,'td::charoff':0,'td::colspan':0,'td::headers':6,'td::height':0,'td::nowrap':0,'td::rowspan':0,'td::scope':0,'td::valign':0,'td::width':0,'textarea::accesskey':0,'textarea::cols':0,'textarea::disabled':0,'textarea::name':8,'textarea::onblur':2,'textarea::onchange':2,'textarea::onfocus':2,'textarea::onselect':2,'textarea::readonly':0,'textarea::rows':0,'textarea::tabindex':0,'tfoot::align':0,'tfoot::char':0,'tfoot::charoff':0,'tfoot::valign':0,'th::abbr':0,'th::align':0,'th::axis':0,'th::bgcolor':0,'th::char':0,'th::charoff':0,'th::colspan':0,'th::headers':6,'th::height':0,'th::nowrap':0,'th::rowspan':0,'th::scope':0,'th::valign':0,'th::width':0,'thead::align':0,'thead::char':0,'thead::charoff':0,'thead::valign':0,'tr::align':0,'tr::bgcolor':0,'tr::char':0,'tr::charoff':0,'tr::valign':0,'ul::compact':0,'ul::type':0},html4.eflags={'OPTIONAL_ENDTAG':1,'EMPTY':2,'CDATA':4,'RCDATA':8,'UNSAFE':16,'FOLDABLE':32,'SCRIPT':64,'STYLE':128},html4.ELEMENTS={'a':0,'abbr':0,'acronym':0,'address':0,'applet':16,'area':2,'b':0,'base':18,'basefont':18,'bdo':0,'big':0,'blockquote':0,'body':49,'br':2,'button':0,'canvas':0,'caption':0,'center':0,'cite':0,'code':0,'col':2,'colgroup':1,'dd':1,'del':0,'dfn':0,'dir':0,'div':0,'dl':0,'dt':1,'em':0,'fieldset':0,'font':0,'form':0,'frame':18,'frameset':16,'h1':0,'h2':0,'h3':0,'h4':0,'h5':0,'h6':0,'head':49,'hr':2,'html':49,'i':0,'iframe':4,'img':2,'input':2,'ins':0,'isindex':18,'kbd':0,'label':0,'legend':0,'li':1,'link':18,'map':0,'menu':0,'meta':18,'nobr':0,'noembed':4,'noframes':20,'noscript':20,'object':16,'ol':0,'optgroup':0,'option':1,'p':1,'param':18,'pre':0,'q':0,'s':0,'samp':0,'script':84,'select':0,'small':0,'span':0,'strike':0,'strong':0,'style':148,'sub':0,'sup':0,'table':0,'tbody':1,'td':1,'textarea':8,'tfoot':1,'th':1,'thead':1,'title':24,'tr':1,'tt':0,'u':0,'ul':0,'var':0},html4.ueffects={'NOT_LOADED':0,'SAME_DOCUMENT':1,'NEW_DOCUMENT':2},html4.URIEFFECTS={'a::href':2,'area::href':2,'blockquote::cite':0,'body::background':1,'del::cite':0,'form::action':2,'img::src':1,'input::src':1,'ins::cite':0,'q::cite':0},html4.ltypes={'UNSANDBOXED':2,'SANDBOXED':1,'DATA':0},html4.LOADERTYPES={'a::href':2,'area::href':2,'blockquote::cite':2,'body::background':1,'del::cite':2,'form::action':2,'img::src':1,'input::src':1,'ins::cite':2,'q::cite':2},html=(function(html4){var
ENTITIES,INSIDE_TAG_TOKEN,OUTSIDE_TAG_TOKEN,URI_SCHEME_RE,WHITELISTED_SCHEMES,ampRe,decimalEscapeRe,entityRe,eqRe,gtRe,hexEscapeRe,lcase,looseAmpRe,ltRe,nulRe,quotRe;'script'==='SCRIPT'.toLowerCase()?(lcase=function(s){return s.toLowerCase()}):(lcase=function(s){return s.replace(/[A-Z]/g,function(ch){return String.fromCharCode(ch.charCodeAt(0)|32)})}),ENTITIES={'lt':'<','gt':'>','amp':'&','nbsp':'\xa0','quot':'\"','apos':'\''},WHITELISTED_SCHEMES=/^(?:https?|mailto)$/i,decimalEscapeRe=/^#(\d+)$/,hexEscapeRe=/^#x([0-9A-Fa-f]+)$/;function
lookupEntity(name){var m;return name=lcase(name),ENTITIES.hasOwnProperty(name)?ENTITIES[name]:(m=name.match(decimalEscapeRe),m?String.fromCharCode(parseInt(m[1],10)):(m=name.match(hexEscapeRe))?String.fromCharCode(parseInt(m[1],16)):'')}function
decodeOneEntity(_,name){return lookupEntity(name)}nulRe=/\0/g;function stripNULs(s){return s.replace(nulRe,'')}entityRe=/&(#\d+|#x[0-9A-Fa-f]+|\w+);/g;function
unescapeEntities(s){return s.replace(entityRe,decodeOneEntity)}ampRe=/&/g,looseAmpRe=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi,ltRe=/</g,gtRe=/>/g,quotRe=/\"/g,eqRe=/\=/g;function
escapeAttrib(s){return s.replace(ampRe,'&amp;').replace(ltRe,'&lt;').replace(gtRe,'&gt;').replace(quotRe,'&#34;').replace(eqRe,'&#61;')}function
normalizeRCData(rcdata){return rcdata.replace(looseAmpRe,'&amp;$1').replace(ltRe,'&lt;').replace(gtRe,'&gt;')}INSIDE_TAG_TOKEN=new
RegExp('^\\s*(?:(?:([a-z][a-z-]*)(\\s*=\\s*(\"[^\"]*\"|\'[^\']*\'|(?=[a-z][a-z-]*\\s*=)|[^>\"\'\\s]*))?)|(/?>)|[\\s\\S][^a-z\\s>]*)','i'),OUTSIDE_TAG_TOKEN=new
RegExp('^(?:&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);|<!--[\\s\\S]*?-->|<!\\w[^>]*>|<\\?[^>*]*>|<(/)?([a-z][a-z0-9]*)|([^<&>]+)|([<&>]))','i');function
makeSaxParser(handler){return function parse(htmlText,param){var attribName,attribs,ch,dataEnd,decodedValue,eflags,encodedValue,htmlLower,inTag,m,openTag,tagName;htmlText=String(htmlText),htmlLower=null,inTag=false,attribs=[],tagName=void
0,eflags=void 0,openTag=void 0,handler.startDoc&&handler.startDoc(param);while(htmlText){m=htmlText.match(inTag?INSIDE_TAG_TOKEN:OUTSIDE_TAG_TOKEN),htmlText=htmlText.substring(m[0].length);if(inTag){if(m[1]){attribName=lcase(m[1]);if(m[2]){encodedValue=m[3];switch(encodedValue.charCodeAt(0)){case
34:case 39:encodedValue=encodedValue.substring(1,encodedValue.length-1)}decodedValue=unescapeEntities(stripNULs(encodedValue))}else
decodedValue=attribName;attribs.push(attribName,decodedValue)}else if(m[4])eflags!==void
0&&(openTag?handler.startTag&&handler.startTag(tagName,attribs,param):handler.endTag&&handler.endTag(tagName,param)),openTag&&eflags&(html4.eflags.CDATA|html4.eflags.RCDATA)&&(htmlLower===null?(htmlLower=lcase(htmlText)):(htmlLower=htmlLower.substring(htmlLower.length-htmlText.length)),dataEnd=htmlLower.indexOf('</'+tagName),dataEnd<0&&(dataEnd=htmlText.length),dataEnd&&(eflags&html4.eflags.CDATA?handler.cdata&&handler.cdata(htmlText.substring(0,dataEnd),param):handler.rcdata&&handler.rcdata(normalizeRCData(htmlText.substring(0,dataEnd)),param),htmlText=htmlText.substring(dataEnd))),tagName=eflags=openTag=void
0,attribs.length=0,inTag=false}else m[1]?handler.pcdata&&handler.pcdata(m[0],param):m[3]?(openTag=!m[2],inTag=true,tagName=lcase(m[3]),eflags=html4.ELEMENTS.hasOwnProperty(tagName)?html4.ELEMENTS[tagName]:void
0):m[4]?handler.pcdata&&handler.pcdata(m[4],param):m[5]&&(handler.pcdata&&(ch=m[5],handler.pcdata(ch==='<'?'&lt;':ch==='>'?'&gt;':'&amp;',param)))}handler.endDoc&&handler.endDoc(param)}}function
makeHtmlSanitizer(sanitizeAttributes){var ignoring,stack;return makeSaxParser({'startDoc':function(_){stack=[],ignoring=false},'startTag':function(tagName,attribs,out){var
attribName,eflags,i,n,value;if(ignoring)return;if(!html4.ELEMENTS.hasOwnProperty(tagName))return;eflags=html4.ELEMENTS[tagName];if(eflags&html4.eflags.FOLDABLE)return;else
if(eflags&html4.eflags.UNSAFE)return ignoring=!(eflags&html4.eflags.EMPTY),void 0;attribs=sanitizeAttributes(tagName,attribs);if(attribs){eflags&html4.eflags.EMPTY||stack.push(tagName),out.push('<',tagName);for(i=0,n=attribs.length;i<n;i+=2)attribName=attribs[i],value=attribs[i+1],value!==null&&value!==void
0&&out.push(' ',attribName,'=\"',escapeAttrib(value),'\"');out.push('>')}},'endTag':function(tagName,out){var
eflags,i,index,stackEl;if(ignoring)return ignoring=false,void 0;if(!html4.ELEMENTS.hasOwnProperty(tagName))return;eflags=html4.ELEMENTS[tagName];if(!(eflags&(html4.eflags.UNSAFE|html4.eflags.EMPTY|html4.eflags.FOLDABLE))){if(eflags&html4.eflags.OPTIONAL_ENDTAG)for(index=stack.length;--index>=0;){stackEl=stack[index];if(stackEl===tagName)break;if(!(html4.ELEMENTS[stackEl]&html4.eflags.OPTIONAL_ENDTAG))return}else
for(index=stack.length;--index>=0;)if(stack[index]===tagName)break;if(index<0)return;for(i=stack.length;--i>index;)stackEl=stack[i],html4.ELEMENTS[stackEl]&html4.eflags.OPTIONAL_ENDTAG||out.push('</',stackEl,'>');stack.length=index,out.push('</',tagName,'>')}},'pcdata':function(text,out){ignoring||out.push(text)},'rcdata':function(text,out){ignoring||out.push(text)},'cdata':function(text,out){ignoring||out.push(text)},'endDoc':function(out){var
i;for(i=stack.length;--i>=0;)out.push('</',stack[i],'>');stack.length=0}})}URI_SCHEME_RE=new
RegExp('^(?:([^:/?#]+):)?');function sanitize(htmlText,opt_uriPolicy,opt_nmTokenPolicy){var
out=[];return makeHtmlSanitizer(function sanitizeAttribs(tagName,attribs){var attribKey,attribName,atype,i,parsedUri,value;for(i=0;i<attribs.length;i+=2){attribName=attribs[i],value=attribs[i+1],atype=null,((attribKey=tagName+'::'+attribName,html4.ATTRIBS.hasOwnProperty(attribKey))||(attribKey='*::'+attribName,html4.ATTRIBS.hasOwnProperty(attribKey)))&&(atype=html4.ATTRIBS[attribKey]);if(atype!==null)switch(atype){case
html4.atype.NONE:break;case html4.atype.SCRIPT:case html4.atype.STYLE:value=null;break;case
html4.atype.ID:case html4.atype.IDREF:case html4.atype.IDREFS:case html4.atype.GLOBAL_NAME:case
html4.atype.LOCAL_NAME:case html4.atype.CLASSES:value=opt_nmTokenPolicy?opt_nmTokenPolicy(value):value;break;case
html4.atype.URI:parsedUri=(''+value).match(URI_SCHEME_RE),parsedUri?!parsedUri[1]||WHITELISTED_SCHEMES.test(parsedUri[1])?(value=opt_uriPolicy&&opt_uriPolicy(value)):(value=null):(value=null);break;case
html4.atype.URI_FRAGMENT:value&&'#'===value.charAt(0)?(value=opt_nmTokenPolicy?opt_nmTokenPolicy(value):value,value&&(value='#'+value)):(value=null);break;default:value=null}else
value=null;attribs[i+1]=value}return attribs})(htmlText,out),out.join('')}return{'escapeAttrib':escapeAttrib,'makeHtmlSanitizer':makeHtmlSanitizer,'makeSaxParser':makeSaxParser,'normalizeRCData':normalizeRCData,'sanitize':sanitize,'unescapeEntities':unescapeEntities}})(html4),html_sanitize=html.sanitize,typeof
window!=='undefined'&&(window.html=html,window.html_sanitize=html_sanitize)};

/* [end] feature=core */

/* [start] feature=gapi.util-globals */
gapi.util=window.gapi&&window.gapi.util||{};
;

/* [end] feature=gapi.util-globals */

/* [start] feature=gapi.util.getOrigin */
gapi.util.getOrigin=function(a){if(!a)return"";a=a.split("#")[0].split("?")[0];a=a.toLowerCase();a.indexOf("//")==0&&(a=window.location.protocol+a);a.indexOf("://")<0&&(a=window.location.protocol+"//"+a);var b=a.substring(a.indexOf("://")+3),c=b.indexOf("/");c!=-1&&(b=b.substring(0,c));var a=a.substring(0,a.indexOf("://")),c="",d=b.indexOf(":");if(d!=-1){var e=b.substring(d+1),b=b.substring(0,d);if(a==="http"&&e!=="80"||a==="https"&&e!=="443")c=":"+e}return a+"://"+b+c};
;

/* [end] feature=gapi.util.getOrigin */

/* [start] feature=rpc */
gadgets.rpctx=gadgets.rpctx||{};
if(!gadgets.rpctx.wpm){var testSyncPostMessage=false;
gadgets.rpctx.wpm=function(){var e,d;
var c=true;
function b(h,i,g){if(typeof window.addEventListener!="undefined"){window.addEventListener(h,i,g)
}else{if(typeof window.attachEvent!="undefined"){window.attachEvent("on"+h,i)
}}}function a(h,i,g){if(window.removeEventListener){window.removeEventListener(h,i,g)
}else{if(window.detachEvent){window.detachEvent("on"+h,i)
}}}function f(h){var i=gadgets.json.parse(h.data);
if(!i||!i.f){return
}var g=gadgets.rpc.getTargetOrigin(i.f);
if(c&&(typeof h.origin!=="undefined"?h.origin!==g:h.domain!==/^.+:\/\/([^:]+).*/.exec(g)[1])){return
}var g=h.origin;
if(testSyncPostMessage){window.setTimeout(function(){e(i,g)
},0)
}else{e(i,g)
}}return{getCode:function(){return"wpm"
},isParentVerifiable:function(){return true
},init:function(h,i){function g(k){var j=k&&k.rpc||{};
if(String(j.disableForceSecure)==="true"){c=false
}}gadgets.config.register("rpc",null,g);
e=h;
d=i;
b("message",f,false);
d("..",true);
return true
},setup:function(h,g){d(h,true);
return true
},call:function(h,k,j){var g=gadgets.rpc.getTargetOrigin(h);
var i=gadgets.rpc._getTargetWin(h);
if(g){testSyncPostMessage=true;
i.postMessage(gadgets.json.stringify(j),g);
testSyncPostMessage=false
}else{gadgets.error("No relay set (used as window.postMessage targetOrigin), cannot send cross-domain message")
}return true
}}
}()
};;
;
gadgets.rpctx=gadgets.rpctx||{};
if(!gadgets.rpctx.frameElement){gadgets.rpctx.frameElement=function(){var e="__g2c_rpc";
var b="__c2g_rpc";
var d;
var c;
function a(g,k,j){try{if(k!==".."){var f=window.frameElement;
if(typeof f[e]==="function"){if(typeof f[e][b]!=="function"){f[e][b]=function(l){d(gadgets.json.parse(l))
}
}f[e](gadgets.json.stringify(j));
return true
}}else{var i=document.getElementById(g);
if(typeof i[e]==="function"&&typeof i[e][b]==="function"){i[e][b](gadgets.json.stringify(j));
return true
}}}catch(h){}return false
}return{getCode:function(){return"fe"
},isParentVerifiable:function(){return false
},init:function(f,g){d=f;
c=g;
return true
},setup:function(j,f){if(j!==".."){try{var i=document.getElementById(j);
i[e]=function(k){d(gadgets.json.parse(k))
}
}catch(h){return false
}}if(j===".."){c("..",true);
var g=function(){window.setTimeout(function(){gadgets.rpc.call(j,gadgets.rpc.ACK)
},500)
};
gadgets.util.registerOnLoadHandler(g)
}return true
},call:function(f,h,g){return a(f,h,g)
}}
}()
};;
;
;
;
gadgets.rpctx=gadgets.rpctx||{};
if(!gadgets.rpctx.nix){gadgets.rpctx.nix=function(){var c="GRPC____NIXVBS_wrapper";
var d="GRPC____NIXVBS_get_wrapper";
var f="GRPC____NIXVBS_handle_message";
var b="GRPC____NIXVBS_create_channel";
var a=10;
var j=500;
var i={};
var h;
var g=0;
function e(){var l=i[".."];
if(l){return
}if(++g>a){gadgets.warn("Nix transport setup failed, falling back...");
h("..",false);
return
}if(!l&&window.opener&&"GetAuthToken" in window.opener){l=window.opener;
if(l.GetAuthToken()==gadgets.rpc.getAuthToken("..")){var k=gadgets.rpc.getAuthToken("..");
l.CreateChannel(window[d]("..",k),k);
i[".."]=l;
window.opener=null;
h("..",true);
return
}}window.setTimeout(function(){e()
},j)
}return{getCode:function(){return"nix"
},isParentVerifiable:function(){return false
},init:function(l,m){h=m;
if(typeof window[d]!=="unknown"){window[f]=function(o){window.setTimeout(function(){l(gadgets.json.parse(o))
},0)
};
window[b]=function(o,q,p){if(gadgets.rpc.getAuthToken(o)===p){i[o]=q;
h(o,true)
}};
var k="Class "+c+"\n Private m_Intended\nPrivate m_Auth\nPublic Sub SetIntendedName(name)\n If isEmpty(m_Intended) Then\nm_Intended = name\nEnd If\nEnd Sub\nPublic Sub SetAuth(auth)\n If isEmpty(m_Auth) Then\nm_Auth = auth\nEnd If\nEnd Sub\nPublic Sub SendMessage(data)\n "+f+"(data)\nEnd Sub\nPublic Function GetAuthToken()\n GetAuthToken = m_Auth\nEnd Function\nPublic Sub CreateChannel(channel, auth)\n Call "+b+"(m_Intended, channel, auth)\nEnd Sub\nEnd Class\nFunction "+d+"(name, auth)\nDim wrap\nSet wrap = New "+c+"\nwrap.SetIntendedName name\nwrap.SetAuth auth\nSet "+d+" = wrap\nEnd Function";
try{window.execScript(k,"vbscript")
}catch(n){return false
}}return true
},setup:function(o,k){if(o===".."){e();
return true
}try{var m=document.getElementById(o);
var n=window[d](o,k);
m.contentWindow.opener=n
}catch(l){return false
}return true
},call:function(k,n,m){try{if(i[k]){i[k].SendMessage(gadgets.json.stringify(m))
}}catch(l){return false
}return true
}}
}()
};;
;
gadgets.rpctx=gadgets.rpctx||{};
if(!gadgets.rpctx.rmr){gadgets.rpctx.rmr=function(){var h=500;
var f=10;
var i={};
var a=gadgets.util.getUrlParameters()["parent"];
var c;
var j;
function l(q,o,p,n){var r=function(){document.body.appendChild(q);
q.src="about:blank";
if(n){q.onload=function(){m(n)
}
}q.src=o+"#"+p
};
if(document.body){r()
}else{gadgets.util.registerOnLoadHandler(function(){r()
})
}}function d(q){if(typeof i[q]==="object"){return
}var r=document.createElement("iframe");
var o=r.style;
o.position="absolute";
o.top="0px";
o.border="0";
o.opacity="0";
o.width="10px";
o.height="1px";
r.id="rmrtransport-"+q;
r.name=r.id;
var p=gadgets.rpc.getRelayUrl(q);
var n=gadgets.rpc.getOrigin(a);
if(!p){p=n+"/robots.txt"
}i[q]={frame:r,receiveWindow:null,relayUri:p,relayOrigin:n,searchCounter:0,width:10,waiting:true,queue:[],sendId:0,recvId:0,verifySendToken:String(Math.random()),verifyRecvToken:null,originVerified:false};
if(q!==".."){l(r,p,b(q))
}e(q)
}function e(p){var r=null;
i[p].searchCounter++;
try{var o=gadgets.rpc._getTargetWin(p);
if(p===".."){r=o.frames["rmrtransport-"+gadgets.rpc.RPC_ID]
}else{r=o.frames["rmrtransport-.."]
}}catch(q){}var n=false;
if(r){n=g(p,r)
}if(!n){if(i[p].searchCounter>f){return
}window.setTimeout(function(){e(p)
},h)
}}function k(o,q,u,t){var p=null;
if(u!==".."){p=i[".."]
}else{p=i[o]
}if(p){if(q!==gadgets.rpc.ACK){p.queue.push(t)
}if(p.waiting||(p.queue.length===0&&!(q===gadgets.rpc.ACK&&t&&t.ackAlone===true))){return true
}if(p.queue.length>0){p.waiting=true
}var n=p.relayUri+"#"+b(o);
try{p.frame.contentWindow.location=n;
var r=p.width==10?20:10;
p.frame.style.width=r+"px";
p.width=r
}catch(s){return false
}}return true
}function b(o){var p=i[o];
var n={id:p.sendId};
if(p){n.d=Array.prototype.slice.call(p.queue,0);
var q={s:gadgets.rpc.ACK,id:p.recvId};
if(!p.originVerified){q.sendToken=p.verifySendToken
}if(p.verifyRecvToken){q.recvToken=p.verifyRecvToken
}n.d.push(q)
}return gadgets.json.stringify(n)
}function m(y){var v=i[y];
var r=v.receiveWindow.location.hash.substring(1);
var z=gadgets.json.parse(decodeURIComponent(r))||{};
var o=z.d||[];
var p=false;
var u=false;
var w=0;
var n=(v.recvId-z.id);
for(var q=0;
q<o.length;
++q){var t=o[q];
if(t.s===gadgets.rpc.ACK){j(y,true);
v.verifyRecvToken=t.sendToken;
if(!v.originVerified&&t.recvToken&&String(t.recvToken)==String(v.verifySendToken)){v.originVerified=true
}if(v.waiting){u=true
}v.waiting=false;
var s=Math.max(0,t.id-v.sendId);
v.queue.splice(0,s);
v.sendId=Math.max(v.sendId,t.id||0);
continue
}p=true;
if(++w<=n){continue
}++v.recvId;
c(t,v.originVerified?v.relayOrigin:undefined)
}if(p||(u&&v.queue.length>0)){var x=(y==="..")?gadgets.rpc.RPC_ID:"..";
k(y,gadgets.rpc.ACK,x,{ackAlone:p})
}}function g(q,t){var p=i[q];
try{var o=false;
o="document" in t;
if(!o){return false
}o=typeof t.document=="object";
if(!o){return false
}var s=t.location.href;
if(s==="about:blank"){return false
}}catch(n){return false
}p.receiveWindow=t;
function r(){m(q)
}if(typeof t.attachEvent==="undefined"){t.onresize=r
}else{t.attachEvent("onresize",r)
}if(q===".."){l(p.frame,p.relayUri,b(q),q)
}else{m(q)
}return true
}return{getCode:function(){return"rmr"
},isParentVerifiable:function(){return true
},init:function(n,o){c=n;
j=o;
return true
},setup:function(p,n){try{d(p)
}catch(o){gadgets.warn("Caught exception setting up RMR: "+o);
return false
}return true
},call:function(n,p,o){return k(n,o.s,p,o)
}}
}()
};;
;
gadgets.rpctx=gadgets.rpctx||{};
if(!gadgets.rpctx.ifpc){gadgets.rpctx.ifpc=function(){var h=[];
var e=0;
var d;
var a=2000;
var g={};
function c(m){var k=[];
for(var n=0,l=m.length;
n<l;
++n){k.push(encodeURIComponent(gadgets.json.stringify(m[n])))
}return k.join("&")
}function b(m){var k;
for(var j=h.length-1;
j>=0;
--j){var n=h[j];
try{if(n&&(n.recyclable||n.readyState==="complete")){n.parentNode.removeChild(n);
if(window.ActiveXObject){h[j]=n=null;
h.splice(j,1)
}else{n.recyclable=false;
k=n;
break
}}}catch(l){}}if(!k){k=document.createElement("iframe");
k.style.border=k.style.width=k.style.height="0px";
k.style.visibility="hidden";
k.style.position="absolute";
k.onload=function(){this.recyclable=true
};
h.push(k)
}k.src=m;
window.setTimeout(function(){document.body.appendChild(k)
},0)
}function f(j,l){for(var k=l-1;
k>=0;
--k){if(typeof j[k]==="undefined"){return false
}}return true
}return{getCode:function(){return"ifpc"
},isParentVerifiable:function(){return true
},init:function(i,j){d=j;
d("..",true);
return true
},setup:function(j,i){d(j,true);
return true
},call:function(s,r,q){var l=gadgets.rpc.getRelayUrl(s);
++e;
if(!l){gadgets.warn("No relay file assigned for IFPC");
return false
}var i=null,j=[];
if(q.l){var o=q.a;
i=[l,"#",c([r,e,1,0,c([r,q.s,"","",r].concat(o))])].join("");
j.push(i)
}else{i=[l,"#",s,"&",r,"@",e,"&"].join("");
var t=encodeURIComponent(gadgets.json.stringify(q)),n=a-i.length,p=Math.ceil(t.length/n),m=0,k;
while(t.length>0){k=t.substring(0,n);
t=t.substring(n);
j.push([i,p,"&",m,"&",k].join(""));
m+=1
}}do{b(j.shift())
}while(j.length>0);
return true
},_receiveMessage:function(i,n){var o=i[1],m=parseInt(i[2],10),k=parseInt(i[3],10),l=i[i.length-1],j=m===1;
if(m>1){if(!g[o]){g[o]=[]
}g[o][k]=l;
if(f(g[o],m)){l=g[o].join("");
delete g[o];
j=true
}}if(j){n(gadgets.json.parse(decodeURIComponent(l)))
}}}
}()
};;
if(!window.gadgets||!window.gadgets["rpc"]){gadgets.rpc=function(){var M="__cb";
var S="";
var T="__ack";
var f=500;
var G=10;
var b="|";
var u="callback";
var g="origin";
var r="referer";
var s="legacy__";
var q={};
var W={};
var D={};
var B={};
var z=0;
var l={};
var m={};
var d={};
var n={};
var E={};
var e=null;
var p=null;
var A=(window.top!==window.self);
var v=window.name;
var J=function(){};
var P=0;
var Y=1;
var a=2;
var x=window.console;
var V=x&&x.log&&function(ae){x.log(ae)
}||function(){};
var R=(function(){function ae(af){return function(){V(af+": call ignored")
}
}return{getCode:function(){return"noop"
},isParentVerifiable:function(){return true
},init:ae("init"),setup:ae("setup"),call:ae("call")}
})();
if(gadgets.util){d=gadgets.util.getUrlParameters()
}function K(){if(d.rpctx=="flash"){return gadgets.rpctx.flash
}if(d.rpctx=="rmr"){return gadgets.rpctx.rmr
}return typeof window.postMessage==="function"?gadgets.rpctx.wpm:typeof window.postMessage==="object"?gadgets.rpctx.wpm:window.ActiveXObject?(gadgets.rpctx.flash?gadgets.rpctx.flash:gadgets.rpctx.nix):navigator.userAgent.indexOf("WebKit")>0?gadgets.rpctx.rmr:navigator.product==="Gecko"?gadgets.rpctx.frameElement:gadgets.rpctx.ifpc
}function k(aj,ah){if(n[aj]){return
}var af=H;
if(!ah){af=R
}n[aj]=af;
var ae=E[aj]||[];
for(var ag=0;
ag<ae.length;
++ag){var ai=ae[ag];
ai.t=F(aj);
af.call(aj,ai.f,ai)
}E[aj]=[]
}var I=false,U=false;
function N(){if(U){return
}function ae(){I=true
}if(typeof window.addEventListener!="undefined"){window.addEventListener("unload",ae,false)
}else{if(typeof window.attachEvent!="undefined"){window.attachEvent("onunload",ae)
}}U=true
}function j(ae,ai,af,ah,ag){if(!B[ai]||B[ai]!==af){gadgets.error("Invalid auth token. "+B[ai]+" vs "+af);
J(ai,a)
}ag.onunload=function(){if(m[ai]&&!I){J(ai,Y);
gadgets.rpc.removeReceiver(ai)
}};
N();
ah=gadgets.json.parse(decodeURIComponent(ah))
}function Z(ai,af){if(ai&&typeof ai.s==="string"&&typeof ai.f==="string"&&ai.a instanceof Array){if(B[ai.f]){if(B[ai.f]!==ai.t){gadgets.error("Invalid auth token. "+B[ai.f]+" vs "+ai.t);
J(ai.f,a)
}}if(ai.s===T){window.setTimeout(function(){k(ai.f,true)
},0);
return
}if(ai.c){ai[u]=function(aj){var ak=ai.g?s:"";
gadgets.rpc.call(ai.f,ak+M,null,ai.c,aj)
}
}if(af){var ag=t(af);
ai[g]=af;
var ah=ai.r;
if(!ah||t(ah)!=ag){ah=af
}ai[r]=ah
}var ae=(q[ai.s]||q[S]).apply(ai,ai.a);
if(ai.c&&typeof ae!=="undefined"){gadgets.rpc.call(ai.f,M,null,ai.c,ae)
}}}function t(ag){if(!ag){return""
}ag=((ag.split("#"))[0].split("?"))[0];
ag=ag.toLowerCase();
if(ag.indexOf("//")==0){ag=window.location.protocol+ag
}if(ag.indexOf("://")==-1){ag=window.location.protocol+"//"+ag
}var ah=ag.substring(ag.indexOf("://")+3);
var ae=ah.indexOf("/");
if(ae!=-1){ah=ah.substring(0,ae)
}var aj=ag.substring(0,ag.indexOf("://"));
var ai="";
var ak=ah.indexOf(":");
if(ak!=-1){var af=ah.substring(ak+1);
ah=ah.substring(0,ak);
if((aj==="http"&&af!=="80")||(aj==="https"&&af!=="443")){ai=":"+af
}}return aj+"://"+ah+ai
}function C(af,ae){return"/"+af+(ae?b+ae:"")
}function y(ah){if(ah.charAt(0)=="/"){var af=ah.indexOf(b);
var ag=af>0?ah.substring(1,af):ah.substring(1);
var ae=af>0?ah.substring(af+1):null;
return{id:ag,origin:ae}
}else{return null
}}function ad(ag){if(typeof ag==="undefined"||ag===".."){return window.parent
}var af=y(ag);
if(af){return window.top.frames[af.id]
}ag=String(ag);
var ae=window.frames[ag];
if(ae){return ae
}ae=document.getElementById(ag);
if(ae&&ae.contentWindow){return ae.contentWindow
}return null
}function L(ah){var ag=null;
var ae=O(ah);
if(ae){ag=ae
}else{var af=y(ah);
if(af){ag=af.origin
}else{if(ah==".."){ag=d.parent
}else{ag=document.getElementById(ah).src
}}}return t(ag)
}var H=K();
q[S]=function(){V("Unknown RPC service: "+this.s)
};
q[M]=function(af,ae){var ag=l[af];
if(ag){delete l[af];
ag.call(this,ae)
}};
function X(ag,ae){if(m[ag]===true){return
}if(typeof m[ag]==="undefined"){m[ag]=0
}var af=ad(ag);
if(ag===".."||af!=null){if(H.setup(ag,ae)===true){m[ag]=true;
return
}}if(m[ag]!==true&&m[ag]++<G){window.setTimeout(function(){X(ag,ae)
},f)
}else{n[ag]=R;
m[ag]=true
}}function O(af){var ae=W[af];
if(ae&&ae.substring(0,1)==="/"){if(ae.substring(1,2)==="/"){ae=document.location.protocol+ae
}else{ae=document.location.protocol+"//"+document.location.host+ae
}}return ae
}function ac(af,ae,ag){if(ae&&!/http(s)?:\/\/.+/.test(ae)){if(ae.indexOf("//")==0){ae=window.location.protocol+ae
}else{if(ae.charAt(0)=="/"){ae=window.location.protocol+"//"+window.location.host+ae
}else{if(ae.indexOf("://")==-1){ae=window.location.protocol+"//"+ae
}}}}W[af]=ae;
if(typeof ag!=="undefined"){D[af]=!!ag
}}function F(ae){return B[ae]
}function c(ae,af){af=af||"";
B[ae]=String(af);
X(ae,af)
}function ab(af){var ae=af.passReferrer||"";
var ag=ae.split(":",2);
e=ag[0]||"none";
p=ag[1]||"origin"
}function aa(ae){if(Q(ae)){H=gadgets.rpctx.ifpc;
H.init(Z,k)
}}function Q(ae){return String(ae.useLegacyProtocol)==="true"
}function h(af,ae){function ag(aj){var ai=aj&&aj.rpc||{};
ab(ai);
var ah=ai.parentRelayUrl||"";
ah=t(d.parent||ae)+ah;
ac("..",ah,Q(ai));
aa(ai);
c("..",af)
}if(!d.parent&&ae){ag({});
return
}gadgets.config.register("rpc",null,ag)
}function o(af,aj,al){var ai=null;
if(af.charAt(0)!="/"){if(!gadgets.util){return
}ai=document.getElementById(af);
if(!ai){throw new Error("Cannot set up gadgets.rpc receiver with ID: "+af+", element not found.")
}}var ae=ai&&ai.src;
var ag=aj||gadgets.rpc.getOrigin(ae);
ac(af,ag);
var ak=gadgets.util.getUrlParameters(ae);
var ah=al||ak.rpctoken;
c(af,ah)
}function i(ae,ag,ah){if(ae===".."){var af=ah||d.rpctoken||d.ifpctok||"";
h(af,ag)
}else{o(ae,ag,ah)
}}function w(ag){if(e==="bidir"||(e==="c2p"&&ag==="..")||(e==="p2c"&&ag!=="..")){var af=window.location.href;
var ah="?";
if(p==="query"){ah="#"
}else{if(p==="hash"){return af
}}var ae=af.lastIndexOf(ah);
ae=ae===-1?af.length:ae;
return af.substring(0,ae)
}return null
}return{config:function(ae){if(typeof ae.securityCallback==="function"){J=ae.securityCallback
}},register:function(af,ae){if(af===M||af===T){throw new Error("Cannot overwrite callback/ack service")
}if(af===S){throw new Error("Cannot overwrite default service: use registerDefault")
}q[af]=ae
},unregister:function(ae){if(ae===M||ae===T){throw new Error("Cannot delete callback/ack service")
}if(ae===S){throw new Error("Cannot delete default service: use unregisterDefault")
}delete q[ae]
},registerDefault:function(ae){q[S]=ae
},unregisterDefault:function(){delete q[S]
},forceParentVerifiable:function(){if(!H.isParentVerifiable()){H=gadgets.rpctx.ifpc
}},call:function(ae,ag,al,aj){ae=ae||"..";
var ak="..";
if(ae===".."){ak=v
}else{if(ae.charAt(0)=="/"){ak=C(v,gadgets.rpc.getOrigin(window.location.href))
}}++z;
if(al){l[z]=al
}var ai={s:ag,f:ak,c:al?z:0,a:Array.prototype.slice.call(arguments,3),t:B[ae],l:!!D[ae]};
var af=w(ae);
if(af){ai.r=af
}if(ae!==".."&&y(ae)==null&&!document.getElementById(ae)){return
}var ah=n[ae];
if(!ah&&y(ae)!==null){ah=H
}if(ag.indexOf(s)===0){ah=H;
ai.s=ag.substring(s.length);
ai.c=ai.c?ai.c:z
}ai.g=true;
ai.r=ak;
if(!ah){if(!E[ae]){E[ae]=[ai]
}else{E[ae].push(ai)
}return
}if(D[ae]){ah=gadgets.rpctx.ifpc
}if(ah.call(ae,ak,ai)===false){n[ae]=R;
H.call(ae,ak,ai)
}},getRelayUrl:O,setRelayUrl:ac,setAuthToken:c,setupReceiver:i,getAuthToken:F,removeReceiver:function(ae){delete W[ae];
delete D[ae];
delete B[ae];
delete m[ae];
delete n[ae]
},getRelayChannel:function(){return H.getCode()
},receive:function(af,ae){if(af.length>4){H._receiveMessage(af,Z)
}else{j.apply(null,af.concat(ae))
}},receiveSameDomain:function(ae){ae.a=Array.prototype.slice.call(ae.a);
window.setTimeout(function(){Z(ae)
},0)
},getOrigin:t,getTargetOrigin:L,init:function(){if(H.init(Z,k)===false){H=R
}if(A){i("..")
}else{gadgets.config.register("rpc",null,function(af){var ae=af.rpc||{};
ab(ae);
aa(ae)
})
}},_getTargetWin:ad,_parseSiblingId:y,ACK:T,RPC_ID:v||"..",SEC_ERROR_LOAD_TIMEOUT:P,SEC_ERROR_FRAME_PHISH:Y,SEC_ERROR_FORGED_MSG:a}
}();
gadgets.rpc.init()
}else{if(!gadgets.rpc){gadgets.rpc=window.gadgets["rpc"];
gadgets.rpc.config=gadgets.rpc.config;
gadgets.rpc.register=gadgets.rpc.register;
gadgets.rpc.unregister=gadgets.rpc.unregister;
gadgets.rpc.registerDefault=gadgets.rpc.registerDefault;
gadgets.rpc.unregisterDefault=gadgets.rpc.unregisterDefault;
gadgets.rpc.forceParentVerifiable=gadgets.rpc.forceParentVerifiable;
gadgets.rpc.call=gadgets.rpc.call;
gadgets.rpc.getRelayUrl=gadgets.rpc.getRelayUrl;
gadgets.rpc.setRelayUrl=gadgets.rpc.setRelayUrl;
gadgets.rpc.setAuthToken=gadgets.rpc.setAuthToken;
gadgets.rpc.setupReceiver=gadgets.rpc.setupReceiver;
gadgets.rpc.getAuthToken=gadgets.rpc.getAuthToken;
gadgets.rpc.removeReceiver=gadgets.rpc.removeReceiver;
gadgets.rpc.getRelayChannel=gadgets.rpc.getRelayChannel;
gadgets.rpc.receive=gadgets.rpc.receive;
gadgets.rpc.receiveSameDomain=gadgets.rpc.receiveSameDomain;
gadgets.rpc.getOrigin=gadgets.rpc.getOrigin;
gadgets.rpc.getTargetOrigin=gadgets.rpc.getTargetOrigin;
gadgets.rpc._getTargetWin=gadgets.rpc._getTargetWin;
gadgets.rpc._parseSiblingId=gadgets.rpc._parseSiblingId
}};;
;

/* [end] feature=rpc */
(function(){var j=window['___jsl'];if(j['c']&&--j['o']<=0){j['c']();delete j['c'];delete j['o'];}})();