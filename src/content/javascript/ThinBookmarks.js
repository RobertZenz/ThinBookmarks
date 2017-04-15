/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

var EXPORTED_SYMBOLS = [ "ThinBookmarks" ];

Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("chrome://thinbookmarks/content/javascript/sfab/CSSBuilder.js");
Components.utils.import("chrome://thinbookmarks/content/javascript/sfab/DynamicStyleSheets.js");
Components.utils.import("chrome://thinbookmarks/content/javascript/sfab/Preferences.js");

var ThinBookmarks = {
	preferences : new Preferences(),
	
	styleSheets : new DynamicStyleSheets(),
	
	destroy : function() {
		this.preferences.destroy();
		this.styleSheets.unregisterAll();
	},
	
	init : function() {
		this.styleSheets.init();
		this.styleSheets.registerPath("main", "resource://thinbookmarks/content/css/main.css");
		
		this.preferences.init("extensions.org.bonsaimind.thinbookmarks.");
		
		this.initPreferences();
	},
	
	initPreferences : function() {
		// We need to extract this into a local variable to make it available
		// to the callbacks.
		var _this = this;
		
		this.preferences.registerBool("bookmarks.icon.hide", false, function(name, value) {
			if (value) {
				_this.styleSheets.registerForBrowser(name, new CSSBuilder()
						.addSelector("#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-icon")
						.hide());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		this.preferences.registerBool("bookmarks.text.hide", true, function(name, value) {
			if (value) {
				_this.styleSheets.registerForBrowser(name, new CSSBuilder()
						.addSelector("#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-text")
						.hide());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		
		this.preferences.registerBool("dropdown.hideopenallintabs", false, function(name, value) {
			if (value) {
				_this.styleSheets.registerForBrowser(name, new CSSBuilder()
						.addSelector("#PlacesToolbarItems menuitem[class=\"openintabs-menuitem\"]")
						.addSelector("#PlacesToolbarItems menuseparator[class=\"bookmarks-actions-menuseparator\"]")
						.hide());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		this.preferences.registerInt("dropdown.minwidth", 0, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems scrollbox")
					.minWidth(value));
		});
		this.preferences.registerBool("dropdown.scrollbar", false, function(name, value) {
			if (value) {
				var cssScrollbox = new CSSBuilder("#PlacesToolbarItems scrollbox").add("overflow-y", "auto");
				var cssButton = new CSSBuilder("#PlacesToolbarItems autorepeatbutton").hide();
				_this.styleSheets.registerForBrowser(name, cssScrollbox.toCSS() + cssButton.toCSS());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		
		this.preferences.registerBool("folders.dropdown.hide", true, function(name, value) {
			if (value) {
				_this.styleSheets.registerForBrowser(name, new CSSBuilder()
						.addSelector("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-menu-dropmarker")
						.hide());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		this.preferences.registerBool("folders.icon.hide", true, function(name, value) {
			if (value) {
				_this.styleSheets.registerForBrowser(name, new CSSBuilder()
						.addSelector("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-icon")
						.hide());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		this.preferences.registerBool("folders.text.hide", false, function(name, value) {
			if (value) {
				_this.styleSheets.registerForBrowser(name, new CSSBuilder()
						.addSelector("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-text")
						.hide());
			} else {
				_this.styleSheets.unregister(name);
			}
		});
		
		this.preferences.registerInt("height", 24, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PersonalToolbar")
					.addSelector("#PlacesToolbar")
					.addSelector("#PlacesChevron")
					.addSelector("#PersonalToolbar > *")
					.addSelector("#PlacesToolbarItems > *")
					.forceHeight(value));
		});
		
		this.preferences.registerInt("items.icon.padding.bottom", -7, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon")
					.autoPadding("bottom", value));
		});
		this.preferences.registerInt("items.icon.padding.top", -7, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon")
					.autoPadding("top", value));
		});
		this.preferences.registerInt("items.padding", 0, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems > .bookmark-item")
					.margin("right", value));
		});
		this.preferences.registerInt("items.text.padding.top", -1, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text")
					.autoPadding("top", value));
		});
		
		this.preferences.registerInt("padding.bottom", 0, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems")
					.addSelector("#PlacesChevron")
					.autoPadding("bottom", value));
		});
		this.preferences.registerInt("padding.top", 0, function(name, value) {
			_this.styleSheets.registerForBrowser(name, new CSSBuilder()
					.addSelector("#PlacesToolbarItems")
					.addSelector("#PlacesChevron")
					.autoPadding("top", value));
		});
	}
};

