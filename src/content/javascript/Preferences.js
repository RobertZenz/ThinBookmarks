/*
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 * 
 */

"use strict";

var EXPORTED_SYMBOLS = [ "Preferences" ];

var Preferences = {
	branch : null,
	changeCallbacks : {},
	defaultPreferences : null,
	getFunctions : {},
	preferences : null,
	
	destroy : function() {
		this.preferences.removeObserver("", this);
		
		this.changeCallbacks = null;
		this.defaultPreferences = null;
		this.preferences = null;
		this.getFunctions = null;
	},
	
	getBool : function(name, defaultValue) {
		try {
			return this.preferences.getBoolPref(name);
		} catch (e) {
			// Empty on purpose
		}
		
		return defaultValue;
	},
	
	getInt : function(name, defaultValue) {
		try {
			return this.preferences.getIntPref(name);
		} catch (e) {
			// Empty on purpose
		}
		
		return defaultValue;
	},
	
	init : function(branch) {
		this.branch = branch;
		
		this.changeCallbacks = {};
		this.defaultPreferences = {};
		this.preferences = {};
		this.getFunctions = {};
		
		this.defaultPreferences = Components.classes["@mozilla.org/preferences-service;1"].getService(
				Components.interfaces.nsIPrefService).getDefaultBranch(this.branch);
		this.preferences = Components.classes["@mozilla.org/preferences-service;1"].getService(
				Components.interfaces.nsIPrefService).getBranch(this.branch);
		this.preferences.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.preferences.addObserver("", this, false);
	},
	
	observe : function(subject, topic, data) {
		if (topic != "nsPref:changed") {
			return;
		}
		
		var changeCallback = this.changeCallbacks[data];
		
		if (changeCallback != null) {
			var value = this.getFunctions[data](data);
			changeCallback(data, value);
		}
	},
	
	register : function(name, defaultValue, onChange, defaultFunction, getFunction) {
		defaultFunction(name, defaultValue);
		
		this.changeCallbacks[name] = onChange;
		this.getFunctions[name] = getFunction;
		
		this.observe(null, "nsPref:changed", name);
	},
	
	registerBool : function(name, defaultValue, onChange) {
		this.register(name, defaultValue, onChange, this.defaultPreferences.setBoolPref, this.preferences.getBoolPref);
	},
	
	registerChar : function(name, defaultValue, onChange) {
		this.register(name, defaultValue, onChange, this.defaultPreferences.setCharPref, this.preferences.getCharPref);
	},
	
	registerInt : function(name, defaultValue, onChange) {
		this.register(name, defaultValue, onChange, this.defaultPreferences.setIntPref, this.preferences.getIntPref);
	}
};
