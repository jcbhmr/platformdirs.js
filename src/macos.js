/**
 * @module
 * macOS.
 */

import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";

/**
 * Platform directories for the macOS operating system.
 *
 * Follows the guidance from [Apple documentation](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/MacOSXDirectories/MacOSXDirectories.html). Makes use of the {@link PlatformDirsABC.appname}, {@link PlatformDirsABC.version}, {@link PlatformDirsABC.ensureExists}.
 */
export class MacOS extends PlatformDirsABC {
	/**
	 * @return {string} data directory tied to the user, e.g. `~/Library/Application Support/$appname/$version`
	 * @override
	 */
	get userDataDir() {
		return this._appendAppNameAndVersion(
			path.join(os.homedir(), "Library/Application Support"),
		);
	}

	/**
	 * @return {string} data directory shared by users, e.g. `/Library/Application
	 * Support/$appname/$version`. If we're using a Node.js, Deno, or Bun binary
	 * managed by [Homebrew](https://brew.sh), the directory will be under the
	 * Homebrew prefix, e.g. `/opt/homebrew/share/$appname/$version`. If
	 * {@link PlatformDirsABC.multipath} is enabled, and we're in Homebrew, the
	 * response is a multi-path string separated by ":", e.g.
	 * `/opt/homebrew/share/$appname/$version:/Library/Application
	 * Support/$appname/$version`.
	 * @override
	 */
	get siteDataDir() {
		const isHomebrew = process.execPath.startsWith("/opt/homebrew");
		const pathList = isHomebrew
			? [this._appendAppNameAndVersion("/opt/homebrew/share")]
			: [];
		pathList.push(
			this._appendAppNameAndVersion("/Library/Application Support"),
		);
		if (this.multipath) {
			return pathList.join(path.delimiter);
		}
		return pathList[0];
	}

	/**
	 * @return {string} data path shared by users. Only return the first item, even if
	 * `multipath` is enabled is set to `true`.
	 * @override
	 */
	get siteDataPath() {
		return this._firstItemAsPathIfMultipath(this.siteDataDir);
	}

	/**
	 * @return {string} config directory tied to the user, same as `userDataDir`
	 * @override
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
	 * @return {string} cache directory tied to the user, e.g. `~/Library/Caches/$appname/$version`
	 * @override
	 */
	get userCacheDir() {
		return this._appendAppNameAndVersion(
			path.join(os.homedir(), "Library/Caches"),
		);
	}

	/**
	 * @return {string} cache directory shared by users, e.g. `/Library/Caches/$appname/$version`.
	 * If we're using a Node.js, Deno, or Bun binary managed by [Homebrew](https://brew.sh),
	 * the directory will be under the Homebrew prefix, e.g. `/opt/homebrew/var/cache/$appname/$version`.
	 * If {@link PlatformDirsABC.multipath} is enabled, and we're in Homebrew, the response is a multi-path string separated by ":", e.g.
	 * `/opt/homebrew/var/cache/$appname/$version:/Library/Caches/$appname/$version`.
	 * @override
	 */
	get siteCacheDir() {
		const isHomebrew = process.execPath.startsWith("/opt/homebrew");
		const pathList = isHomebrew
			? [this._appendAppNameAndVersion("/opt/homebrew/var/cache")]
			: [];
		pathList.push(this._appendAppNameAndVersion("/Library/Caches"));
		if (this.multipath) {
			return pathList.join(path.delimiter);
		}
		return pathList[0];
	}

	/**
	 * @return {string} cache path shared by users. Only return the first item, even if
	 * `multipath` is enabled is set to `true`.
	 * @override
	 */
	get siteCachePath() {
		return this._firstItemAsPathIfMultipath(this.siteCacheDir);
	}

	/**
	 * @return {string} state directory tied to the user, e.g. `~/Library/Application Support/$appname/$version`
	 * @override
	 */
	get userStateDir() {
		return this.userDataDir;
	}

	/**
	 * @return {string} log directory tied to the user, e.g. `~/Library/Logs/$appname/$version`
	 * @override
	 */
	get userLogDir() {
		return this._appendAppNameAndVersion(
			path.join(os.homedir(), "Library/Logs"),
		);
	}

	/**
	 * @return {string} documents directory tied to the user, e.g. `~/Documents`
	 * @override
	 */
	get userDocumentsDir() {
		return path.join(os.homedir(), "Documents");
	}

	/**
	 * @return {string} downloads directory tied to the user, e.g. `~/Downloads`
	 * @override
	 */
	get userDownloadsDir() {
		return path.join(os.homedir(), "Downloads");
	}

	/**
	 * @return {string} pictures directory tied to the user, e.g. `~/Pictures`
	 * @override
	 */
	get userPicturesDir() {
		return path.join(os.homedir(), "Pictures");
	}

	/**
	 * @return {string} videos directory tied to the user, e.g. `~/Movies`
	 * @override
	 */
	get userVideosDir() {
		return path.join(os.homedir(), "Movies");
	}

	/**
	 * @return {string} music directory tied to the user, e.g. `~/Music`
	 * @override
	 */
	get userMusicDir() {
		return path.join(os.homedir(), "Music");
	}

	/**
	 * @return {string} desktop directory tied to the user, e.g. `~/Desktop`
	 * @override
	 */
	get userDesktopDir() {
		return path.join(os.homedir(), "Desktop");
	}

	/**
	 * @return {string} runtime directory tied to the user, e.g. `~/Library/Caches/TemporaryItems`
	 * @override
	 */
	get userRuntimeDir() {
		return this._appendAppNameAndVersion(
			path.join(os.homedir(), "Library/Caches/TemporaryItems"),
		);
	}

	/**
	 * @return {string} runtime directory shared by users, same as `userRuntimeDir`
	 * @override
	 */
	get siteRuntimeDir() {
		return this.userRuntimeDir;
	}
}
