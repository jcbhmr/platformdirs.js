/**
 * @module
 * Windows.
 */

import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";

/**
 * [MSDN on where to store app data
 * files](https://learn.microsoft.com/en-us/windows/win32/shell/knownfolderid)
 *
 * Makes use of the {@link PlatformDirsABC.appname},
 * {@link PlatformDirsABC.appauthor}, {@link PlatformDirsABC.version},
 * {@link PlatformDirsABC.roaming}, {@link PlatformDirsABC.opinion},
 * {@link PlatformDirsABC.ensureExists}.
 */
export class Windows extends PlatformDirsABC {
	/**
	 * @return {string} data directory tied to the user, e.g. `%USERPROFILE%\AppData\Local\$appauthor\$appname` (not roaming) or `%USERPROFILE%\AppData\Roaming\$appauthor\$appname` (roaming)
	 * @override
	 */
	get userDataDir() {
		const const2 = this.roaming ? "CSIDL_APPDATA" : "CSIDL_LOCAL_APPDATA";
		const path2 = path.normalize(getWinFolder(const2));
		return this._appendParts(path2);
	}

	/**
	 * @protected
	 * @param {string} path2
	 * @param {{ opinionValue?: string | undefined }} [param1]
	 * @return {string}
	 */
	_appendParts(path2, { opinionValue } = {}) {
		const params = [];
		if (this.appname) {
			if (this.appauthor !== false) {
				const author = this.appauthor || this.appname;
				params.push(author);
			}
			params.push(this.appname);
			if (opinionValue !== undefined && this.opinion) {
				params.push(opinionValue);
			}
			if (this.version) {
				params.push(this.version);
			}
		}
		const path3 = path.join(path2, ...params);
		this._optionallyCreateDirectory(path3);
		return path3;
	}

	/**
	 * @return {string} data directory shared by users, e.g. `C:\ProgramData\$appauthor\$appname`
	 * @override
	 */
	get siteDataDir() {
		const path2 = path.normalize(getWinFolder("CSIDL_COMMON_APPDATA"));
		return this._appendParts(path2);
	}

	/**
	 * @override
	 * @return {string} config directory tied to the user, same as `userDataDir`
	 */
	get userConfigDir() {
		return this.userDataDir;
	}

	/**
	 * @return {string} config directory shared by users, same as `siteDataDir`
	 * @override
	 */
	get siteConfigDir() {
		return this.siteDataDir;
	}

	/**
	 * @override
	 * @return {string} cache directory tied to the user (if opinionated with `Cache` folder within `$appname`) e.g. `%USERPROFILE%\AppData\Local\$appauthor\$appname\Cache\$version`
	 */
	get userCacheDir() {
		const path2 = path.normalize(getWinFolder("CSIDL_LOCAL_APPDATA"));
		return this._appendParts(path2, { opinionValue: "Cache" });
	}

	/**
	 * @override
	 * @return {string} cache directory shared by users, e.g. `C:\ProgramData\$appauthor\$appname\Cache\$version`
	 */
	get siteCacheDir() {
		const path2 = path.normalize(getWinFolder("CSIDL_COMMON_APPDATA"));
		return this._appendParts(path2, { opinionValue: "Cache" });
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
	 * @return {string} log directory tied to the user, same as `userCacheDir` if not opinionated else `log` in it
	 */
	get userLogDir() {
		let path2 = this.userDataDir;
		if (this.opinion) {
			path2 = path.join(path2, "Logs");
			this._optionallyCreateDirectory(path2);
		}
		return path2;
	}

	/**
	 * @return {string} documents directory tied to the user, e.g. `%USERPROFILE%\Documents`
	 * @override
	 */
	get userDocumentsDir() {
		return path.normalize(getWinFolder("CSIDL_PERSONAL"));
	}

	/**
	 * @override
	 * @return {string} downloads directory tied to the user, e.g. `%USERPROFILE%\Downloads`
	 */
	get userDownloadsDir() {
		return path.normalize(getWinFolder("CSIDL_DOWNLOADS"));
	}

	/**
	 * @override
	 * @return {string} pictures directory tied to the user, e.g. `%USERPROFILE%\Pictures`
	 */
	get userPicturesDir() {
		return path.normalize(getWinFolder("CSIDL_MYPICTURES"));
	}

	/**
	 * @override
	 * @return {string} videos directory tied to the user, e.g. `%USERPROFILE%\Videos`
	 */
	get userVideosDir() {
		return path.normalize(getWinFolder("CSIDL_MYVIDEO"));
	}

	/**
	 * @override
	 * @return {string} music directory tied to the user, e.g. `%USERPROFILE%\Music`
	 */
	get userMusicDir() {
		return path.normalize(getWinFolder("CSIDL_MYMUSIC"));
	}

	/**
	 * @override
	 * @return {string} desktop directory tied to the user, e.g. `%USERPROFILE%\Desktop`
	 */
	get userDesktopDir() {
		return path.normalize(getWinFolder("CSIDL_DESKTOPDIRECTORY"));
	}

	/**
	 * @override
	 * @return {string} runtime directory tied to the user, e.g. `%USERPROFILE%\AppData\Local\Temp\$appauthor\$appname`
	 */
	get userRuntimeDir() {
		const path2 = path.normalize(
			path.join(getWinFolder("CSIDL_LOCAL_APPDATA"), "Temp"),
		);
		return this._appendParts(path2);
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
 * Get folder from environment variable
 * @param {string} csidlName
 * @return {string}
 */
function getWinFolderFromEnvVars(csidlName) {
	let result = getWinFolderIfCSIDLNameNotEnvVar(csidlName);
	if (result !== undefined) {
		return result;
	}

	if (csidlName === "CSIDL_APPDATA") {
		result = process.env.APPDATA;
		if (result === undefined) {
			throw new Error("Unset environment variable: APPDATA");
		}
	} else if (csidlName === "CSIDL_COMMON_APPDATA") {
		result = process.env.ALLUSERSPROFILE;
		if (result === undefined) {
			throw new Error("Unset environment variable: ALLUSERSPROFILE");
		}
	} else if (csidlName === "CSIDL_LOCAL_APPDATA") {
		result = process.env.LOCALAPPDATA;
		if (result === undefined) {
			throw new Error("Unset environment variable: LOCALAPPDATA");
		}
	} else {
		throw new Error(`Unknown CSIDL name: ${csidlName}`);
	}
	return result;
}

/**
 * Get a folder for a CSIDL name that does not exist as an environment variable.
 * @param {string} csidlName
 * @return {string | undefined}
 */
function getWinFolderIfCSIDLNameNotEnvVar(csidlName) {
	if (csidlName === "CSIDL_PERSONAL") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Documents");
	}
	if (csidlName === "CSIDL_DOWNLOADS") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Downloads");
	}
	if (csidlName === "CSIDL_MYPICTURES") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Pictures");
	}
	if (csidlName === "CSIDL_MYVIDEO") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Videos");
	}
	if (csidlName === "CSIDL_MYMUSIC") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Music");
	}
	return undefined;
}

// function getWinFolderFromRegistry(csidlName: string): string {
//   throw new Error("Not implemented");
// }

// function getWinFolderViaCTypes(csidlName: string): string {
//   throw new Error("Not implemented");
// }

/**
 * @returns {(csidlName: string) => string}
 */
function pickGetWinFolder() {
	return getWinFolderFromEnvVars;
}

const getWinFolder = pickGetWinFolder();
