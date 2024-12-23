/**
 * @module
 *
 * platformdirs is a library to determine platform-specific system directories. This includes directories where to place cache files, user data, configuration, etc.
 *
 * The source code and issue tracker are both hosted on [GitHub](https://github.com/jcbhmr/platformdirs.js).
 *
 * Utilities for determining application-specific dirs.
 *
 * See https://github.com/jcbhmr/platformdirs.js for details and usage.
 */

import process from "node:process";
/**
 * @import { Android } from "./android.js";
 * @import { PlatformDirsABC } from "./api.js";
 * @import { MacOS } from "./macos.js";
 * @import { Unix } from "./unix.js";
 * @import { Windows } from "./windows.js";
 */

// Pyright assumes `sys.platform` is `""`, so it hits the else block.
/** @type {typeof Unix} */
let Result;
if (process.platform === "win32") {
	({ Windows: Result } = await import("./windows.js"));
} else if (process.platform === "darwin") {
	({ MacOS: Result } = await import("./macos.js"));
} else {
	({ Unix: Result } = await import("./unix.js"));
}

/** @return {Promise<typeof PlatformDirsABC>} */
async function setPlatformDirClass() {
	if (
		process.env.ANDROID_DATA === "/data" &&
		process.env.ANDROID_ROOT === "/system"
	) {
		if (process.env.SHELL || process.env.PREFIX) {
			return Result;
		}

		const { _androidFolder } = await import("./android.js");

		if (_androidFolder() != null) {
			const { Android } = await import("./android.js");

			return Android;
		}
	}

	return Result;
}

// There's a type-only workaround that sets "Unix" as the default type for PlatformDirs.
/** @typedef {Unix} PlatformDirs */

/** @type {typeof Unix} */
export const PlatformDirs = await setPlatformDirClass();

/** @type {typeof Unix} */
export const AppDirs = PlatformDirs;

/**
 *
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string | false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [roaming=false] See {@link PlatformDirs.roaming}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} data directory tied to the user
 */
export function userDataDir(
	appname,
	appauthor,
	version,
	roaming = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		roaming,
		undefined,
		undefined,
		ensureExists,
	).userDataDir;
}

/**
 *
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string | false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [multipath=false] See {@link PlatformDirs.multipath}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} data directory shared by users
 */
export function siteDataDir(
	appname,
	appauthor,
	version,
	multipath = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		multipath,
		undefined,
		ensureExists,
	).siteDataDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string | false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [roaming=false] See {@link PlatformDirs.roaming}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} config directory tied to the user
 */
export function userConfigDir(
	appname,
	appauthor,
	version,
	roaming = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		roaming,
		undefined,
		undefined,
		ensureExists,
	).userConfigDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string | false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [multipath=false] See {@link PlatformDirs.multipath}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} config directory shared by users
 */
export function siteConfigDir(
	appname,
	appauthor,
	version,
	multipath = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		multipath,
		undefined,
		ensureExists,
	).siteConfigDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string | false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} cache directory tied to the user
 */
export function userCacheDir(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).userCacheDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} cache directory tied to the user
 */
export function siteCacheDir(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).siteCacheDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [roaming=false] See {@link PlatformDirs.roaming}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} state directory tied to the user
 */
export function userStateDir(
	appname,
	appauthor,
	version,
	roaming = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		roaming,
		undefined,
		undefined,
		ensureExists,
	).userStateDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} log directory tied to the user
 */
export function userLogDir(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).userLogDir;
}

/**
 * @returns {string} documents directory tied to the user
 */
export function userDocumentsDir() {
	return new PlatformDirs().userDocumentsDir;
}

/**
 * @returns {string} downloads directory tied to the user
 */
export function userDownloadsDir() {
	return new PlatformDirs().userDownloadsDir;
}

/**
 * @returns {string} pictures directory tied to the user
 */
export function userPicturesDir() {
	return new PlatformDirs().userPicturesDir;
}

/**
 * @returns {string} videos directory tied to the user
 */
export function userVideosDir() {
	return new PlatformDirs().userVideosDir;
}

/**
 * @returns {string} music directory tied to the user
 */
export function userMusicDir() {
	return new PlatformDirs().userMusicDir;
}

/**
 * @returns {string} desktop directory tied to the user
 */
export function userDesktopDir() {
	return new PlatformDirs().userDesktopDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} runtime directory tied to the user
 */
export function userRuntimeDir(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).userRuntimeDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns runtime directory shared by users
 */
export function siteRuntimeDir(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).siteRuntimeDir;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [roaming=false] See {@link PlatformDirs.roaming}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns data path tied to the user
 */
export function userDataPath(
	appname,
	appauthor,
	version,
	roaming = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		roaming,
		undefined,
		undefined,
		ensureExists,
	).userDataPath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [multipath=false] See {@link PlatformDirs.multipath}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns data path shared by users
 */
export function siteDataPath(
	appname,
	appauthor,
	version,
	multipath = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		multipath,
		undefined,
		ensureExists,
	).siteDataPath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [roaming=false] See {@link PlatformDirs.roaming}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} config path tied to the user
 */
export function userConfigPath(
	appname,
	appauthor,
	version,
	roaming = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		roaming,
		undefined,
		undefined,
		ensureExists,
	).userConfigPath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [multipath=false] See {@link PlatformDirs.multipath}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} config path shared by the users
 */
export function siteConfigPath(
	appname,
	appauthor,
	version,
	multipath = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		multipath,
		undefined,
		ensureExists,
	).siteConfigPath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} cache path shared by users
 */
export function siteCachePath(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).siteCachePath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} cache path tied to the user
 */
export function userCachePath(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).userCachePath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [roaming=false] See {@link PlatformDirs.roaming}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} state path tied to the user
 */
export function userStatePath(
	appname,
	appauthor,
	version,
	roaming = false,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		roaming,
		undefined,
		undefined,
		ensureExists,
	).userStatePath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} log path tied to the user
 */
export function userLogPath(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).userLogPath;
}

/** @returns {string} documents path tied to the user */
export function userDocumentsPath() {
	return new PlatformDirs().userDocumentsPath;
}

/** @returns {string} downloads path tied to the user */
export function userDownloadsPath() {
	return new PlatformDirs().userDownloadsPath;
}

/** @returns {string} pictures path tied to the user */
export function userPicturesPath() {
	return new PlatformDirs().userPicturesPath;
}

/** @returns {string} videos path tied to the user */
export function userVideosPath() {
	return new PlatformDirs().userVideosPath;
}

/** @returns {string} music path tied to the user */
export function userMusicPath() {
	return new PlatformDirs().userMusicPath;
}

/** @returns {string} desktop path tied to the user */
export function userDesktopPath() {
	return new PlatformDirs().userDesktopPath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} runtime path tied to the user
 */
export function userRuntimePath(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).userRuntimePath;
}

/**
 * @param {string} [appname] See {@link PlatformDirs.appname}
 * @param {string|false} [appauthor] See {@link PlatformDirs.appauthor}
 * @param {string} [version] See {@link PlatformDirs.version}
 * @param {boolean} [opinion=true] See {@link PlatformDirs.opinion}
 * @param {boolean} [ensureExists=false] See {@link PlatformDirs.ensureExists}
 * @returns {string} runtime path shared by users
 */
export function siteRuntimePath(
	appname,
	appauthor,
	version,
	opinion = true,
	ensureExists = false,
) {
	return new PlatformDirs(
		appname,
		appauthor,
		version,
		undefined,
		undefined,
		opinion,
		ensureExists,
	).siteRuntimePath;
}

export { PlatformDirsABC } from "./api.js";
export { version, versionTuple as versionInfo } from "./version.js";
