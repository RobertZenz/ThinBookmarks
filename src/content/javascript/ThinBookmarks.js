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

Components.utils.import("chrome://thinbookmarks/content/javascript/DynamicStyleSheets.js");

var ThinBookmarks = {
	preferences : null,
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
		var domWindow = window.docShell.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(
				Components.interfaces.nsIDOMWindow);
		domWindow.addEventListener("load", this, true);
	},
	
	onCloseWindow : function(window) {
	},
	
	onWindowTitleChange : function(window, title) {
	},
	
	observe : function(subject, topic, data) {
		if (topic != "nsPref:changed") {
			return;
		}
		
		this.refreshPreference(data);
	},
	
	refreshPreference : function(name) {
		switch (name) {
			case "bookmarks.icon.hide":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(name,
									"#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-icon { display: none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "bookmarks.text.hide":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(name,
									"#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-text { display: none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "dropdown.hideopenallintabs":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(
									name,
									"menuitem[label=\"Open All in Tabs\"], menuseparator[class=\"bookmarks-actions-menuseparator\"] { display: none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "dropdown.minwidth":
				var minimumWidth = this.preferences.getIntPref(name);
				
				DynamicStyleSheets.register(name, "#PlacesToolbarItems scrollbox { min-width: " + minimumWidth
						+ "px !important; }");
				break;
			
			case "dropdown.scrollbar":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(
									name,
									"#PlacesToolbarItems scrollbox { overflow-y: auto !important; } #PlacesToolbarItems autorepeatbutton { display:none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "folders.dropdown.hide":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(name,
									"#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-menu-dropmarker { display: none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "folders.icon.hide":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(name,
									"#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-icon { display: none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "folders.text.hide":
				if (this.preferences.getBoolPref(name)) {
					DynamicStyleSheets
							.register(name,
									"#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-text { display: none !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				break;
			
			case "height":
				var height = this.preferences.getIntPref(name);
				var itemHeight = height - this.preferences.getIntPref("item.height.difference");
				
				DynamicStyleSheets.register(name, "#PersonalToolbar, #PlacesToolbar { height: " + height
						+ "px !important; max-height: " + height
						+ "px !important; } #PersonalToolbar > *, #PlacesToolbarItems > * { height: " + itemHeight
						+ "px !important; max-height: " + itemHeight + "px !important;}");
				break;
			
			case "items.icon.padding.bottom":
				var itemsIconPaddingBottom = this.preferences.getIntPref(name);
				
				if (itemsIconPaddingBottom > 0) {
					DynamicStyleSheets.register(name,
							"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { padding-bottom: "
									+ itemsIconPaddingBottom + "px !important; }");
				} else if (itemsIconPaddingBottom < 0) {
					DynamicStyleSheets.register(name,
							"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { margin-bottom: "
									+ itemsIconPaddingBottom + "px !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				
				break;
			
			case "items.icon.padding.top":
				var itemsIconPaddingTop = this.preferences.getIntPref(name);
				
				if (itemsIconPaddingTop > 0) {
					DynamicStyleSheets.register(name,
							"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { padding-top: "
									+ itemsIconPaddingTop + "px !important; }");
				} else if (itemsIconPaddingTop < 0) {
					DynamicStyleSheets.register(name,
							"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { margin-top: "
									+ itemsIconPaddingTop + "px !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				
				break;
			
			case "items.text.padding.top":
				var itemsTextPaddingTop = this.preferences.getIntPref(name);
				
				if (itemsTextPaddingTop > 0) {
					DynamicStyleSheets.register(name,
							"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text { padding-top: "
									+ itemsTextPaddingTop + "px !important; }");
				} else if (itemsTextPaddingTop < 0) {
					DynamicStyleSheets.register(name,
							"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text { margin-top: "
									+ itemsTextPaddingTop + "px !important; }");
				} else {
					DynamicStyleSheets.unregister(name);
				}
				
				break;
		}
	},
	
	setDefaultPreferences : function() {
		var defaultPreferences = Components.classes["@mozilla.org/preferences-service;1"].getService(
				Components.interfaces.nsIPrefService).getDefaultBranch("extensions.org.bonsaimind.thinbookmarks.");
		
		defaultPreferences.setBoolPref("bookmarks.icon.hide", false);
		this.refreshPreference("bookmarks.icon.hide");
		defaultPreferences.setBoolPref("bookmarks.text.hide", true);
		this.refreshPreference("bookmarks.text.hide");
		
		defaultPreferences.setBoolPref("dropdown.hideopenallintabs", false);
		this.refreshPreference("dropdown.hideopenallintabs");
		defaultPreferences.setIntPref("dropdown.minwidth", 0);
		this.refreshPreference("dropdown.minwidth");
		defaultPreferences.setBoolPref("dropdown.scrollbar", false);
		this.refreshPreference("dropdown.scrollbar");
		
		defaultPreferences.setBoolPref("folders.dropdown.hide", true);
		this.refreshPreference("folders.dropdown.hide");
		defaultPreferences.setBoolPref("folders.icon.hide", true);
		this.refreshPreference("folders.icon.hide");
		defaultPreferences.setBoolPref("folders.text.hide", false);
		this.refreshPreference("folders.text.hide");
		
		defaultPreferences.setIntPref("height", 24);
		defaultPreferences.setIntPref("item.height.difference", 2);
		this.refreshPreference("height");
		
		defaultPreferences.setIntPref("items.icon.padding.bottom", -7);
		this.refreshPreference("items.icon.padding.bottom");
		defaultPreferences.setIntPref("items.icon.padding.top", -7);
		this.refreshPreference("items.icon.padding.top");
		defaultPreferences.setIntPref("items.text.padding.top", -1);
		this.refreshPreference("items.text.padding.top");
	},
	
	init : function() {
		this.preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(
				Components.interfaces.nsIPrefService).getBranch("extensions.org.bonsaimind.thinbookmarks.");
		this.preferences.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.preferences.addObserver("", this, false);
		this.styleSheet = Services.io.newURI("resource://thinbookmarks/thinbookmarks.css", null, null);
		this.styleSheetService = Components.classes["@mozilla.org/content/style-sheet-service;1"]
				.getService(Components.interfaces.nsIStyleSheetService);
		
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
