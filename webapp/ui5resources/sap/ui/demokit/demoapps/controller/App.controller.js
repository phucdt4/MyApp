/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/mvc/Controller","jquery.sap.global","sap/ui/demokit/demoapps/model/sourceFileDownloader","sap/ui/demokit/demoapps/model/formatter","sap/m/MessageBox","sap/m/MessageToast","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/library"],function(C,$,s,f,M,a,F,b){"use strict";return C.extend("sap.ui.demokit.demoapps.controller.App",{formatter:f,onDownloadButtonPress:function(e){var d=this.byId("downloadDialog");this._oDownloadButton=e.getSource();d.getBinding("items").filter([]);d.open();d._oDialog.setContentHeight("");},onSearch:function(e){e.getParameters().itemsBinding.filter([new F("name",b.Contains,e.getParameters().value)]);},onDownloadPress:function(e){var S=e.getParameters().selectedItem,l=S?S:e.getSource().getParent();this._oDownloadButton.setBusy(true);sap.ui.require(["sap/ui/core/util/File","sap/ui/thirdparty/jszip"],function(o){var z=new JSZip();$.getJSON(l.data("config"),function(c){var d=c.files,p=[],g=[];d.forEach(function(h){var P=s(c.cwd+h);P.then(function(i){if(i.errorMessage){g.push(i.errorMessage);}else{z.file(h,i,{base64:false,binary:true});}});p.push(P);});Promise.all(p).then(function(){if(g.length){var h=g.reduce(function(E,j){return E+j+"\n";},"Could not locate the following download files:\n");this._handleError(h);}this._oDownloadButton.setBusy(false);a.show("Downloading for app \""+l.getLabel()+"\" has been started");var i=z.generate({type:"blob"});this._createArchive(o,i,l.getLabel());}.bind(this));}.bind(this));}.bind(this));},createDemoAppRow:function(i,B){var o;if(!B.getObject().categoryId){if(B.getObject().teaser){try{jQuery.sap.registerResourcePath("test-resources","test-resources");var r=jQuery.sap.getResourcePath(B.getObject().teaser);var t=sap.ui.xmlfragment(i,r);o=sap.ui.xmlfragment(i,"sap.ui.demokit.demoapps.view.BlockLayoutTeaserCell",this);o.getContent()[0].addContent(t);jQuery.sap.registerResourcePath("test-resources",null);}catch(e){jQuery.sap.log.warning("Teaser for demo app \""+B.getObject().name+"\" could not be loaded: "+e);o=sap.ui.xmlfragment(i,"sap.ui.demokit.demoapps.view.BlockLayoutCell",this);}}else{o=sap.ui.xmlfragment(i,"sap.ui.demokit.demoapps.view.BlockLayoutCell",this);}}else{o=sap.ui.xmlfragment(i,"sap.ui.demokit.demoapps.view.BlockLayoutHeadlineCell",this);}o.setBindingContext(B);return o;},_createArchive:function(o,c,d){o.save(c,d,"zip","application/zip");},_handleError:function(e){M.error(e);}});});