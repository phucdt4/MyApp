/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/Device"],function(B,D){"use strict";return B.extend("sap.ui.documentation.sdk.controller.TopicDetailInitial",{onInit:function(){B.prototype.onInit.call(this);this._onOrientationChange({landscape:D.orientation.landscape});},onBeforeRendering:function(){this._deregisterOrientationChange();},onAfterRendering:function(){this._registerOrientationChange();},onExit:function(){this._deregisterOrientationChange();}});});
