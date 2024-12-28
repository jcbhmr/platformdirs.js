/**
 * @module
 * Windows.
 */

import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.ts";

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
	 * @return data directory tied to the user, e.g. `%USERPROFILE%\AppData\Local\$appauthor\$appname` (not roaming) or `%USERPROFILE%\AppData\Roaming\$appauthor\$appname` (roaming)
	 */
	override get userDataDir(): string {
		const const2 = this.roaming ? "CSIDL_APPDATA" : "CSIDL_LOCAL_APPDATA";
		const path2 = path.normalize(getWinFolder(const2));
		return this._appendParts(path2);
	}

	protected _appendParts(path2: string, { opinionValue }: { opinionValue?: string | undefined; } = {}): string {
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
	 * @return data directory shared by users, e.g. `C:\ProgramData\$appauthor\$appname`
	 */
	override get siteDataDir(): string {
		const path2 = path.normalize(getWinFolder("CSIDL_COMMON_APPDATA"));
		return this._appendParts(path2);
	}

	/**
	 * @return config directory tied to the user, same as `userDataDir`
	 */
	override get userConfigDir(): string {
		return this.userDataDir;
	}

	/**
	 * @return config directory shared by users, same as `siteDataDir`
	 */
	override get siteConfigDir(): string {
		return this.siteDataDir;
	}

	/**
	 * @return cache directory tied to the user (if opinionated with `Cache` folder within `$appname`) e.g. `%USERPROFILE%\AppData\Local\$appauthor\$appname\Cache\$version`
	 */
	override get userCacheDir(): string {
		const path2 = path.normalize(getWinFolder("CSIDL_LOCAL_APPDATA"));
		return this._appendParts(path2, { opinionValue: "Cache" });
	}

	/**
	 * @return cache directory shared by users, e.g. `C:\ProgramData\$appauthor\$appname\Cache\$version`
	 */
	override get siteCacheDir(): string {
		const path2 = path.normalize(getWinFolder("CSIDL_COMMON_APPDATA"));
		return this._appendParts(path2, { opinionValue: "Cache" });
	}

	/**
	 * @return state directory tied to the user, same as `userDataDir`
	 */
	override get userStateDir(): string {
		return this.userDataDir;
	}

	/**
	 * @return log directory tied to the user, same as `userCacheDir` if not opinionated else `log` in it
	 */
	override get userLogDir(): string {
		let path2 = this.userDataDir;
		if (this.opinion) {
			path2 = path.join(path2, "Logs");
			this._optionallyCreateDirectory(path2);
		}
		return path2;
	}

	/**
	 * @return documents directory tied to the user, e.g. `%USERPROFILE%\Documents`
	 */
	override get userDocumentsDir(): string {
		return path.normalize(getWinFolder("CSIDL_PERSONAL"));
	}

	/**
	 * @return downloads directory tied to the user, e.g. `%USERPROFILE%\Downloads`
	 */
	override get userDownloadsDir(): string {
		return path.normalize(getWinFolder("CSIDL_DOWNLOADS"));
	}

	/**
	 * @return pictures directory tied to the user, e.g. `%USERPROFILE%\Pictures`
	 */
	override get userPicturesDir(): string {
		return path.normalize(getWinFolder("CSIDL_MYPICTURES"));
	}

	/**
	 * @return videos directory tied to the user, e.g. `%USERPROFILE%\Videos`
	 */
	override get userVideosDir(): string {
		return path.normalize(getWinFolder("CSIDL_MYVIDEO"));
	}

	/**
	 * @return music directory tied to the user, e.g. `%USERPROFILE%\Music`
	 */
	override get userMusicDir(): string {
		return path.normalize(getWinFolder("CSIDL_MYMUSIC"));
	}

	/**
	 * @return desktop directory tied to the user, e.g. `%USERPROFILE%\Desktop`
	 */
	override get userDesktopDir(): string {
		return path.normalize(getWinFolder("CSIDL_DESKTOPDIRECTORY"));
	}

	/**
	 * @return runtime directory tied to the user, e.g. `%USERPROFILE%\AppData\Local\Temp\$appauthor\$appname`
	 */
	override get userRuntimeDir(): string {
		const path2 = path.normalize(
			path.join(getWinFolder("CSIDL_LOCAL_APPDATA"), "Temp"),
		);
		return this._appendParts(path2);
	}

	/**
	 * @return runtime directory shared by users, same as `userRuntimeDir`
	 */
	override get siteRuntimeDir(): string {
		return this.userRuntimeDir;
	}
}

/**
 * Get folder from environment variable
 */
function getWinFolderFromEnvVars(csidlName: string): string {
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
 */
function getWinFolderIfCSIDLNameNotEnvVar(csidlName: string): string | undefined {
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

function pickGetWinFolder(): (csidlName: string) => string {
	return getWinFolderFromEnvVars;
}

const getWinFolder = pickGetWinFolder();
