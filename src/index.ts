/**
 * @module
 *
 * Utilities for determining application-specific dirs.
 *
 * See https://github.com/platformdirs/platformdirs for details and usage.
 */

import process from "node:process";
import type { Android } from "./android.js";
import type { PlatformDirsABC } from "./api.js";
import type { MacOS } from "./macos.js";
import type { Unix } from "./unix.js";
import type { Windows } from "./windows.js";

let Result: typeof Windows | typeof MacOS | typeof Unix;
if (process.platform === "win32") {
	({ Windows: Result } = await import("./windows.js"));
} else if (process.platform === "darwin") {
	({ MacOS: Result } = await import("./macos.js"));
} else {
	({ Unix: Result } = await import("./unix.js"));
}

async function setPlatformDirClass(): Promise<typeof PlatformDirsABC> {
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

export type PlatformDirs = Windows | MacOS | Unix | Android;
export const PlatformDirs:
	| typeof Windows
	| typeof MacOS
	| typeof Unix
	| typeof Android = (await setPlatformDirClass()) as
	| typeof Windows
	| typeof MacOS
	| typeof Unix
	| typeof Android;
export const AppDirs = PlatformDirs;

/**
 *
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns data directory tied to the user
 */
export function userDataDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param multipath See {@link PlatformDirs.multipath}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns data directory shared by users
 */
export function siteDataDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	multipath = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns config directory tied to the user
 */
export function userConfigDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param multipath See {@link PlatformDirs.multipath}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns config directory shared by users
 */
export function siteConfigDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	multipath = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns cache directory tied to the user
 */
export function userCacheDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns cache directory tied to the user
 */
export function siteCacheDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns state directory tied to the user
 */
export function userStateDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns log directory tied to the user
 */
export function userLogDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @returns documents directory tied to the user
 */
export function userDocumentsDir() {
	return new PlatformDirs().userDocumentsDir;
}

/**
 * @returns downloads directory tied to the user
 */
export function userDownloadsDir() {
	return new PlatformDirs().userDownloadsDir;
}

/**
 * @returns pictures directory tied to the user
 */
export function userPicturesDir() {
	return new PlatformDirs().userPicturesDir;
}

/**
 * @returns videos directory tied to the user
 */
export function userVideosDir() {
	return new PlatformDirs().userVideosDir;
}

/**
 * @returns music directory tied to the user
 */
export function userMusicDir() {
	return new PlatformDirs().userMusicDir;
}

/**
 * @returns desktop directory tied to the user
 */
export function userDesktopDir() {
	return new PlatformDirs().userDesktopDir;
}

/**
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns runtime directory tied to the user
 */
export function userRuntimeDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns runtime directory shared by users
 */
export function siteRuntimeDir(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns data path tied to the user
 */
export function userDataPath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param multipath See {@link PlatformDirs.multipath}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns data path shared by users
 */
export function siteDataPath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	multipath = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns config path tied to the user
 */
export function userConfigPath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param multipath See {@link PlatformDirs.multipath}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns config path shared by the users
 */
export function siteConfigPath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	multipath = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns cache path shared by users
 */
export function siteCachePath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns cache path tied to the user
 */
export function userCachePath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns state path tied to the user
 */
export function userStatePath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns log path tied to the user
 */
export function userLogPath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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

/** @returns documents path tied to the user */
export function userDocumentsPath() {
	return new PlatformDirs().userDocumentsPath;
}

/** @returns downloads path tied to the user */
export function userDownloadsPath() {
	return new PlatformDirs().userDownloadsPath;
}

/** @returns pictures path tied to the user */
export function userPicturesPath() {
	return new PlatformDirs().userPicturesPath;
}

/** @returns videos path tied to the user */
export function userVideosPath() {
	return new PlatformDirs().userVideosPath;
}

/** @returns music path tied to the user */
export function userMusicPath() {
	return new PlatformDirs().userMusicPath;
}

/** @returns desktop path tied to the user */
export function userDesktopPath() {
	return new PlatformDirs().userDesktopPath;
}

/**
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns runtime path tied to the user
 */
export function userRuntimePath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param opinion See {@link PlatformDirs.opinion}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns runtime path shared by users
 */
export function siteRuntimePath(
	appname?: string,
	appauthor?: string | false,
	version?: string,
	opinion = true,
	ensureExists = false,
): string {
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
