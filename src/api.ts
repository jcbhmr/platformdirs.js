/**
 * Base API.
 * @module
 */

import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Abstract base class for platform directories.
 */
export abstract class PlatformDirsABC {
	/**
	 * The name of the application.
	 */
	appname: string | undefined;
	/**
	 * The name of the app author or distributing body for this application.
	 *
	 * Typically it is the owning company name. Defaults to `appname`. You may pass `false` to disable it.
	 */
	appauthor: string | false | undefined;
	/**
	 * An optional version path element to append to the path.
	 *
	 * You might want to use this if you want multiple versions of your app to be able to run independently. If used, this would typically be `<major>.<minor>`.
	 */
	version: string | undefined;
	/**
	 * Whether to use the roaming appdata directory on Windows.
	 *
	 * That means that for users on a Windows network setup for roaming profiles, this user data will be synced on login (see [here](https://technet.microsoft.com/en-us/library/cc766489(WS.10).aspx)).
	 */
	roaming: boolean;
	/**
	 * An optional parameter which indicates that the entire list of data dirs should be returned.
	 *
	 * By default, the first item would only be returned.
	 */
	multipath: boolean;
	/**
	 * A flag to indicating to use opinionated values.
	 */
	opinion: boolean;
	/**
	 * Optionally create the directory (and any missing parents) upon access if
	 * it does not exist.
	 *
	 * By default, no directories are created.
	 *
	 * ⚠️ Since the getters (`dirs.userDataDir`, etc.) are synchronous, the
	 * directory creation will use `fs.mkdirSync()` which **is a blocking
	 * synchronous operation** to ensure that the returned path does indeed
	 * exist before returning the path to the caller. This is for convenience.
	 * If you require non-blocking async operation you should set this to
	 * `false` and use `fs.mkdir()` or `fsPromises.mkdir()` yourself.
	 */
	ensureExists: boolean;
	/**
	 * Create a new platform directory.
	 * @param appname See `appname`
	 * @param appauthor See `appauthor`
	 * @param version See `version`
	 * @param roaming See `roaming`
	 * @param multipath See `multipath`
	 * @param opinion See `opinion`
	 * @param ensureExists See `ensureExists`
	 */
	constructor(
		appname?: string,
		appauthor?: string | false,
		version?: string,
		roaming = false,
		multipath = false,
		opinion = true,
		ensureExists = false,
	) {
		this.appname = appname;
		this.appauthor = appauthor;
		this.version = version;
		this.roaming = roaming;
		this.multipath = multipath;
		this.opinion = opinion;
		this.ensureExists = ensureExists;
	}

	/** @ignore @internal */
	protected _appendAppNameAndVersion(...base: string[]): string {
		const params = base.slice(1);
		if (this.appname) {
			params.push(this.appname);
			if (this.version) {
				params.push(this.version);
			}
		}
		const path2 = path.join(base[0], ...params);
		this._optionallyCreateDirectory(path2);
		return path2;
	}

	/** @ignore @internal */
	protected _optionallyCreateDirectory(dir: string): void {
		if (this.ensureExists) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}

	/** @ignore @internal */
	protected _firstItemAsPathIfMultipath(directory: string): string {
		if (this.multipath) {
			return directory.split(path.delimiter)[0];
		}
		return directory;
	}

	/**
	 * @return data directory tied to the user
	 */
	abstract get userDataDir(): string;

	/**
	 * @return data directory shared by users
	 */
	abstract get siteDataDir(): string;

	/**
	 * @return config directory tied to the user
	 */
	abstract get userConfigDir(): string;

	/**
	 * @return config directory shared by users
	 */
	abstract get siteConfigDir(): string;

	/**
	 * @return cache directory tied to the user
	 */
	abstract get userCacheDir(): string;

	/**
	 * @return cache directory shared by users
	 */
	abstract get siteCacheDir(): string;

	/**
	 * @return state directory tied to the user
	 */
	abstract get userStateDir(): string;

	/**
	 * @return log directory tied to the user
	 */
	abstract get userLogDir(): string;

	/**
	 * @return documents directory tied to the user
	 */
	abstract get userDocumentsDir(): string;

	/**
	 * @return downloads directory tied to the user
	 */
	abstract get userDownloadsDir(): string;

	/**
	 * @return pictures directory tied to the user
	 */
	abstract get userPicturesDir(): string;

	/**
	 * @return videos directory tied to the user
	 */
	abstract get userVideosDir(): string;

	/**
	 * @return music directory tied to the user
	 */
	abstract get userMusicDir(): string;

	/**
	 * @return desktop directory tied to the user
	 */
	abstract get userDesktopDir(): string;

	/**
	 * @return runtime directory tied to the user
	 */
	abstract get userRuntimeDir(): string;

	/**
	 * @return runtime directory shared by users
	 */
	abstract get siteRuntimeDir(): string;

	/**
	 * @return data path tied to the user
	 */
	get userDataPath(): string {
		return this.userDataDir;
	}

	/**
	 * @return data path shared by users
	 */
	get siteDataPath(): string {
		return this.siteDataDir;
	}

	/**
	 * @return config path tied to the user
	 */
	get userConfigPath(): string {
		return this.userConfigDir;
	}

	/**
	 * @return config path shared by users
	 */
	get siteConfigPath(): string {
		return this.siteConfigDir;
	}

	/**
	 * @return cache path tied to the user
	 */
	get userCachePath(): string {
		return this.userCacheDir;
	}

	/**
	 * @return cache path shared by users
	 */
	get siteCachePath(): string {
		return this.siteCacheDir;
	}

	/**
	 * @return state path tied to the user
	 */
	get userStatePath(): string {
		return this.userStateDir;
	}

	/**
	 * @return log path tied to the user
	 */
	get userLogPath(): string {
		return this.userLogDir;
	}

	/**
	 * @return documents path tied to the user
	 */
	get userDocumentsPath(): string {
		return this.userDocumentsDir;
	}

	/**
	 * @return downloads path tied to the user
	 */
	get userDownloadsPath(): string {
		return this.userDownloadsDir;
	}

	/**
	 * @return pictures path tied to the user
	 */
	get userPicturesPath(): string {
		return this.userPicturesDir;
	}

	/**
	 * @return videos path tied to the user
	 */
	get userVideosPath(): string {
		return this.userVideosDir;
	}

	/**
	 * @return music path tied to the user
	 */
	get userMusicPath(): string {
		return this.userMusicDir;
	}

	/**
	 * @return desktop path tied to the user
	 */
	get userDesktopPath(): string {
		return this.userDesktopDir;
	}

	/**
	 * @return runtime path tied to the user
	 */
	get userRuntimePath(): string {
		return this.userRuntimeDir;
	}

	/**
	 * @return runtime path shared by users
	 */
	get siteRuntimePath(): string {
		return this.siteRuntimeDir;
	}

	/**
	 * @yields all user and site configuration directories
	 */
	*iterConfigDirs(): Generator<string> {
		yield this.userConfigDir;
		yield this.siteConfigDir;
	}

	/**
	 * @yields all user and site data directories
	 */
	*iterDataDirs(): Generator<string> {
		yield this.userDataDir;
		yield this.siteDataDir;
	}

	/**
	 * @yields all user and site cache directories
	 */
	*iterCacheDirs(): Generator<string> {
		yield this.userCacheDir;
		yield this.siteCacheDir;
	}

	/**
	 * @yields all user and site runtime directories
	 */
	*iterRuntimeDirs(): Generator<string> {
		yield this.userRuntimeDir;
		yield this.siteRuntimeDir;
	}

	/**
	 * @yields all user and site state directories
	 */
	*iterConfigPaths(): Generator<string> {
		yield* this.iterConfigDirs();
	}

	/**
	 * @yields all user and site data directories
	 */
	*iterDataPaths(): Generator<string> {
		yield* this.iterDataDirs();
	}

	/**
	 * @yields all user and site cache directories
	 */
	*iterCachePaths(): Generator<string> {
		yield* this.iterCacheDirs();
	}

	/**
	 * @yields all user and site runtime directories
	 */
	*iterRuntimePaths(): Generator<string> {
		yield* this.iterRuntimeDirs();
	}
}
