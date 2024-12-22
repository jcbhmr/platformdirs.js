/**
 * @module
 * Android.
 *
 * TODO: Implement this module.
 */

import * as path from "node:path";
import { PlatformDirsABC } from "./api.js";

/**
 * @param {unknown} error
 * @return {never}
 */
function throwExpression(error) {
	throw error;
}

/**
 * Follows the guidance [from here](https://android.stackexchange.com/a/216132).
 *
 * Makes use of the {@link PlatformDirsABC.appname},
 * {@link PlatformDirsABC.version}, {@link PlatformDirsABC.ensureExists}.
 */
export class Android extends PlatformDirsABC {
	/**
	 * @override
	 * @return {string} data directory tied to the user, e.g. `/data/user/<userid>/<packagename>/files/<AppName>`
	 */
	get userDataDir() {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throwExpression(new Error("unreachable")),
			"files",
		);
	}

	/**
	 * @override
	 * @return {string} data directory shared by users, same as `userDataDir`
	 */
	get siteDataDir() {
		return this.userDataDir;
	}

	/**
	 * @override
	 * @return {string} config directory tied to the user, e.g. `/data/user/<userid>/<packagename>/shared_prefs/<AppName>`
	 */
	get userConfigDir() {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throwExpression(new Error("unreachable")),
			"shared_prefs",
		);
	}

	/**
	 * @override
	 * @return {string} config directory shared by users, same as `userConfigDir`
	 */
	get siteConfigDir() {
		return this.userConfigDir;
	}

	/**
	 * @override
	 * @return {string} cache directory tied to the user, e.g. `/data/user/<userid>/<packagename>/cache/<AppName>`
	 */
	get userCacheDir() {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throwExpression(new Error("unreachable")),
			"cache",
		);
	}

	/**
	 * @override
	 * @return {string} cache directory shared by users, same as `userCacheDir`
	 */
	get siteCacheDir() {
		return this.userCacheDir;
	}

	/**
	 * @override
	 * @return {string} state directory tied to the user, same as `userDataDir`
	 */
	get userStateDir() {
		return this.userDataDir;
	}

	/**
	 * @override
	 * @return {string} log directory tied to the user, same as `userCacheDir` if not opinionated else `log` in it, e.g. `/data/user/<userid>/<packagename>/cache/<AppName>/log`
	 */
	get userLogDir() {
		let path2 = this.userCacheDir;
		if (this.opinion) {
			path2 = path.join(path2, "log");
		}
		return path2;
	}

	/**
	 * @override
	 * @return {string} documents directory tied to the user, e.g. `/storage/emulated/0/Documents`
	 */
	get userDocumentsDir() {
		return androidDocumentsFolder();
	}

	/**
	 * @override
	 * @return {string} downloads directory tied to the user, e.g. `/storage/emulated/0/Downloads`
	 */
	get userDownloadsDir() {
		return androidDownloadsFolder();
	}

	/**
	 * @override
	 * @return {string} pictures directory tied to the user, e.g. `/storage/emulated/0/Pictures`
	 */
	get userPicturesDir() {
		return androidPicturesFolder();
	}

	/**
	 * @override
	 * @return {string} videos directory tied to the user, e.g. `/storage/emulated/0/Movies`
	 */
	get userVideosDir() {
		return androidVideosFolder();
	}

	/**
	 * @override
	 * @return {string} music directory tied to the user, e.g. `/storage/emulated/0/Music`
	 */
	get userMusicDir() {
		return androidMusicFolder();
	}

	/**
	 * @override
	 * @return {string} desktop directory tied to the user, e.g. `/storage/emulated/0/Desktop`
	 */
	get userDesktopDir() {
		return "/storage/emulated/0/Desktop";
	}

	/**
	 * @override
	 * @return {string} runtime directory tied to the user, same as `userCacheDir` if not opinionated else `tmp` in it, e.g. `/data/user/<userid>/<packagename>/cache/<AppName>/tmp`
	 */
	get userRuntimeDir() {
		let path2 = this.userCacheDir;
		if (this.opinion) {
			path2 = path.join(path2, "tmp");
		}
		return path2;
	}

	/**
	 * @override
	 * @return {string} runtime directory shared by users, same as `userRuntimeDir`
	 */
	get siteRuntimeDir() {
		return this.userRuntimeDir;
	}
}

/**
 * @return {string | undefined}
 * @ignore @internal
 */
export function _androidFolder() {
	throw new Error("Not implemented");
}

/** @return {string} */
function androidDocumentsFolder() {
	throw new Error("Not implemented");
}

/** @return {string} */
function androidDownloadsFolder() {
	throw new Error("Not implemented");
}

/** @return {string} */
function androidPicturesFolder() {
	throw new Error("Not implemented");
}

/** @return {string} */
function androidVideosFolder() {
	throw new Error("Not implemented");
}

/** @return {string} */
function androidMusicFolder() {
	throw new Error("Not implemented");
}
