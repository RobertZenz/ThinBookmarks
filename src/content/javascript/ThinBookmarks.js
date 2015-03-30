/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

var EXPORTED_SYMBOLS = [ "ThinBookmarks" ];

Components.utils.import("resource://gre/modules/Services.jsm");

Components.utils.import("chrome://thinbookmarks/content/javascript/CSSBuilder.js");
Components.utils.import("chrome://thinbookmarks/content/javascript/DynamicStyleSheets.js");
Components.utils.import("chrome://thinbookmarks/content/javascript/Preferences.js");

var ThinBookmarks = {
	destroy : function() {
		Preferences.destroy();
		DynamicStyleSheets.unregisterAll();
	},
	
	init : function() {
		DynamicStyleSheets.init();
		DynamicStyleSheets.registerPath("main", "resource://thinbookmarks/content/css/main.css");
		
		Preferences.init("extensions.org.bonsaimind.thinbookmarks.");
		
		this.initPreferences();
	},
	
	initPreferences : function() {
		Preferences.registerBool("bookmarks.icon.hide", false, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-icon")
						.hide();
				DynamicStyleSheets.registerForBrowser(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerBool("bookmarks.text.hide", true, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item:not([type]) > .toolbarbutton-text")
						.hide();
				DynamicStyleSheets.registerForBrowser(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences.registerBool("dropdown.hideopenallintabs", false, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems menuitem[class=\"openintabs-menuitem\"]")
				css = css.addSelector("#PlacesToolbarItems menuseparator[class=\"bookmarks-actions-menuseparator\"]");
				css = css.hide();
				DynamicStyleSheets.registerForBrowser(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerInt("dropdown.minwidth", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems scrollbox").minWidth(value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
		Preferences.registerBool("dropdown.scrollbar", false, function(name, value) {
			if (value) {
				var cssScrollbox = new CSSBuilder("#PlacesToolbarItems scrollbox").add("overflow-y", "auto");
				var cssButton = new CSSBuilder("#PlacesToolbarItems autorepeatbutton").hide();
				DynamicStyleSheets.registerForBrowser(name, cssScrollbox.toCSS() + cssButton.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences
				.registerBool("folders.dropdown.hide", true, function(name, value) {
					if (value) {
						var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-menu-dropmarker")
								.hide();
						DynamicStyleSheets.registerForBrowser(name, css.toCSS());
					} else {
						DynamicStyleSheets.unregister(name);
					}
				});
		Preferences.registerBool("folders.icon.hide", true, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-icon")
						.hide();
				DynamicStyleSheets.registerForBrowser(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		Preferences.registerBool("folders.text.hide", false, function(name, value) {
			if (value) {
				var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item[type=menu] > .toolbarbutton-text")
						.hide();
				DynamicStyleSheets.registerForBrowser(name, css.toCSS());
			} else {
				DynamicStyleSheets.unregister(name);
			}
		});
		
		Preferences.registerInt("height", 24, function(name, value) {
			var css = new CSSBuilder("#PersonalToolbar").addSelector("#PlacesToolbar")
			css = css.addSelector("#PersonalToolbar > *").addSelector("#PlacesToolbarItems > *")
			css = css.forceHeight(value);
			
			var cssChildren = new CSSBuilder("#PersonalToolbar > *").addSelector("#PlacesToolbarItems > *")
			cssChildren = cssChildren.maxHeight(value);
			
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
			DynamicStyleSheets.registerForBrowser(name + ".children", cssChildren.toCSS());
		});
		
		Preferences.registerInt("items.icon.padding.bottom", -7, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon")
					.autoPadding("bottom", value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
		Preferences.registerInt("items.icon.padding.top", -7, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-icon")
					.autoPadding("top", value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
		Preferences.registerInt("items.padding", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item").margin("right", value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
		Preferences.registerInt("items.text.padding.top", -1, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems > .bookmark-item > .toolbarbutton-text")
					.autoPadding("top", value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
		
		Preferences.registerInt("padding.bottom", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems").autoPadding("bottom", value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
		Preferences.registerInt("padding.top", 0, function(name, value) {
			var css = new CSSBuilder("#PlacesToolbarItems").autoPadding("top", value);
			DynamicStyleSheets.registerForBrowser(name, css.toCSS());
		});
	}
};
