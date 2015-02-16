/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * This is a fork/based on Small Tabs, written by ロシア,
 * https://addons.mozilla.org/en-US/firefox/addon/small-tabs/
 */

"use strict";

var EXPORTED_SYMBOLS = [ "ThinBookmarks" ];

Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("chrome://thinbookmarks/content/javascript/CSSBuilder.js");
Components.utils.import("chrome://thinbookmarks/content/javascript/DynamicStyleSheets.js");
Components.utils.import("chrome://thinbookmarks/content/javascript/Preferences.js");

var ThinBookmarks = {
	styleSheet : null,
	styleSheetService : null,
	
	getWindows : function() {
		var windows = [];
		
		var browserWindows = Services.wm.getEnumerator("navigator:browser");
		
		while (browserWindows.hasMoreElements()) {
			var browserWindow = browserWindows.getNext();
			browserWindow.QueryInterface(Components.interfaces.nsIDOMWindow);
			windows.push(browserWindow);
		}
		
		return windows;
	},
	
	handleEvent : function(event) {
		var document = event.target;
		var window = document.defaultView;
		
		window.removeEventListener("load", this, true);
		
		if (document.documentElement.getAttribute("windowtype") != "navigator:browser") {
			return;
		}
		
		this.loadScript(window);
	},
	
	loadStyle : function() {
		if (!this.styleSheetService.sheetRegistered(this.styleSheet, this.styleSheetService.USER_SHEET)) {
			this.styleSheetService.loadAndRegisterSheet(this.styleSheet, this.styleSheetService.USER_SHEET);
		}
	},
	
	unloadStyle : function() {
		if (this.styleSheetService.sheetRegistered(this.styleSheet, this.styleSheetService.USER_SHEET)) {
			this.styleSheetService.unregisterSheet(this.styleSheet, this.styleSheetService.USER_SHEET);
		}
	},
	
	loadScript : function(window) {
	},
	
	unloadScript : function(window) {
	},
	
	onOpenWindow : function(window) {
		var domWindow = window.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIDOMWindow);
		domWindow.addEventListener("load", this, true);
	},
	
	onCloseWindow : function(window) {
	},
	
	onWindowTitleChange : function(window, title) {
	},
	
	setDefaultPreferences : function() {
		Preferences.registerBool("bookmarks.icon.hide", false, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-icon").hide();
				DynamicStyleSheets.register(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerBool("bookmarks.text.hide", true, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-text").hide();
				DynamicStyleSheets.register(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences.registerBool("dropdown.hideopenallintabs", false, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems menuitem[class=\"openintabs-menuitem\"]")
				css = css.addSelector("#PlacesToolbarItems menuseparator[class=\"bookmarks-actions-menuseparator\"]");
				css = css.hide();
				DynamicStyleSheets.register(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerInt("dropdown.minwidth", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems scrollbox").minWidth(value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		Preferences.registerBool("dropdown.scrollbar", false, function(name, value) {
			if (value) {
				var cssScrollbox = new CSSBuilder("#PlacesToolbarItems scrollbox").add("overflow-y", "auto");
				var cssButton = new CSSBuilder("#PlacesToolbarItems autorepeatbutton").hide();
				DynamicStyleSheets.register(name, cssScrollbox.toCSS() + cssButton.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences.registerBool("folders.dropdown.hide", true, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-menu-dropmarker").hide();
				DynamicStyleSheets.register(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerBool("folders.icon.hide", true, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-icon").hide();
				DynamicStyleSheets.register(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerBool("folders.text.hide", false, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-text").hide();
				DynamicStyleSheets.register(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences.registerInt("height", 24, function(name, value) {
			var css = new CSSBuilder("#PersonalToolbar").addSelector("#PlacesToolbar").forceHeight(value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		
		Preferences.registerInt("items.icon.padding.bottom", -7, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon").autoPadding("bottom", value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		Preferences.registerInt("items.icon.padding.top", -7, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon").autoPadding("top", value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		Preferences.registerInt("items.padding", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item").margin("right", value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		Preferences.registerInt("items.text.padding.top", -1, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text").autoPadding("top", value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		
		Preferences.registerInt("padding.bottom", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems").autoPadding("bottom", value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
		Preferences.registerInt("padding.top", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems").autoPadding("top", value);
			DynamicStyleSheets.register(name, css.toCSS());
		});
	},
	
	init : function() {
		this.styleSheet = Services.io.newURI("resource://thinbookmarks/thinbookmarks.css", null, null);
		this.styleSheetService = Components.classes["@mozilla.org/content/style-sheet-service;1"].getService(Components.interfaces.nsIStyleSheetService);
		
		DynamicStyleSheets.init();
		Preferences.init("extensions.org.bonsaimind.thinbookmarks.");
		this.setDefaultPreferences();
		
		this.loadStyle();
		
		Services.wm.addListener(this);
		
		this.getWindows().forEach(function(window) {
			this.loadScript(window);
		}, this);
	},
	
	uninit : function() {
		this.unloadStyle();
		
		DynamicStyleSheets.unregisterAll();
		
		Services.wm.removeListener(this);
		
		this.getWindows().forEach(function(window) {
			this.unloadScript(window);
		}, this);
	}
};
