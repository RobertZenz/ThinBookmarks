/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict"

var EXPORTED_SYMBOLS = [ "CSSBuilder" ];

var CSSBuilder = function(selector) {
	this.declarations = "";
	this.selector = selector;
	
	this.add = function(declaration, value) {
		this.declarations = this.declarations + declaration + ": " + value + " !important;\n";
		return this;
	};
	
	this.addUnit = function(value) {
		if (!(/[a-zA-Z]{2}$/.test(value))) {
			return value + "px";
		}
		
		return value;
	};
	
	this.addSelector = function(selector) {
		this.selector = this.selector + ", " + selector;
		return this;
	}

	this.autoPadding = function(postfix, value) {
		var declaration = "";
		
		if (postfix != null && postfix !== "") {
			declaration = declaration + "-" + postfix;
		}
		
		if (value >= 0) {
			this.add("padding" + declaration, this.addUnit(value));
		} else {
			this.add("padding" + declaration, "0px");
			this.add("margin" + declaration, this.addUnit(value));
		}
		
		return this;
	};
	
	this.forceHeight = function(value) {
		this.add("height", this.addUnit(value));
		this.add("min-height", this.addUnit(value));
		this.add("max-height", this.addUnit(value));
		return this;
	};
	
	this.forceWidth = function(value) {
		this.add("width", this.addUnit(value));
		this.add("min-width", this.addUnit(value));
		this.add("max-width", this.addUnit(value));
		return this;
	};
	
	this.height = function(value) {
		this.add("height", this.addUnit(value));
		return this;
	};
	
	this.hide = function() {
		this.add("display", "none");
		return this;
	};
	
	this.margin = function(postfix, value) {
		var declaration = "";
		
		if (postfix != null && postfix !== "") {
			declaration = declaration + "-" + postfix;
		}
		
		this.add("margin" + declaration, this.addUnit(value));
		
		return this;
	};
	
	this.maxHeight = function(value) {
		this.add("max-Height", this.addUnit(value));
		return this;
	};
	
	this.maxWidth = function(value) {
		this.add("max-width", this.addUnit(value));
		return this;
	};
	
	this.minHeight = function(value) {
		this.add("min-Height", this.addUnit(value));
		return this;
	};
	
	this.minWidth = function(value) {
		this.add("min-width", this.addUnit(value));
		return this;
	};
	
	this.padding = function(postfix, value) {
		var declaration = "";
		
		if (postfix != null && postfix !== "") {
			declaration = declaration + "-" + postfix;
		}
		
		this.add("padding" + declaration, this.addUnit(value));
		
		return this;
	};
	
	this.width = function(value) {
		this.add("width", this.addUnit(value));
		return this;
	};
	
	this.toCSS = function() {
		return this.selector + " {\n" + this.declarations + "}";
	};
};
