/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/Device','sap/ui/core/Component','sap/ui/core/ComponentContainer','sap/ui/core/HTML','sap/ui/core/UIComponent','sap/ui/core/mvc/Controller','sap/ui/core/routing/History','sap/ui/model/json/JSONModel','sap/m/library','sap/m/Text','../util/ToggleFullScreenHandler','../data','sap/ui/demokit/explored/view/base.controller',"sap/ui/fl/FakeLrepConnectorLocalStorage","sap/ui/fl/Utils"],function(q,D,C,a,H,U,b,c,J,m,T,d,e,B,F,f){"use strict";var S=B.extend("sap.ui.demokit.explored.view.sample",{onInit:function(){this.router=U.getRouterFor(this);this.router.attachRoutePatternMatched(this.onRouteMatched,this);this._viewModel=new J({showNavButton:true,showNewTab:false});this._initFakeLREP();this._loadRuntimeAuthoring();this.getView().setModel(this._viewModel);this.getView().addEventDelegate({onBeforeFirstShow:q.proxy(this._applyViewConfigurations,this)});},onRouteMatched:function(E){if(this._oRTA){this._oRTA.destroy();this._oRTA=null;}if(E.getParameter("name")!=="sample"){return;}var M=this._viewModel.getData();this._sId=E.getParameter("arguments").id;var s=e.samples[this._sId];if(!s){this.router.myNavToWithoutHash("sap.ui.demokit.explored.view.notFound","XML",false,{path:this._sId});return;}var p=this.getView().byId("page");var h=c.getInstance();var P=h.getPreviousHash();M.showNavButton=D.system.phone||!!P;M.previousSampleId=s.previousSampleId;M.nextSampleId=s.nextSampleId;p.setTitle("Sample: "+s.name);var o;try{o=this._createComponent();}catch(i){p.removeAllContent();p.addContent(new T({text:"Error while loading the sample: "+i}));return;}var j=(this._oComp.getMetadata())?this._oComp.getMetadata().getConfig():null;var k=j&&j.sample||{};M.showNewTab=!!k.iframe;if(k.iframe){o=this._createIframe(k.iframe);}else{this.sIFrameUrl=null;}var l=!!k.stretch;var n=l?"100%":null;p.setEnableScrolling(!l);if(o.setHeight){o.setHeight(n);}p.removeAllContent();p.addContent(o);p.scrollTo(0);this._viewModel.setData(M);},onNewTab:function(){m.URLHelper.redirect(this.sIFrameUrl,true);},onPreviousSample:function(E){this.router.navTo("sample",{id:this._viewModel.getProperty("/previousSampleId")},true);},onNextSample:function(E){this.router.navTo("sample",{id:this._viewModel.getProperty("/nextSampleId")},true);},_createIframe:function(i){var s=this._sId;if(typeof i==="string"){this.sIFrameUrl=S._createIFrameURL(i,s);}else{q.sap.log.error("no iframe source was provided");return null;}var h=sap.ui.getCore().byId("sampleFrame");if(h){h.destroy();}h=new H({id:"sampleFrame",content:'<iframe src="'+this.sIFrameUrl+'" id="sampleFrame" frameBorder="0"></iframe>'}).addEventDelegate({onAfterRendering:function(){h.$().on("load",function(){var o=h.$()[0].contentWindow;if(!o.sap){return;}o.sap.ui.getCore().attachInit(function(){var o=h.$()[0].contentWindow;o.sap.ui.getCore().applyTheme(sap.ui.getCore().getConfiguration().getTheme());o.jQuery('body').toggleClass("sapUiSizeCompact",q("body").hasClass("sapUiSizeCompact")).toggleClass("sapUiSizeCozy",q("body").hasClass("sapUiSizeCozy"));});});}});return h;},_createComponent:function(){var s='sampleComp-'+this._sId;var h=this._sId;this._oComp=sap.ui.component(s);if(this._oComp){this._oComp.destroy();}this._oComp=sap.ui.getCore().createComponent({id:s,name:h});return new a({component:this._oComp});},onNavBack:function(E){if(this._oComp&&this._oComp.exit){this._oComp.exit();}this.router.myNavBack("home",{});},onNavToCode:function(h){this.router.navTo("code",{id:this._sId},false);},onToggleFullScreen:function(E){d.updateMode(E,this.getView());},_initFakeLREP:function(){f.checkControlId=function(){return true;};F.enableFakeConnector({"isProductiveSystem":true});},_loadRuntimeAuthoring:function(){try{sap.ui.require(["sap/ui/rta/RuntimeAuthoring"],function(h){this.getView().byId("toggleRTA").setVisible(true);}.bind(this));}catch(E){q.sap.log.info("sap.ui.rta.RuntimeAuthoring could not be loaded, UI adaptation mode is disabled");}},onAdaptUI:function(E){sap.ui.require(["sap/ui/rta/RuntimeAuthoring"],function(h){if(!this._oRTA){this._oRTA=new h({flexSettings:{developerMode:false}});this._oRTA.setRootControl(this.getView().byId("page").getContent()[0]);this._oRTA.start();}}.bind(this));}});var R=/\/([^\/]*)$/,g=/\..+$/;S._createIFrameURL=function(i,s){var h=R.exec(i);var j=(h&&h.length>1?h[1]:i);var k=g.exec(j)[0];var I=i.replace(g,"");I=q.sap.getModulePath(s+"."+I,k||".html");var l=window.location.search,t="sap-ui-theme="+sap.ui.getCore().getConfiguration().getTheme();if(l&&l!=="?"){var r=/sap-ui-theme=[a-z0-9\-\_]+/;if(l.match(r)){l=l.replace(r,t);}else{l+="&"+t;}}else{l="?"+t;}if(i.indexOf("?")>-1){l=l.replace("?","&");}return I+l;};return S;});
