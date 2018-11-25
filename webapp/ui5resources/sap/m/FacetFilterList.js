/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./List','./library'],function(q,L,l){"use strict";var F=L.extend("sap.m.FacetFilterList",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Appearance",defaultValue:null},wordWrap:{type:"boolean",group:"Appearance",defaultValue:false},multiSelect:{type:"boolean",group:"Behavior",defaultValue:true,deprecated:true},active:{type:"boolean",group:"Behavior",defaultValue:true},enableCaseInsensitiveSearch:{type:"boolean",group:"Behavior",defaultValue:false,deprecated:false},allCount:{type:"int",group:"Appearance",defaultValue:null},sequence:{type:"int",group:"Behavior",defaultValue:-1},key:{type:"string",group:"Identification",defaultValue:null},showRemoveFacetIcon:{type:"boolean",group:"Misc",defaultValue:true},retainListSequence:{type:"boolean",group:"Misc",defaultValue:false},dataType:{type:"sap.m.FacetFilterListDataType",group:"Misc",defaultValue:sap.m.FacetFilterListDataType.String}},events:{listOpen:{},listClose:{parameters:{selectedItems:{type:"sap.m.FacetFilterItem[]"},allSelected:{type:"boolean"},selectedKeys:{type:"object"}}}}}});F.prototype.setTitle=function(t){this.setProperty("title",t,true);this._updateFacetFilterButtonText();return this;};F.prototype.setMultiSelect=function(v){this.setProperty("multiSelect",v,true);var m=v?sap.m.ListMode.MultiSelect:sap.m.ListMode.SingleSelectMaster;this.setMode(m);return this;};F.prototype.setMode=function(m){if(m===sap.m.ListMode.MultiSelect||m===sap.m.ListMode.SingleSelectMaster){L.prototype.setMode.call(this,m);this.setProperty("multiSelect",m===sap.m.ListMode.MultiSelect?true:false,true);}return this;};F.prototype._applySearch=function(){var s=this._getSearchValue();if(s!=null){this._search(s,true);this._updateSelectAllCheckBox();}};F.prototype.getSelectedItems=function(){var s=[];var c={};var C=sap.m.ListBase.prototype.getSelectedItems.apply(this,arguments);C.forEach(function(i){s.push(new sap.m.FacetFilterItem({text:i.getText(),key:i.getKey(),selected:true}));c[i.getKey()]=true;});var S=this.getSelectedKeys();var a=Object.getOwnPropertyNames(S);if(C.length<a.length){a.forEach(function(k){if(!c[k]){s.push(new sap.m.FacetFilterItem({text:S[k],key:k,selected:true}));}});}return s;};F.prototype.getSelectedItem=function(){var i=sap.m.ListBase.prototype.getSelectedItem.apply(this,arguments);var s=Object.getOwnPropertyNames(this.getSelectedKeys());if(!i&&s.length>0){i=new sap.m.FacetFilterItem({text:this.getSelectedKeys()[s[0]],key:s[0],selected:true});}return i;};F.prototype.removeSelections=function(a){if(this._allowRemoveSelections){a?this.setSelectedKeys():sap.m.ListBase.prototype.removeSelections.call(this,a);}return this;};F.prototype.getSelectedKeys=function(){var r={};var k=this._oSelectedKeys;Object.getOwnPropertyNames(k).forEach(function(a){r[a]=k[a];});return r;};F.prototype.setSelectedKeys=function(k){this._oSelectedKeys={};var K=false;k&&Object.getOwnPropertyNames(k).forEach(function(a){this._addSelectedKey(a,k[a]);K=true;},this);if(K){this.setActive(true);this._selectItemsByKeys();}else{sap.m.ListBase.prototype.removeSelections.call(this);}};F.prototype._getNonGroupItems=function(){var i=[];this.getItems().forEach(function(I){if(I.getMode()!==sap.m.ListMode.None){i.push(I);}});return i;};F.prototype.removeSelectedKey=function(k,t){if(this._removeSelectedKey(k,t)){this._getNonGroupItems().forEach(function(i){var I=i.getKey()||i.getText();k===I&&i.setSelected(false);});}};F.prototype.removeSelectedKeys=function(){this._oSelectedKeys={};sap.m.ListBase.prototype.removeSelections.call(this,true);};F.prototype.removeItem=function(i){var I=sap.m.ListBase.prototype.removeItem.apply(this,arguments);if(!this._filtering){I&&I.getSelected()&&this.removeSelectedKey(I.getKey(),I.getText());return I;}};F.prototype.init=function(){this._firstTime=true;this._saveBindInfo;this._oSelectedKeys={};L.prototype.init.call(this);this.setMode(sap.m.ListMode.MultiSelect);this.setIncludeItemInSelection(true);this.setGrowing(true);this.setRememberSelections(false);this._searchValue=null;this.attachUpdateFinished(function(e){var u=e.getParameter("reason");u=u?u.toLowerCase():u;if(u!=="growing"&&u!==sap.ui.model.ChangeReason.Filter.toLowerCase()){this._oSelectedKeys={};this._getNonGroupItems().forEach(function(i){if(i.getSelected()){this._addSelectedKey(i.getKey(),i.getText());}},this);}if(u!==sap.ui.model.ChangeReason.Filter.toLowerCase()){this._selectItemsByKeys();}this._updateFacetFilterButtonText();});this._allowRemoveSelections=true;this._bOriginalActiveState;};F.prototype._resetItemsBinding=function(){if(this.isBound("items")){this._searchValue=null;this._allowRemoveSelections=false;sap.m.ListBase.prototype._resetItemsBinding.apply(this,arguments);this._allowRemoveSelections=true;}};F.prototype._fireListCloseEvent=function(){var s=this.getSelectedItems();var S=this.getSelectedKeys();var a=s.length===0;this._firstTime=true;this.fireListClose({selectedItems:s,selectedKeys:S,allSelected:a});};F.prototype._updateActiveState=function(){var c=sap.ui.getCore().byId(this.getAssociation("allcheckbox"));if(Object.getOwnPropertyNames(this._oSelectedKeys).length>0||(c&&c.getSelected())){this.setActive(true);}};F.prototype._handleSearchEvent=function(e){var s=e.getParameters()["query"];if(s===undefined){s=e.getParameters()["newValue"];}this._search(s);this._updateSelectAllCheckBox();};F.prototype._search=function(s,f){var b;var n=0;function i(m){return m instanceof sap.ui.model.odata.ODataModel||m instanceof sap.ui.model.odata.v2.ODataModel;}if(f||(s!==this._searchValue)){this._searchValue=s;var B=this.getBinding("items");var o=this.getBindingInfo("items");if(o&&o.binding){b=o.binding.aFilters;if(b.length>0){n=b[0].aFilters.length;if(this._firstTime){this._saveBindInfo=b[0].aFilters[0];this._firstTime=false;}}}if(B){if(s||n>0){var p=this.getBindingInfo("items").template.getBindingInfo("text").parts[0].path;if(p){var u=new sap.ui.model.Filter(p,sap.ui.model.FilterOperator.Contains,s);if(this.getEnableCaseInsensitiveSearch()&&i(B.getModel())){var e="'"+String(s).replace(/'/g,"''")+"'";e=e.toLowerCase();u=new sap.ui.model.Filter("tolower("+p+")",sap.ui.model.FilterOperator.Contains,e);}if(n>1){var a=new sap.ui.model.Filter([u,this._saveBindInfo],true);}else{if(this._saveBindInfo>""&&u.sPath!=this._saveBindInfo.sPath){var a=new sap.ui.model.Filter([u,this._saveBindInfo],true);}else{if(s==""){var a=[];}else{var a=new sap.ui.model.Filter([u],true);}}}B.filter(a,sap.ui.model.FilterType.Control);}}else{B.filter([],sap.ui.model.FilterType.Control);}}else{q.sap.log.warning("No filtering performed","The list must be defined with a binding for search to work",this);}}};F.prototype._getSearchValue=function(){return this._searchValue;};F.prototype._updateSelectAllCheckBox=function(){var i=this._getNonGroupItems(),I=i.length,c,a,s;function b(o){return o.getSelected();}if(this.getMultiSelect()){c=sap.ui.getCore().byId(this.getAssociation("allcheckbox"));a=I>0&&I===i.filter(b).length;s=this.getActive()&&a;c&&c.setSelected(s);}};F.prototype._addSelectedKey=function(k,t){if(!k&&!t){q.sap.log.error("Both sKey and sText are not defined. At least one must be defined.");return;}if(this.getMode()===sap.m.ListMode.SingleSelectMaster){this.removeSelectedKeys();}if(!k){k=t;}this._oSelectedKeys[k]=t||k;};F.prototype._removeSelectedKey=function(k,t){if(!k&&!t){q.sap.log.error("Both sKey and sText are not defined. At least one must be defined.");return false;}if(!k){k=t;}delete this._oSelectedKeys[k];return true;};F.prototype._setSearchValue=function(v){this._searchValue=v;};F.prototype._isItemSelected=function(i){return!!(this._oSelectedKeys[i&&(i.getKey()||i.getText())]);};F.prototype._updateFacetFilterButtonText=function(){if(this.getParent()&&this.getParent()._setButtonText){this.getParent()._setButtonText(this);}};F.prototype._selectItemsByKeys=function(){this._getNonGroupItems().forEach(function(i){i.setSelected(this._isItemSelected(i));},this);};F.prototype._handleSelectAllClick=function(s){var a;this._getNonGroupItems().forEach(function(i){if(s){this._addSelectedKey(i.getKey(),i.getText());}else{this._removeSelectedKey(i.getKey(),i.getText());}i.setSelected(s,true);},this);a=this._getOriginalActiveState()||s;this.setActive(a);q.sap.delayedCall(0,this,this._updateSelectAllCheckBox);};F.prototype.onItemTextChange=function(i,n){var k=i.getKey();if(this._oSelectedKeys[k]&&n){this._oSelectedKeys[k]=n;}};F.prototype.onItemSelectedChange=function(i,s){var a;if(s){this._addSelectedKey(i.getKey(),i.getText());}else{this._removeSelectedKey(i.getKey(),i.getText());}sap.m.ListBase.prototype.onItemSelectedChange.apply(this,arguments);a=this._getOriginalActiveState()||s||this.getSelectedItems().length>1;this.setActive(a);!this.getDomRef()&&this.getParent()&&this.getParent().getDomRef()&&this.getParent().invalidate();q.sap.delayedCall(0,this,this._updateSelectAllCheckBox);};F.prototype.updateItems=function(r){this._filtering=r===sap.ui.model.ChangeReason.Filter;sap.m.ListBase.prototype.updateItems.apply(this,arguments);this._filtering=false;if(!this.getGrowing()||r===sap.ui.model.ChangeReason.Filter){this._selectItemsByKeys();}};F.prototype._getOriginalActiveState=function(){return this._bOriginalActiveState;};F.prototype._preserveOriginalActiveState=function(){this._bOriginalActiveState=this.getActive();};return F;},true);
