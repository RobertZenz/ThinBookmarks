/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

"use strict";

function startup(data, reason) {
	// Load the dependencies in the constructor, because the chrome.manifest
	// hasn't been read before that.
	
	Components.utils.import("chrome://thinbookmarks/content/javascript/ResourceAlias.js");
	Components.utils.import("chrome://thinbookmarks/content/javascript/ThinBookmarks.js");
	
	ResourceAlias.register(data);
	ThinBookmarks.init();
}

function shutdown(data, reason) {
	ResourceAlias.unregister();
	ThinBookmarks.uninit();
}

function install(data, reason) {
}

function uninstall(data, reason) {
}
