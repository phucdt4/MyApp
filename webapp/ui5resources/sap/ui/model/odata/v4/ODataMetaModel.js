/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/model/BindingMode","sap/ui/model/ChangeReason","sap/ui/model/ClientListBinding","sap/ui/model/ClientPropertyBinding","sap/ui/model/ContextBinding","sap/ui/model/Context","sap/ui/model/FilterProcessor","sap/ui/model/MetaModel","sap/ui/model/odata/OperationMode","sap/ui/model/odata/type/Int64","sap/ui/thirdparty/URI","./lib/_Helper","./lib/_SyncPromise","./ValueListType"],function(q,B,C,a,b,c,d,F,M,O,I,U,_,f,V){"use strict";var g,D=q.sap.log.Level.DEBUG,h,j,s="sap.ui.model.odata.v4.ODataMetaModel",k,r=/\([^/]*|\/-?\d+/g,l=/^-?\d+$/,S={messageChange:true},u={"Edm.Boolean":{type:"sap.ui.model.odata.type.Boolean"},"Edm.Byte":{type:"sap.ui.model.odata.type.Byte"},"Edm.Date":{type:"sap.ui.model.odata.type.Date"},"Edm.DateTimeOffset":{constraints:{"$Precision":"precision"},type:"sap.ui.model.odata.type.DateTimeOffset"},"Edm.Decimal":{constraints:{"@Org.OData.Validation.V1.Minimum":"minimum","@Org.OData.Validation.V1.Minimum@Org.OData.Validation.V1.Exclusive":"minimumExclusive","@Org.OData.Validation.V1.Maximum":"maximum","@Org.OData.Validation.V1.Maximum@Org.OData.Validation.V1.Exclusive":"maximumExclusive","$Precision":"precision","$Scale":"scale"},type:"sap.ui.model.odata.type.Decimal"},"Edm.Double":{type:"sap.ui.model.odata.type.Double"},"Edm.Guid":{type:"sap.ui.model.odata.type.Guid"},"Edm.Int16":{type:"sap.ui.model.odata.type.Int16"},"Edm.Int32":{type:"sap.ui.model.odata.type.Int32"},"Edm.Int64":{type:"sap.ui.model.odata.type.Int64"},"Edm.SByte":{type:"sap.ui.model.odata.type.SByte"},"Edm.Single":{type:"sap.ui.model.odata.type.Single"},"Edm.String":{constraints:{"@com.sap.vocabularies.Common.v1.IsDigitSequence":"isDigitSequence","$MaxLength":"maxLength"},type:"sap.ui.model.odata.type.String"},"Edm.TimeOfDay":{constraints:{"$Precision":"precision"},type:"sap.ui.model.odata.type.TimeOfDay"}},v="@com.sap.vocabularies.Common.v1.ValueListMapping",m={},p="@com.sap.vocabularies.Common.v1.ValueListReferences",t="@com.sap.vocabularies.Common.v1.ValueListWithFixedValues",W=q.sap.log.Level.WARNING;function w(e,i){q.sap.log.error(e,i,s);throw new Error(i+": "+e);}function x(o,e,i,L){var P,n;function G(R){var H,K;if(!(i in R)){L(W,n," does not contain ",i);return;}L(D,"Including ",i," from ",n);for(K in R){if(K[0]!=="$"&&A(K)===i){H=R[K];e[K]=H;z(H,e.$Annotations);}}}if(i in e){return e[i];}n=o.mSchema2MetadataUrl[i];if(n){L(D,"Namespace ",i," found in $Include of ",n);P=o.mMetadataUrl2Promise[n];if(!P){L(D,"Reading ",n);P=o.mMetadataUrl2Promise[n]=f.resolve(o.oRequestor.read(n)).then(o.validate.bind(o,n));}P=P.then(G);if(i in e){return e[i];}e[i]=P;return P;}}function y(T,e){if(T===e){return"";}if(T.indexOf(e)===0&&T[e.length]==="#"&&T.indexOf("@",e.length)<0){return T.slice(e.length+1);}}function z(o,e){var T;for(T in o.$Annotations){if(T in e){q.extend(e[T],o.$Annotations[T]);}else{e[T]=o.$Annotations[T];}}delete o.$Annotations;}function A(Q){return Q.slice(0,Q.lastIndexOf(".")+1);}h=c.extend("sap.ui.model.odata.v4.ODataMetaContextBinding",{constructor:function(o,P,e){c.call(this,o,P,e);},initialize:function(){var e=this.oModel.createBindingContext(this.sPath,this.oContext);this.bInitial=false;if(e!==this.oElementContext){this.oElementContext=e;this._fireChange();}},setContext:function(o){if(o!==this.oContext){this.oContext=o;if(!this.bInitial){this.initialize();}}}});j=a.extend("sap.ui.model.odata.v4.ODataMetaListBinding",{constructor:function(){a.apply(this,arguments);},_fireFilter:function(){},_fireSort:function(){},checkUpdate:function(e){var P=this.oList.length;this.update();if(e||this.oList.length!==P){this._fireChange({reason:C.Change});}},fetchContexts:function(){var i,R=this.oModel.resolve(this.sPath,this.oContext),e=this;if(!R){return f.resolve([]);}i=R.slice(-1)==="@";if(!i&&R!=="/"){R+="/";}return this.oModel.fetchObject(R).then(function(o){if(!o){return[];}if(i){R=R.slice(0,-1);}return Object.keys(o).filter(function(K){return K[0]!=="$"&&i!==(K[0]!=="@");}).map(function(K){return new d(e.oModel,R+K);});});},getContexts:function(i,L){this.iCurrentStart=i||0;this.iCurrentLength=Math.min(L||Infinity,this.iLength,this.oModel.iSizeLimit);return this.getCurrentContexts();},getCurrentContexts:function(){var e=[],i,n=this.iCurrentStart+this.iCurrentLength;for(i=this.iCurrentStart;i<n;i++){e.push(this.oList[this.aIndices[i]]);}return e;},setContexts:function(e){this.oList=e;this.updateIndices();this.applyFilter();this.applySort();this.iLength=this._getLength();},update:function(){var e=[],P=this.fetchContexts(),i=this;if(P.isFulfilled()){e=P.getResult();}else{P.then(function(e){i.setContexts(e);i._fireChange({reason:C.Change});});}this.setContexts(e);}});k=b.extend("sap.ui.model.odata.v4.ODataMetaPropertyBinding",{constructor:function(){b.apply(this,arguments);},_getValue:function(){var P,e=this;P=this.oModel.fetchObject(this.sPath,this.oContext,this.mParameters);if(P.isFulfilled()){return P.getResult();}P.then(function(){e.checkUpdate();});return undefined;},checkUpdate:function(e){var i=this._getValue();if(e||i!==this.oValue){this.oValue=i;this._fireChange({reason:C.Change});}},setValue:function(){throw new Error("Unsupported operation: ODataMetaPropertyBinding#setValue");}});var E=M.extend("sap.ui.model.odata.v4.ODataMetaModel",{constructor:function(R,e,i,o,n){M.call(this);this.aAnnotationUris=i&&!Array.isArray(i)?[i]:i;this.sDefaultBindingMode=B.OneTime;this.dLastModified=new Date(0);this.oMetadataPromise=null;this.oModel=o;this.mMetadataUrl2Promise={};this.oRequestor=R;this.mSchema2MetadataUrl={};this.mSupportedBindingModes={"OneTime":true,"OneWay":true};this.bSupportReferences=n!==false;this.sUrl=e;}});E.prototype._mergeAnnotations=function(e,n){var o=this;this.validate(this.sUrl,e);e.$Annotations={};Object.keys(e).forEach(function(i){if(e[i].$kind==="Schema"){o.mSchema2MetadataUrl[i]=o.sUrl;z(e[i],e.$Annotations);}});n.forEach(function(G,i){var H,Q;o.validate(o.aAnnotationUris[i],G);for(Q in G){if(Q[0]!=="$"){if(Q in e){w("A schema cannot span more than one document: "+Q,o.aAnnotationUris[i]);}H=G[Q];e[Q]=H;if(H.$kind==="Schema"){o.mSchema2MetadataUrl[Q]=o.aAnnotationUris[i];z(H,e.$Annotations);}}}});};E.prototype.attachEvent=function(e){if(!(e in S)){throw new Error("Unsupported event '"+e+"': v4.ODataMetaModel#attachEvent");}return M.prototype.attachEvent.apply(this,arguments);};E.prototype.bindContext=function(P,o){return new h(this,P,o);};E.prototype.bindList=function(P,o,e,i){return new j(this,P,o,e,i);};E.prototype.bindProperty=function(P,o,e){return new k(this,P,o,e);};E.prototype.bindTree=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#bindTree");};E.prototype.fetchCanonicalPath=function(o){return this.fetchUpdateData("",o).then(function(R){if(R.propertyPath){throw new Error("Context "+o.getPath()+" does not point to an entity. It should be "+R.entityPath);}return"/"+R.editUrl;});};E.prototype.fetchEntityContainer=function(){var P,e=this;if(!this.oMetadataPromise){P=[f.resolve(this.oRequestor.read(this.sUrl))];if(this.aAnnotationUris){this.aAnnotationUris.forEach(function(i){P.push(f.resolve(e.oRequestor.read(i,true)));});}this.oMetadataPromise=f.all(P).then(function(i){var n=i[0];e._mergeAnnotations(n,i.slice(1));return n;});}return this.oMetadataPromise;};E.prototype.fetchModule=function(e){var i;e=e.replace(/\./g,"/");i=sap.ui.require(e);if(i){return f.resolve(i);}return f.resolve(new Promise(function(n,o){sap.ui.require([e],n);}));};E.prototype.fetchObject=function(P,n,G){var R=this.resolve(P,n),H=this;if(!R){q.sap.log.error("Invalid relative path w/o context",P,s);return f.resolve(null);}return this.fetchEntityContainer().then(function(J){var L,N,K=true,Q,T,X,Y=J;function Z(i,P){var o,e1=i.indexOf("@",2);if(e1>-1){return a1(W,"Unsupported path after ",i.slice(0,e1));}i=i.slice(2);o=i[0]==="."?q.sap.getObject(i.slice(1),undefined,G.scope):q.sap.getObject(i);if(typeof o!=="function"){return a1(W,i," is not a function but: "+o);}try{Y=o(Y,{context:new d(H,P),schemaChildName:T});}catch(e){a1(W,"Error calling ",i,": ",e);}return false;}function $(o){return o&&typeof o.then==="function";}function a1(i){var e;if(q.sap.log.isLoggable(i,s)){e=Array.isArray(L)?L.join("/"):L;q.sap.log[i===D?"debug":"warning"](Array.prototype.slice.call(arguments,1).join("")+(e?" at /"+e:""),R,s);}if(i===W){Y=undefined;}return false;}function b1(e,i){var o;function e1(){L=L||X&&i&&X+"/"+i;return a1.apply(this,arguments);}if(H.bSupportReferences&&!(e in J)){o=A(e);Y=x(H,J,o,e1);}if(e in J){X=N=T=e;Y=Q=J[T];if(!$(Y)){return true;}}if($(Y)&&Y.isPending()){return e1(D,"Waiting for ",o);}return e1(W,"Unknown qualified name ",e);}function c1(e,i,o){var e1,f1;if(e==="$Annotations"){return a1(W,"Invalid segment: $Annotations");}if(Y!==J&&typeof Y==="object"&&e in Y){if(e[0]==="$"||l.test(e)){K=false;}}else{e1=e.indexOf("@@");if(e1<0){if(e.length>11&&e.slice(-11)==="@sapui.name"){e1=e.length-11;}else{e1=e.indexOf("@");}}if(e1>0){if(!c1(e.slice(0,e1),i,o)){return false;}e=e.slice(e1);f1=true;}if(typeof Y==="string"&&!(f1&&e[0]==="@"&&(e==="@sapui.name"||e[1]==="@"))&&!d1(Y,o.slice(0,i))){return false;}if(K){if(e[0]==="$"||l.test(e)){K=false;}else if(!f1){if(e[0]!=="@"&&e.indexOf(".")>0){return b1(e);}else if(Y&&"$Type"in Y){if(!b1(Y.$Type,"$Type")){return false;}}else if(Y&&"$Action"in Y){if(!b1(Y.$Action,"$Action")){return false;}}else if(Y&&"$Function"in Y){if(!b1(Y.$Function,"$Function")){return false;}}else if(i===0){X=N=T=T||J.$EntityContainer;Y=Q=Q||J[T];if(e&&e[0]!=="@"&&!(e in Q)){return a1(W,"Unknown child ",e," of ",T);}}if(Array.isArray(Y)){if(Y.length!==1){return a1(W,"Unsupported overloads");}Y=Y[0].$ReturnType;X=X+"/0/$ReturnType";if(Y){if(e==="value"&&!(J[Y.$Type]&&J[Y.$Type].value)){N=undefined;return true;}if(!b1(Y.$Type,"$Type")){return false;}}}}}if(!e){return i+1>=o.length||a1(W,"Invalid empty segment");}if(e[0]==="@"){if(e==="@sapui.name"){Y=N;if(Y===undefined){a1(W,"Unsupported path before @sapui.name");}else if(i+1<o.length){a1(W,"Unsupported path after @sapui.name");}return false;}if(e[1]==="@"){if(i+1<o.length){return a1(W,"Unsupported path after ",e);}return Z(e,"/"+o.slice(0,i).join("/")+"/"+o[i].slice(0,e1));}}if(!Y||typeof Y!=="object"){Y=undefined;return a1(D,"Invalid segment: ",e);}if(K&&e[0]==="@"){Y=(J.$Annotations||{})[X]||{};K=false;}}if(e!=="@"){N=K||e[0]==="@"?e:undefined;X=K?X+"/"+e:undefined;Y=Y[e];}return true;}function d1(e,i){var o;if(L){return a1(W,"Invalid recursion");}L=i;K=true;Y=J;o=e.split("/").every(c1);L=undefined;return o;}d1(R.slice(1));if($(Y)){Y=Y.then(function(){return H.fetchObject(P,n,G);});}return Y;});};E.prototype.fetchUI5Type=function(P){var o=this.getMetaContext(P),e=this;if(q.sap.endsWith(P,"/$count")){g=g||new I();return f.resolve(g);}return this.fetchObject(undefined,o).then(function(i){var n,N,T=i["$ui5.type"],G,H="sap.ui.model.odata.type.Raw";function J(K,L){if(L!==undefined){n=n||{};n[K]=L;}}if(T){return T;}if(i.$isCollection){q.sap.log.warning("Unsupported collection type, using "+H,P,s);}else{G=u[i.$Type];if(G){H=G.type;for(N in G.constraints){J(G.constraints[N],N[0]==="@"?e.getObject(N,o):i[N]);}if(i.$Nullable===false){J("nullable",false);}}else{q.sap.log.warning("Unsupported type '"+i.$Type+"', using "+H,P,s);}}i["$ui5.type"]=e.fetchModule(H).then(function(K){T=new K(undefined,n);i["$ui5.type"]=T;return T;});return i["$ui5.type"];});};E.prototype.fetchUpdateData=function(P,o){var R=this.resolve(P,o),e=this;function n(i){q.sap.log.error(i,R,s);throw new Error(R+": "+i);}return this.fetchObject(this.getMetaPath(R)).then(function(){return e.fetchEntityContainer();}).then(function(G){var H,J=G[G.$EntityContainer],K,L,N,Q,T,X,Y=false,Z;function $(){H.push({path:Q,prefix:H.pop(),type:Z});}function a1(c1){var i=c1.indexOf("(");return i>=0?c1.slice(i):"";}function b1(c1){var i=c1.indexOf("(");return i>=0?c1.slice(0,i):c1;}X=R.slice(1).split("/");H=[X.shift()];Q="/"+H[0];K=Q;N=decodeURIComponent(b1(H[0]));L=J[N];if(!L){n("Not an entity set: "+N);}Z=G[L.$Type];P="";T="";X.forEach(function(i){var c1,d1;Q+="/"+i;if(l.test(i)){$();K+="/"+i;}else{d1=decodeURIComponent(b1(i));T=_.buildPath(T,d1);c1=Z[d1];if(!c1){n("Not a (navigation) property: "+d1);}Z=G[c1.$Type];if(c1.$kind==="NavigationProperty"){if(T in L.$NavigationPropertyBinding){N=L.$NavigationPropertyBinding[T];L=J[N];T="";H=[encodeURIComponent(N)+a1(i)];if(!c1.$isCollection){$();}}else{H.push(i);}K=Q;P="";}else{P=_.buildPath(P,i);}}});return f.all(H.map(function(i){if(typeof i==="string"){return i;}return o.fetchValue(i.path).then(function(c1){if(!c1){n("No instance to calculate key predicate at "+i.path);}if("@$ui5.transient"in c1){Y=true;return undefined;}if(!c1["@$ui5.predicate"]){n("No key predicate known at "+i.path);}return i.prefix+c1["@$ui5.predicate"];},function(c1){n(c1.message+" at "+i.path);});})).then(function(i){return{editUrl:Y?undefined:i.join("/"),entityPath:K,propertyPath:P};});});};E.prototype.fetchValueListMappings=function(o,n,P){var e=this,i=o.getMetaModel();return i.fetchEntityContainer().then(function(G){var H,J=G.$Annotations,K={},L=e===i,T;T=Object.keys(J).filter(function(N){if(_.namespace(N)===n){if(e.getObject("/"+N)===P){return true;}if(!L){throw new Error("Unexpected annotation target '"+N+"' with namespace of data service in "+o.sServiceUrl);}}return false;});if(!T.length){throw new Error("No annotation '"+v.slice(1)+"' in "+o.sServiceUrl);}H=J[T[0]];Object.keys(H).forEach(function(N){var Q=y(N,v);if(Q!==undefined){K[Q]=H[N];}else if(!L){throw new Error("Unexpected annotation '"+N.slice(1)+"' for target '"+T[0]+"' with namespace of data service in "+o.sServiceUrl);}});return K;});};E.prototype.fetchValueListType=function(P){var o=this.getMetaContext(P),e=this;return this.fetchObject(undefined,o).then(function(i){var n,T;if(!i){throw new Error("No metadata for "+P);}n=e.getObject("@",o);if(n[t]){return V.Fixed;}for(T in n){if(y(T,p)!==undefined||y(T,v)!==undefined){return V.Standard;}}return V.None;});};E.prototype.getLastModified=function(){return this.dLastModified;};E.prototype.getMetaContext=function(P){return new d(this,this.getMetaPath(P));};E.prototype.getMetaPath=function(P){return P.replace(r,"");};E.prototype.getOrCreateValueListModel=function(e){var i=new U(this.sUrl).absoluteTo(document.baseURI).pathname().toString(),o,n;n=new U(e).absoluteTo(i).filename("").toString();o=m[n];if(!o){o=new this.oModel.constructor({operationMode:O.Server,serviceUrl:n,synchronizationMode:"None"});o.setDefaultBindingMode(B.OneWay);m[n]=o;o.oRequestor.mHeaders["X-CSRF-Token"]=this.oModel.oRequestor.mHeaders["X-CSRF-Token"];}return o;};E.prototype.getOriginalProperty=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#getOriginalProperty");};E.prototype.getObject=f.createGetMethod("fetchObject");E.prototype.getProperty=E.prototype.getObject;E.prototype.getUI5Type=f.createGetMethod("fetchUI5Type",true);E.prototype.getValueListType=f.createGetMethod("fetchValueListType",true);E.prototype.isList=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#isList");};E.prototype.refresh=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#refresh");};E.prototype.requestObject=f.createRequestMethod("fetchObject");E.prototype.requestUI5Type=f.createRequestMethod("fetchUI5Type");E.prototype.requestValueListType=f.createRequestMethod("fetchValueListType");E.prototype.requestValueListInfo=function(P){var e=this.getMetaPath(P),T=e.slice(0,e.lastIndexOf("/")+1),i=this;return Promise.all([this.requestObject(T+"@sapui.name"),this.requestObject(e),this.requestObject(e+"@"),this.requestObject(e+t)]).then(function(R){var n=R[2],o=R[3],G={},N=_.namespace(R[0]),H=R[1],J={};function K(L,Q,X,Y){if(G[Q]){throw new Error("Annotations '"+v.slice(1)+"' with identical qualifier '"+Q+"' for property "+P+" in "+G[Q]+" and "+X);}if(o&&J[""]){throw new Error("Annotation '"+t.slice(1)+"' but multiple '"+v.slice(1)+"' for property "+P);}G[Q]=X;J[o?"":Q]=q.extend(true,{$model:Y},L);}if(!H){throw new Error("No metadata for "+P);}Object.keys(n).filter(function(L){return y(L,v)!==undefined;}).forEach(function(L){K(n[L],y(L,v),i.sUrl,i.oModel);});return Promise.all(Object.keys(n).filter(function(L){return y(L,p)!==undefined;}).map(function(L){var Q=n[L];return Promise.all(Q.map(function(X){var Y=i.getOrCreateValueListModel(X);return i.fetchValueListMappings(Y,N,H).then(function(Z){Object.keys(Z).forEach(function($){K(Z[$],$,X,Y);});});}));})).then(function(){if(!Object.keys(J).length){throw new Error("No annotation '"+p.slice(1)+"' for "+P);}return J;});});};E.prototype.resolve=function(P,o){var e,i;if(!P){return o?o.getPath():undefined;}i=P[0];if(i==="/"){return P;}if(!o){return undefined;}if(i==="."){if(P[1]!=="/"){throw new Error("Unsupported relative path: "+P);}P=P.slice(2);}e=o.getPath();return i==="@"||e.slice(-1)==="/"?e+P:e+"/"+P;};E.prototype.setLegacySyntax=function(){throw new Error("Unsupported operation: v4.ODataMetaModel#setLegacySyntax");};E.prototype.toString=function(){return s+": "+this.sUrl;};E.prototype.validate=function(e,n){var i,L,o,R,G;if(!this.bSupportReferences){return n;}for(G in n.$Reference){R=n.$Reference[G];G=new U(G).absoluteTo(this.sUrl).toString();if("$IncludeAnnotations"in R){w("Unsupported IncludeAnnotations",e);}for(i in R.$Include){o=R.$Include[i];if(o in n){w("A schema cannot span more than one document: "+o+" - is both included and defined",e);}else if(o in this.mSchema2MetadataUrl&&this.mSchema2MetadataUrl[o]!==G){w("A schema cannot span more than one document: "+o+" - expected reference URI "+this.mSchema2MetadataUrl[o]+" but instead saw "+G,e);}this.mSchema2MetadataUrl[o]=G;}}L=n.$LastModified?new Date(n.$LastModified):new Date();if(this.dLastModified<L){this.dLastModified=L;}delete n.$LastModified;return n;};return E;},true);
