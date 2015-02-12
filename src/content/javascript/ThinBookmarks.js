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
	
	setDefaultPreferences : function() {
		Preferences
				.registerBool(
						"bookmarks.icon.hide",
						false,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(name,
												"#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-icon { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		Preferences
				.registerBool(
						"bookmarks.text.hide",
						true,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(name,
												"#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-text { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		
		Preferences
				.registerBool(
						"dropdown.hideopenallintabs",
						false,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(
												name,
												"#PlacesToolbarItems menuitem[class=\"openintabs-menuitem\"], #PlacesToolbarItems menuseparator[class=\"bookmarks-actions-menuseparator\"] { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		Preferences.registerInt("dropdown.minwidth", 0, function(name, value) {
			DynamicStyleSheets.register(name, "#PlacesToolbarItems scrollbox { min-width: " + value
					+ "px !important; }");
		});
		Preferences
				.registerBool(
						"dropdown.scrollbar",
						false,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(
												name,
												"#PlacesToolbarItems scrollbox { overflow-y: auto !important; } #PlacesToolbarItems autorepeatbutton { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		
		Preferences
				.registerBool(
						"folders.dropdown.hide",
						true,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(name,
												"#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-menu-dropmarker { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		Preferences
				.registerBool(
						"folders.icon.hide",
						true,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(name,
												"#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-icon { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		Preferences
				.registerBool(
						"folders.text.hide",
						false,
						function(name, value) {
							if (value) {
								DynamicStyleSheets
										.register(name,
												"#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-text { display: none !important; }");
							} else {
								DynamicStyleSheets.unregister(name);
							}
						});
		
		var heightFunction = function(name, value) {
			var height = Preferences.getInt("height", 24);
			var itemHeight = height - Preferences.getInt("item.height.difference", 2);
			
			DynamicStyleSheets.register(name, "#PersonalToolbar, #PlacesToolbar { height: " + height
					+ "px !important; max-height: " + height + "px !important; min-height: " + height
					+ "px !important; } #PersonalToolbar > *, #PlacesToolbarItems > * { height: " + itemHeight
					+ "px !important; max-height: " + itemHeight + "px !important; min-height: " + itemHeight
					+ "px !important; }");
		};
		
		Preferences.registerInt("height", 24, heightFunction);
		Preferences.registerInt("item.height.difference", 2, heightFunction);
		
		Preferences.registerInt("items.icon.padding.bottom", -7, function(name, value) {
			if (value > 0) {
				DynamicStyleSheets.register(name,
						"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { padding-bottom: " + value
								+ "px !important; }");
			} else if (value < 0) {
				DynamicStyleSheets.register(name,
						"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { margin-bottom: " + value
								+ "px !important; }");
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerInt("items.icon.padding.top", -7, function(name, value) {
			if (value > 0) {
				DynamicStyleSheets.register(name,
						"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { padding-top: " + value
								+ "px !important; }");
			} else if (value < 0) {
				DynamicStyleSheets.register(name,
						"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon { margin-top: " + value
								+ "px !important; }");
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerInt("items.padding", 0, function(name, value) {
			if (value != 0) {
				DynamicStyleSheets.register(name, "#PlacesToolbarItems > .bookmark-item { margin-right: " + value
						+ "px !important; }");
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerInt("items.text.padding.top", -1, function(name, value) {
			if (value > 0) {
				DynamicStyleSheets.register(name,
						"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text { padding-top: " + value
								+ "px !important; }");
			} else if (value < 0) {
				DynamicStyleSheets.register(name,
						"#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text { margin-top: " + value
								+ "px !important; }");
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences.registerInt("padding.bottom", 0,
				function(name, value) {
					if (value > 0) {
						DynamicStyleSheets.register(name, "#PlacesToolbarItems { padding-bottom: " + value
								+ "px !important; }");
					} else if (value < 0) {
						DynamicStyleSheets.register(name, "#PlacesToolbarItems { margin-bottom: " + value
								+ "px !important; }");
					} else {
						DynamicStyleSheets.unregister(name);
					}
				});
		Preferences.registerInt("padding.top", 0, function(name, value) {
			if (value > 0) {
				DynamicStyleSheets.register(name, "#PlacesToolbarItems { padding-top: " + value + "px !important; }");
			} else if (value < 0) {
				DynamicStyleSheets.register(name, "#PlacesToolbarItems { margin-top: " + value + "px !important; }");
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
	},
	
	init : function() {
		this.styleSheet = Services.io.newURI("resource://thinbookmarks/thinbookmarks.css", null, null);
		this.styleSheetService = Components.classes["@mozilla.org/content/style-sheet-service;1"]
				.getService(Components.interfaces.nsIStyleSheetService);
		
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
