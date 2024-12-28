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
import type { PlatformDirsABC } from "./api.js";
import type { Unix } from "./unix.js";

// Pyright assumes `sys.platform` is `""`, so it hits the else block.
let Result: typeof Unix;
if (process.platform === "win32") {
	// @ts-ignore Windows is missing some Unix protected methods.
	({ Windows: Result } = await import("./windows.ts"));
} else if (process.platform === "darwin") {
	// @ts-ignore MacOS is missing some Unix protected methods.
	({ MacOS: Result } = await import("./macos.ts"));
} else {
	({ Unix: Result } = await import("./unix.ts"));
}

async function setPlatformDirClass(): Promise<typeof PlatformDirsABC> {
	if (
		process.env.ANDROID_DATA === "/data" &&
		process.env.ANDROID_ROOT === "/system"
	) {
		if (process.env.SHELL || process.env.PREFIX) {
			return Result;
		}

		const { _androidFolder } = await import("./android.ts");

		if (_androidFolder() != null) {
			const { Android } = await import("./android.ts");

			return Android;
		}
	}

	return Result;
}

export type PlatformDirs = Unix;
// @ts-ignore PlatformDirsABC is missing some Unix protected methods. That's OK.
export const PlatformDirs: typeof Unix = await setPlatformDirClass();

export type AppDirs = Unix;
export const AppDirs: typeof Unix = PlatformDirs;

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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	roaming: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	multipath: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	roaming: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	multipath: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	roaming: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
export function userDocumentsDir(): string {
	return new PlatformDirs().userDocumentsDir;
}

/**
 * @returns downloads directory tied to the user
 */
export function userDownloadsDir(): string {
	return new PlatformDirs().userDownloadsDir;
}

/**
 * @returns pictures directory tied to the user
 */
export function userPicturesDir(): string {
	return new PlatformDirs().userPicturesDir;
}

/**
 * @returns videos directory tied to the user
 */
export function userVideosDir(): string {
	return new PlatformDirs().userVideosDir;
}

/**
 * @returns music directory tied to the user
 */
export function userMusicDir(): string {
	return new PlatformDirs().userMusicDir;
}

/**
 * @returns desktop directory tied to the user
 */
export function userDesktopDir(): string {
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns data path tied to the user
 */
export function userDataPath(
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	roaming: boolean = false,
	ensureExists: boolean = false,
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param multipath See {@link PlatformDirs.multipath}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns data path shared by users
 */
export function siteDataPath(
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	multipath: boolean = false,
	ensureExists: boolean = false,
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
 * @param appname See {@link PlatformDirs.appname}
 * @param appauthor See {@link PlatformDirs.appauthor}
 * @param version See {@link PlatformDirs.version}
 * @param roaming See {@link PlatformDirs.roaming}
 * @param ensureExists See {@link PlatformDirs.ensureExists}
 * @returns config path tied to the user
 */
export function userConfigPath(
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	roaming: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	multipath: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	roaming: boolean = false,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
export function userDocumentsPath(): string {
	return new PlatformDirs().userDocumentsPath;
}

/** @returns downloads path tied to the user */
export function userDownloadsPath(): string {
	return new PlatformDirs().userDownloadsPath;
}

/** @returns pictures path tied to the user */
export function userPicturesPath(): string {
	return new PlatformDirs().userPicturesPath;
}

/** @returns videos path tied to the user */
export function userVideosPath(): string {
	return new PlatformDirs().userVideosPath;
}

/** @returns music path tied to the user */
export function userMusicPath(): string {
	return new PlatformDirs().userMusicPath;
}

/** @returns desktop path tied to the user */
export function userDesktopPath(): string {
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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
	appname: string | undefined = undefined,
	appauthor: string | false | undefined = undefined,
	version: string | undefined = undefined,
	opinion: boolean = true,
	ensureExists: boolean = false,
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

export { PlatformDirsABC } from "./api.ts";
export { version, versionTuple as versionInfo } from "./version.ts";
