/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

"use strict"

var EXPORTED_SYMBOLS = [ "CSSBuilder" ];

/**
 * A utility class that allows to build CSS strings in a more functional or
 * object oriented manner than purely concatening strings. It will also
 * automatically add units (pixel) and "!important" by default to all
 * declarations.
 */
var CSSBuilder = function(selector) {
	/** The declarations string. */
	this.declarations = "";
	/** The selector that is used. */
	this.selector = selector;
	
	/**
	 * Add the given declaration with the given value.
	 * 
	 * @param declaration The declaration.
	 * @param value The value.
	 * @return This object.
	 */
	this.add = function(declaration, value) {
		this.declarations = this.declarations + declaration + ": " + value + " !important;\n";
		return this;
	};
	
	/**
	 * Adds the default unit (px) to the given value if it doens't already have
	 * a unit.
	 * 
	 * @param value The value.
	 * @return The value with a unit.
	 */
	this.addUnit = function(value) {
		if (!(/[a-zA-Z]{2}$/.test(value))) {
			return value + "px";
		}
		
		return value;
	};
	
	/**
	 * Adds the given selector.
	 * 
	 * @param selector The selector string to add.
	 * @return This object.
	 */
	this.addSelector = function(selector) {
		this.selector = this.selector + ", " + selector;
		return this;
	};
	
	/**
	 * Sets an "automatic" padding. If the given value is positive, the margin
	 * will be set to 0px and the padding will be set to the given value. If the
	 * given value is negative, the margin will be set to the given value and
	 * the padding will be set to 0px.
	 * 
	 * @param postfix The postfix, so top, bottom, left or right. Can be left
	 *            null or empty for all.
	 * @param value The value.
	 * @return This object.
	 */
	this.autoPadding = function(postfix, value) {
		var declaration = "";
		
		if (postfix != null && postfix !== "") {
			declaration = declaration + "-" + postfix;
		}
		
		if (value >= 0) {
			this.add("padding" + declaration, this.addUnit(value));
			this.add("margin" + declaration, "0px");
		} else {
			this.add("padding" + declaration, "0px");
			this.add("margin" + declaration, this.addUnit(value));
		}
		
		return this;
	};
	
	/**
	 * Forces a height of the given value, by setting height, min-height and
	 * max-height.
	 * 
	 * @param value The value of the height.
	 * @return This object.
	 */
	this.forceHeight = function(value) {
		this.add("height", this.addUnit(value));
		this.add("min-height", this.addUnit(value));
		this.add("max-height", this.addUnit(value));
		return this;
	};
	
	/**
	 * Forces a width of the given value, by setting width, min-width and
	 * max-width.
	 * 
	 * @param value The value of the width.
	 * @return This object.
	 */
	this.forceWidth = function(value) {
		this.add("width", this.addUnit(value));
		this.add("min-width", this.addUnit(value));
		this.add("max-width", this.addUnit(value));
		return this;
	};
	
	/**
	 * Sets the height to the given value.
	 * 
	 * @param value The value for the height.
	 * @return This object.
	 */
	this.height = function(value) {
		this.add("height", this.addUnit(value));
		return this;
	};
	
	/**
	 * Adds "display: none" to the declarations.
	 * 
	 * @return This object.
	 */
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
	
	/**
	 * Sets the max-height to the given value.
	 * 
	 * @param value The value for the max-height.
	 * @return This object.
	 */
	this.maxHeight = function(value) {
		this.add("max-Height", this.addUnit(value));
		return this;
	};
	
	/**
	 * Sets the max-width to the given value.
	 * 
	 * @param value The value for the max-width.
	 * @return This object.
	 */
	this.maxWidth = function(value) {
		this.add("max-width", this.addUnit(value));
		return this;
	};
	
	/**
	 * Sets the min-height to the given value.
	 * 
	 * @param value The value for the min-height.
	 * @return This object.
	 */
	this.minHeight = function(value) {
		this.add("min-Height", this.addUnit(value));
		return this;
	};
	
	/**
	 * Sets the min-width to the given value.
	 * 
	 * @param value The value for the min-width.
	 * @return This object.
	 */
	this.minWidth = function(value) {
		this.add("min-width", this.addUnit(value));
		return this;
	};
	
	/**
	 * Sets the padding for the given postfix (if any) to the given value.
	 * 
	 * @param postfix The postfix, so top, bottom, left or right. Can be null or
	 *            empty for all.
	 * @return This object.
	 */
	this.padding = function(postfix, value) {
		var declaration = "";
		
		if (postfix != null && postfix !== "") {
			declaration = declaration + "-" + postfix;
		}
		
		this.add("padding" + declaration, this.addUnit(value));
		
		return this;
	};
	
	/**
	 * Sets the width to the given value.
	 * 
	 * @param value The value for the width.
	 * @return This object.
	 */
	this.width = function(value) {
		this.add("width", this.addUnit(value));
		return this;
	};
	
	/**
	 * Returns the CSS representation of this class.
	 * 
	 * @return The CSS string.
	 */
	this.toCSS = function() {
		return this.selector + " {\n" + this.declarations + "}";
	};
};
