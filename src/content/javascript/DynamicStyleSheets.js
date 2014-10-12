/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict"

var EXPORTED_SYMBOLS = [ "DynamicStyleSheets" ];

Components.utils.import("resource://gre/modules/Services.jsm");

var DynamicStyleSheets = {
	styleSheets : {},
	styleSheetService : Components.classes["@mozilla.org/content/style-sheet-service;1"]
			.getService(Components.interfaces.nsIStyleSheetService),
	
	register : function(name, style) {
		this.unregister(name);
		var styleSheetContent = "@namespace url(http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul);";
		styleSheetContent = styleSheetContent + "@-moz-document url(chrome://browser/content/browser.xul) {";
		styleSheetContent = styleSheetContent + style;
		styleSheetContent = styleSheetContent + "}";
		this.styleSheets[name] = Services.io.newURI("data:text/css;base64," + btoa(styleSheetContent), null, null);
		var styleSheet = this.styleSheets[name];
		if (!this.styleSheetService.sheetRegistered(styleSheet, this.styleSheetService.USER_SHEET)) {
			this.styleSheetService.loadAndRegisterSheet(styleSheet, this.styleSheetService.USER_SHEET);
		}
	},
	
	unregister : function(name) {
		var styleSheet = this.styleSheets[name];
		if (styleSheet != null) {
			if (this.styleSheetService.sheetRegistered(styleSheet, this.styleSheetService.USER_SHEET)) {
				this.styleSheetService.unregisterSheet(styleSheet, this.styleSheetService.USER_SHEET);
			}
		}
	},
	
	unregisterAll : function() {
		for ( var name in this.styleSheets) {
			this.unregister(name);
		}
	}
};
