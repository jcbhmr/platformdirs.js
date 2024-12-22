/**
 * Base API.
 * @module
 */

import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Abstract base class for platform directories.
 * @abstract
 */
export class PlatformDirsABC {
	/**
	 * The name of the application.
	 * @type {string|undefined}
	 */
	appname;
	/**
	 * The name of the app author or distributing body for this application.
	 *
	 * Typically it is the owning company name. Defaults to `appname`. You may pass `false` to disable it.
	 * @type {string|false|undefined}
	 */
	appauthor;
	/**
	 * An optional version path element to append to the path.
	 *
	 * You might want to use this if you want multiple versions of your app to be able to run independently. If used, this would typically be `<major>.<minor>`.
	 * @type {string|undefined}
	 */
	version;
	/**
	 * Whether to use the roaming appdata directory on Windows.
	 *
	 * That means that for users on a Windows network setup for roaming profiles, this user data will be synced on login (see [here](https://technet.microsoft.com/en-us/library/cc766489(WS.10).aspx)).
	 * @type {boolean}
	 */
	roaming;
	/**
	 * An optional parameter which indicates that the entire list of data dirs should be returned.
	 *
	 * By default, the first item would only be returned.
	 * @type {boolean}
	 */
	multipath;
	/**
	 * A flag to indicating to use opinionated values.
	 * @type {boolean}
	 */
	opinion;
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
	 * @type {boolean}
	 */
	ensureExists;
	/**
	 * Create a new platform directory.
	 * @param {string} [appname] - See `appname`
	 * @param {string|false} [appauthor] - See `appauthor`
	 * @param {string} [version] - See `version`
	 * @param {boolean} [roaming=false] - See `roaming`
	 * @param {boolean} [multipath=false] - See `multipath`
	 * @param {boolean} [opinion=true] - See `opinion`
	 * @param {boolean} [ensureExists=false] - See `ensureExists`
	 */
	constructor(
		appname,
		appauthor,
		version,
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

	/**
	 * @param {string[]} base
	 * @return {string}
	 * @protected @ignore @internal
	 */
	_appendAppNameAndVersion(...base) {
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

	/**
	 * @param {string} dir
	 * @protected @ignore @internal
	 */
	_optionallyCreateDirectory(dir) {
		if (this.ensureExists) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}

	/**
	 * @param {string} directory
	 * @return {string}
	 * @protected @ignore @internal
	 */
	_firstItemAsPathIfMultipath(directory) {
		if (this.multipath) {
			return directory.split(path.delimiter)[0];
		}
		return directory;
	}

	/**
	 * @return {string} data directory tied to the user
	 * @abstract
	 */
	get userDataDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} data directory shared by users
	 * @abstract
	 */
	get siteDataDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} config directory tied to the user
	 * @abstract
	 */
	get userConfigDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} config directory shared by users
	 * @abstract
	 */
	get siteConfigDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} cache directory tied to the user
	 * @abstract
	 */
	get userCacheDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} cache directory shared by users
	 * @abstract
	 */
	get siteCacheDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} state directory tied to the user
	 * @abstract
	 */
	get userStateDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} log directory tied to the user
	 * @abstract
	 */
	get userLogDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} documents directory tied to the user
	 * @abstract
	 */
	get userDocumentsDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} downloads directory tied to the user
	 * @abstract
	 */
	get userDownloadsDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} pictures directory tied to the user
	 * @abstract
	 */
	get userPicturesDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} videos directory tied to the user
	 * @abstract
	 */
	get userVideosDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} music directory tied to the user
	 * @abstract
	 */
	get userMusicDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} desktop directory tied to the user
	 * @abstract
	 */
	get userDesktopDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} runtime directory tied to the user
	 * @abstract
	 */
	get userRuntimeDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} runtime directory shared by users
	 * @abstract
	 */
	get siteRuntimeDir() {
		throw new Error("abstract");
	}

	/**
	 * @return {string} data path tied to the user
	 */
	get userDataPath() {
		return this.userDataDir;
	}

	/**
	 * @return {string} data path shared by users
	 */
	get siteDataPath() {
		return this.siteDataDir;
	}

	/**
	 * @return {string} config path tied to the user
	 */
	get userConfigPath() {
		return this.userConfigDir;
	}

	/**
	 * @return {string} config path shared by users
	 */
	get siteConfigPath() {
		return this.siteConfigDir;
	}

	/**
	 * @return {string} cache path tied to the user
	 */
	get userCachePath() {
		return this.userCacheDir;
	}

	/**
	 * @return {string} cache path shared by users
	 */
	get siteCachePath() {
		return this.siteCacheDir;
	}

	/**
	 * @return {string} state path tied to the user
	 */
	get userStatePath() {
		return this.userStateDir;
	}

	/**
	 * @return {string} log path tied to the user
	 */
	get userLogPath() {
		return this.userLogDir;
	}

	/**
	 * @return {string} documents path tied to the user
	 */
	get userDocumentsPath() {
		return this.userDocumentsDir;
	}

	/**
	 * @return {string} downloads path tied to the user
	 */
	get userDownloadsPath() {
		return this.userDownloadsDir;
	}

	/**
	 * @return {string} pictures path tied to the user
	 */
	get userPicturesPath() {
		return this.userPicturesDir;
	}

	/**
	 * @return {string} videos path tied to the user
	 */
	get userVideosPath() {
		return this.userVideosDir;
	}

	/**
	 * @return {string} music path tied to the user
	 */
	get userMusicPath() {
		return this.userMusicDir;
	}

	/**
	 * @return {string} desktop path tied to the user
	 */
	get userDesktopPath() {
		return this.userDesktopDir;
	}

	/**
	 * @return {string} runtime path tied to the user
	 */
	get userRuntimePath() {
		return this.userRuntimeDir;
	}

	/**
	 * @return {string} runtime path shared by users
	 */
	get siteRuntimePath() {
		return this.siteRuntimeDir;
	}

	// https://github.com/microsoft/TypeScript/issues/23857

	/**
	 * @yields all user and site configuration directories
	 * @returns {Generator<string>}
	 */
	*iterConfigDirs() {
		yield this.userConfigDir;
		yield this.siteConfigDir;
	}

	/**
	 * @yields all user and site data directories
	 * @returns {Generator<string>}
	 */
	*iterDataDirs() {
		yield this.userDataDir;
		yield this.siteDataDir;
	}

	/**
	 * @yields all user and site cache directories
	 * @returns {Generator<string>}
	 */
	*iterCacheDirs() {
		yield this.userCacheDir;
		yield this.siteCacheDir;
	}

	/**
	 * @yields all user and site runtime directories
	 * @returns {Generator<string>}
	 */
	*iterRuntimeDirs() {
		yield this.userRuntimeDir;
		yield this.siteRuntimeDir;
	}

	/**
	 * @yields all user and site state directories
	 * @returns {Generator<string>}
	 */
	*iterConfigPaths() {
		yield* this.iterConfigDirs();
	}

	/**
	 * @yields all user and site data directories
	 * @returns {Generator<string>}
	 */
	*iterDataPaths() {
		yield* this.iterDataDirs();
	}

	/**
	 * @yields all user and site cache directories
	 * @returns {Generator<string>}
	 */
	*iterCachePaths() {
		yield* this.iterCacheDirs();
	}

	/**
	 * @yields all user and site runtime directories
	 * @returns {Generator<string>}
	 */
	*iterRuntimePaths() {
		yield* this.iterRuntimeDirs();
	}
}
