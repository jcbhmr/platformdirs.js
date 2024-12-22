/**
 * @module
 * Unix.
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";
import { ConfigParser } from "./configparser.js";

/** @return {number} */
function getuid() {
	if (!process.getuid) {
		throw new Error("should only be used on Unix");
	}
	return process.getuid();
}

/**
 * On Unix/Linux, we follow the [XDG Basedir
 * Spec](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html).
 *
 * The spec allows overriding directories via environment variables. The
 * examples shown are the default values, alongside the name of the environment
 * variable that overrides them. Makes use of the
 * {@link PlatformDirsABC.appname}, {@link PlatformDirsABC.version},
 * {@link PlatformDirsABC.multipath}, {@link PlatformDirsABC.opinion},
 * {@link PlatformDirsABC.ensureExists}.
 */
export class Unix extends PlatformDirsABC {
	/**
	 * @return {string} data directory tied to the user, e.g. `~/.local/share/$appname/$version` or `$XDG_DATA_HOME/$appname/$version`
	 * @override
	 */
	get userDataDir() {
		let path2 = process.env.XDG_DATA_HOME ?? "";
		if (!path2.trim()) {
			path2 = path.join(os.homedir(), ".local/share");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return {string[]}
	 * @protected @ignore @internal
	 */
	get _siteDataDirs() {
		let path2 = process.env.XDG_DATA_DIRS ?? "";
		if (!path2.trim()) {
			path2 = `/usr/local/share${path.delimiter}/usr/share`;
		}
		return path2
			.split(path.delimiter)
			.map((p) => this._appendAppNameAndVersion(p));
	}

	/**
	 * @return {string} data directories shared by users (if
	 * {@link PlatformDirsABC.multipath} is enabled and `XDG_DATA_DIRS` is and a
	 * multi path the response is also a multi path separated by the OS path
	 * separator), e.g.
	 * `/usr/local/share/$appname/$version:/usr/share/$appname/$version`
	 * @override
	 */
	get siteDataDir() {
		const dirs = this._siteDataDirs;
		if (!this.multipath) {
			return dirs[0];
		}
		return dirs.join(path.delimiter);
	}

	/**
	 * @return {string} config directory tied to the user, e.g. `~/.config/$appname/$version` or `$XDG_CONFIG_HOME/$appname/$version`
	 * @override
	 */
	get userConfigDir() {
		let path2 = process.env.XDG_CONFIG_HOME ?? "";
		if (!path2.trim()) {
			path2 = path.join(os.homedir(), ".config");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return {string[]}
	 * @ignore @internal
	 */
	get _siteConfigDirs() {
		let path2 = process.env.XDG_CONFIG_DIRS ?? "";
		if (!path2.trim()) {
			path2 = "/etc/xdg";
		}
		return path2
			.split(path.delimiter)
			.map((p) => this._appendAppNameAndVersion(p));
	}

	/**
	 * @return {string} config directories shared by users (if
	 * {@link PlatformDirsABC.multipath} is enabled and `XDG_CONFIG_DIRS` is and
	 * a multi path the response is also a multi path separated by the OS path
	 * separator), e.g. `/etc/xdg/$appname/$version`
	 * @override
	 */
	get siteConfigDir() {
		const dirs = this._siteConfigDirs;
		if (!this.multipath) {
			return dirs[0];
		}
		return dirs.join(path.delimiter);
	}

	/**
	 * @return {string} cache directory tied to the user, e.g. `~/.cache/$appname/$version` or `$XDG_CACHE_HOME/$appname/$version`
	 * @override
	 */
	get userCacheDir() {
		let path2 = process.env.XDG_CACHE_HOME ?? "";
		if (!path2.trim()) {
			path2 = path.join(os.homedir(), ".cache");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return {string} cache directory shared by users, e.g. `/var/cache/$appname/$version`
	 * @override
	 */
	get siteCacheDir() {
		return this._appendAppNameAndVersion("/var/cache");
	}

	/**
	 * @return {string} state directory tied to the user, e.g. `~/.local/state/$appname/$version` or `$XDG_STATE_HOME/$appname/$version`
	 * @override
	 */
	get userStateDir() {
		let path2 = process.env.XDG_STATE_HOME ?? "";
		if (!path2.trim()) {
			path2 = path.join(os.homedir(), ".local/state");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return {string} log directory tied to the user, same as `userCacheDir` if not opinionated else `log` in it.
	 * @override
	 */
	get userLogDir() {
		let path2 = this.userStateDir;
		if (this.opinion) {
			path2 = path.join(path2, "log");
			this._optionallyCreateDirectory(path2);
		}
		return path2;
	}

	/**
	 * @return {string} documents directory tied to the user, e.g. `~/Documents`
	 * @override
	 */
	get userDocumentsDir() {
		return getUserMediaDir("XDG_DOCUMENTS_DIR", "~/Documents");
	}

	/**
	 * @return {string} downloads directory tied to the user, e.g. `~/Downloads`
	 * @override
	 */
	get userDownloadsDir() {
		return getUserMediaDir("XDG_DOWNLOAD_DIR", "~/Downloads");
	}

	/**
	 * @return {string} pictures directory tied to the user, e.g. `~/Pictures`
	 * @override
	 */
	get userPicturesDir() {
		return getUserMediaDir("XDG_PICTURES_DIR", "~/Pictures");
	}

	/**
	 * @return {string} videos directory tied to the user, e.g. `~/Videos`
	 * @override
	 */
	get userVideosDir() {
		return getUserMediaDir("XDG_VIDEOS_DIR", "~/Videos");
	}

	/**
	 * @return {string} music directory tied to the user, e.g. `~/Music`
	 * @override
	 */
	get userMusicDir() {
		return getUserMediaDir("XDG_MUSIC_DIR", "~/Music");
	}

	/**
	 * @return {string} desktop directory tied to the user, e.g. `~/Desktop`
	 * @override
	 */
	get userDesktopDir() {
		return getUserMediaDir("XDG_DESKTOP_DIR", "~/Desktop");
	}

	/**
	 * @return {string} runtime directory tied to the user, e.g. `/run/user/$(id -u)/$appname/$version` or `$XDG_RUNTIME_DIR/$appname/$version`.
	 *
	 * For FreeBSD/OpenBSD/NetBSD, it would return `/var/run/user/$(id -u)/$appname/$version` if it exists, otherwise `/tmp/runtime-$(id -u)/$appname/$version`, if `XDG_RUNTIME_DIR` is not set.
	 * @override
	 */
	get userRuntimeDir() {
		let path2 = process.env.XDG_RUNTIME_DIR ?? "";
		if (!path2.trim()) {
			if (
				process.platform === "freebsd" ||
				process.platform === "netbsd" ||
				process.platform === "openbsd"
			) {
				path2 = `/var/run/user/${getuid()}`;
				if (!fs.existsSync(path2)) {
					path2 = `/tmp/runtime-${getuid()}`;
				}
			} else {
				path2 = `/run/user/${getuid()}`;
			}
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return {string} runtime directory shared by users, e.g. `/run/$appname/$version` or `$XDG_RUNTIME_DIR/$appname/$version`.
	 *
	 * Note that this behaves almost exactly like `userRuntimeDir` if `XDG_RUNTIME_DIR` is set, but will fall back to paths associated to the root user isntead of a regular logged-in user if it's not set.
	 *
	 * If you wish to ensure that a logged-in user path is returned e.g. `/run/user/0`, use `userRuntimeDir` instead.
	 *
	 * For FreeBSD/OpenBSD/NetBSD, it would return `/var/run/$appname/$version` if `XDG_RUNTIME_DIR` is not set.
	 * @override
	 */
	get siteRuntimeDir() {
		let path2 = process.env.XDG_RUNTIME_DIR ?? "";
		if (!path2.trim()) {
			if (
				process.platform === "freebsd" ||
				process.platform === "netbsd" ||
				process.platform === "openbsd"
			) {
				path2 = "/var/run";
			} else {
				path2 = "/run";
			}
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return {string} data path shared by users. Only return the first item, even if `multipath` is set to `true`.
	 * @override
	 */
	get siteDataPath() {
		return this._firstItemAsPathIfMultipath(this.siteDataDir);
	}

	/**
	 * @return {string} config path shared by users. Only return the first item, even if `multipath` is set to `true`.
	 * @override
	 */
	get siteConfigPath() {
		return this._firstItemAsPathIfMultipath(this.siteConfigDir);
	}

	/**
	 * @return {string} cache path shared by users. Only return the first item, even if `multipath` is set to `true`.
	 * @override
	 */
	get siteCachePath() {
		return this._firstItemAsPathIfMultipath(this.siteCacheDir);
	}

	/**
	 * @yields all user and site configuation directories
	 * @return {Generator<string>}
	 * @override
	 */
	*iterConfigDirs() {
		yield this.userConfigDir;
		yield* this._siteConfigDirs;
	}

	/**
	 * @yields all user and site data directories
	 * @return {Generator<string>}
	 * @override
	 */
	*iterDataDirs() {
		yield this.userDataDir;
		yield* this._siteDataDirs;
	}
}

/**
 * @param {string} envVar
 * @param {string} fallbackTildePath
 * @returns {string}
 */
function getUserMediaDir(envVar, fallbackTildePath) {
	let mediaDir = getUserDirsFolder(envVar);
	if (mediaDir === undefined) {
		mediaDir = (process.env[envVar] ?? "").trim();
		if (!mediaDir) {
			mediaDir = fallbackTildePath.replace(/^~/, os.homedir());
		}
	}
	return mediaDir;
}

/**
 * Return directory from user-dirs.dirs config file.
 *
 * See https://freedesktop.org/wiki/Software/xdg-user-dirs/.
 * 
 * ⚠️ This function uses **synchronous FS operations**.
 *
 * @param {string} key
 * @returns {string | undefined}
 */
function getUserDirsFolder(key) {
	const userDirsConfigPath = path.join(new Unix().userConfigDir, "user-dirs.dirs");
	if (fs.existsSync(userDirsConfigPath)) {
		// This works for now.
	    const parser = new ConfigParser()

	    const read = fs.readFileSync(userDirsConfigPath, "utf-8")
	    parser.readString(`[top]\n${read}`)

		const top = parser.get("top");
	    if (!top || !(Object.hasOwn(top, key))) {
	        return undefined
	    }

	    const path2 = top[key].replace(/(^"|"$)/g, "")
	    return path2.replace("$HOME", os.homedir())
	}

	return undefined;
}
