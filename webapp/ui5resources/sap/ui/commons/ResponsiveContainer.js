/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/ResizeHandler'],function(q,l,C,R){"use strict";var a=C.extend("sap.ui.commons.ResponsiveContainer",{metadata:{library:"sap.ui.commons",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:'100%'}},aggregations:{ranges:{type:"sap.ui.commons.ResponsiveContainerRange",multiple:true,singularName:"range"},content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{defaultContent:{type:"sap.ui.core.Control",multiple:false}},events:{rangeSwitch:{parameters:{currentRange:{type:"sap.ui.commons.ResponsiveContainerRange"}}}}}});a.prototype.init=function(){this.oCurrentRange=null;};a.prototype.exit=function(){if(this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}};a.prototype.onBeforeRendering=function(){if(this.sResizeListenerId){R.deregister(this.sResizeListenerId);this.sResizeListenerId=null;}if(!this.getAggregation("content")){var d=sap.ui.getCore().byId(this.getDefaultContent());this.setAggregation("content",d);}};a.prototype.onAfterRendering=function(){var r=q.proxy(this.onresize,this);this.sResizeListenerId=R.register(this.getDomRef(),r);this.refreshRangeDimensions();if(!this.oCurrentRange){setTimeout(r,0);}};a.prototype.onresize=function(e){var r=this.findMatchingRange(),c=r&&r.getContent(),n;if(this.oCurrentRange!=r){this.oCurrentRange=r;if(!r){c=this.getDefaultContent();}n=sap.ui.getCore().byId(c);this.setAggregation("content",n);this.fireRangeSwitch({currentRange:this.oCurrentRange});}};a.prototype.refreshRangeDimensions=function(){var r=this.getRanges(),b=[],$;q.each(r,function(i,o){$=o.$();b.push({range:o,width:$.width(),height:$.height()});});this.aRangeDimensions=b;};a.prototype.findMatchingRange=function(){var c=this.$(),w=c.width(),h=c.height(),r,b,d=this.aRangeDimensions,m=null;q.each(d,function(i,o){r=o.width||w;b=o.height||h;if(r<=w&&b<=h){o.area=r*b;if(!m||m.area<o.area){m=o;}}});return m&&m.range;};return a;},true);