/**
 * @module
 * Unix.
 */

import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";

function expanduser(path2: string): string {
	return path2.replace(/^~/, os.homedir());
}

function getuid(): number {
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
	 * @return data directory tied to the user, e.g. `~/.local/share/$appname/$version` or `$XDG_DATA_HOME/$appname/$version`
	 */
	override get userDataDir(): string {
		let path2 = process.env.XDG_DATA_HOME ?? "";
		if (!path2.trim()) {
			path2 = expanduser("~/.local/share");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/** @ignore @internal */
	protected get _siteDataDirs(): string[] {
		let path2 = process.env.XDG_DATA_DIRS ?? "";
		if (!path2.trim()) {
			path2 = `/usr/local/share${path.delimiter}/usr/share`;
		}
		return path2
			.split(path.delimiter)
			.map((p) => this._appendAppNameAndVersion(p));
	}

	/**
	 * @return data directories shared by users (if
	 * {@link PlatformDirsABC.multipath} is enabled and `XDG_DATA_DIRS` is and a
	 * multi path the response is also a multi path separated by the OS path
	 * separator), e.g.
	 * `/usr/local/share/$appname/$version:/usr/share/$appname/$version`
	 */
	override get siteDataDir(): string {
		const dirs = this._siteDataDirs;
		if (!this.multipath) {
			return dirs[0];
		}
		return dirs.join(path.delimiter);
	}

	/**
	 * @return config directory tied to the user, e.g. `~/.config/$appname/$version` or `$XDG_CONFIG_HOME/$appname/$version`
	 */
	override get userConfigDir(): string {
		let path2 = process.env.XDG_CONFIG_HOME ?? "";
		if (!path2.trim()) {
			path2 = expanduser("~/.config");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/** @ignore @internal */
	get _siteConfigDirs(): string[] {
		let path2 = process.env.XDG_CONFIG_DIRS ?? "";
		if (!path2.trim()) {
			path2 = "/etc/xdg";
		}
		return path2
			.split(path.delimiter)
			.map((p) => this._appendAppNameAndVersion(p));
	}

	/**
	 * @return config directories shared by users (if
	 * {@link PlatformDirsABC.multipath} is enabled and `XDG_CONFIG_DIRS` is and
	 * a multi path the response is also a multi path separated by the OS path
	 * separator), e.g. `/etc/xdg/$appname/$version`
	 */
	override get siteConfigDir(): string {
		const dirs = this._siteConfigDirs;
		if (!this.multipath) {
			return dirs[0];
		}
		return dirs.join(path.delimiter);
	}

	/**
	 * @return cache directory tied to the user, e.g. `~/.cache/$appname/$version` or `$XDG_CACHE_HOME/$appname/$version`
	 */
	override get userCacheDir(): string {
		let path2 = process.env.XDG_CACHE_HOME ?? "";
		if (!path2.trim()) {
			path2 = expanduser("~/.cache");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return cache directory shared by users, e.g. `/var/cache/$appname/$version`
	 */
	override get siteCacheDir(): string {
		return this._appendAppNameAndVersion("/var/cache");
	}

	/**
	 * @return state directory tied to the user, e.g. `~/.local/state/$appname/$version` or `$XDG_STATE_HOME/$appname/$version`
	 */
	override get userStateDir(): string {
		let path2 = process.env.XDG_STATE_HOME ?? "";
		if (!path2.trim()) {
			path2 = expanduser("~/.local/state");
		}
		return this._appendAppNameAndVersion(path2);
	}

	/**
	 * @return log directory tied to the user, same as `userCacheDir` if not opinionated else `log` in it.
	 */
	override get userLogDir(): string {
		let path2 = this.userStateDir;
		if (this.opinion) {
			path2 = path.join(path2, "log");
			this._optionallyCreateDirectory(path2);
		}
		return path2;
	}

	/**
	 * @return documents directory tied to the user, e.g. `~/Documents`
	 */
	override get userDocumentsDir(): string {
		return getUserMediaDir("XDG_DOCUMENTS_DIR", "~/Documents");
	}

	/**
	 * @return downloads directory tied to the user, e.g. `~/Downloads`
	 */
	override get userDownloadsDir(): string {
		return getUserMediaDir("XDG_DOWNLOAD_DIR", "~/Downloads");
	}

	/**
	 * @return pictures directory tied to the user, e.g. `~/Pictures`
	 */
	override get userPicturesDir(): string {
		return getUserMediaDir("XDG_PICTURES_DIR", "~/Pictures");
	}

	/**
	 * @return videos directory tied to the user, e.g. `~/Videos`
	 */
	override get userVideosDir(): string {
		return getUserMediaDir("XDG_VIDEOS_DIR", "~/Videos");
	}

	/**
	 * @return music directory tied to the user, e.g. `~/Music`
	 */
	override get userMusicDir(): string {
		return getUserMediaDir("XDG_MUSIC_DIR", "~/Music");
	}

	/**
	 * @return desktop directory tied to the user, e.g. `~/Desktop`
	 */
	override get userDesktopDir(): string {
		return getUserMediaDir("XDG_DESKTOP_DIR", "~/Desktop");
	}

	/**
	 * @return runtime directory tied to the user, e.g. `/run/user/$(id -u)/$appname/$version` or `$XDG_RUNTIME_DIR/$appname/$version`.
	 *
	 * For FreeBSD/OpenBSD/NetBSD, it would return `/var/run/user/$(id -u)/$appname/$version` if it exists, otherwise `/tmp/runtime-$(id -u)/$appname/$version`, if `XDG_RUNTIME_DIR` is not set.
	 */
	override get userRuntimeDir(): string {
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
	 * @return runtime directory shared by users, e.g. `/run/$appname/$version` or `$XDG_RUNTIME_DIR/$appname/$version`.
	 *
	 * Note that this behaves almost exactly like `userRuntimeDir` if `XDG_RUNTIME_DIR` is set, but will fall back to paths associated to the root user isntead of a regular logged-in user if it's not set.
	 *
	 * If you wish to ensure that a logged-in user path is returned e.g. `/run/user/0`, use `userRuntimeDir` instead.
	 *
	 * For FreeBSD/OpenBSD/NetBSD, it would return `/var/run/$appname/$version` if `XDG_RUNTIME_DIR` is not set.
	 */
	override get siteRuntimeDir(): string {
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
	 * @return data path shared by users. Only return the first item, even if `multipath` is set to `true`.
	 */
	override get siteDataPath(): string {
		return this._firstItemAsPathIfMultipath(this.siteDataDir);
	}

	/**
	 * @return config path shared by users. Only return the first item, even if `multipath` is set to `true`.
	 */
	override get siteConfigPath(): string {
		return this._firstItemAsPathIfMultipath(this.siteConfigDir);
	}

	/**
	 * @return cache path shared by users. Only return the first item, even if `multipath` is set to `true`.
	 */
	override get siteCachePath(): string {
		return this._firstItemAsPathIfMultipath(this.siteCacheDir);
	}

	/**
	 * @yields all user and site configuation directories
	 */
	override *iterConfigDirs(): Generator<string> {
		yield this.userConfigDir;
		yield* this._siteConfigDirs;
	}

	/**
	 * @yields all user and site data directories
	 */
	override *iterDataDirs(): Generator<string> {
		yield this.userDataDir;
		yield* this._siteDataDirs;
	}
}

function getUserMediaDir(envVar: string, fallbackTildePath: string): string {
	let mediaDir = getUserDirsFolder(envVar);
	if (mediaDir === undefined) {
		mediaDir = (process.env[envVar] ?? "").trim();
		if (!mediaDir) {
			mediaDir = expanduser(fallbackTildePath);
		}
	}
	return mediaDir;
}

/**
 * Return directory from user-dirs.dirs config file.
 *
 * See https://freedesktop.org/wiki/Software/xdg-user-dirs/.
 */
function getUserDirsFolder(key: string): string | undefined {
	// const userDirsConfigPath = path.join(new Unix().userConfigDir, "user-dirs.dirs");
	// if (fs.existsSync(userDirsConfigPath)) {
	//     const parser = new ConfigParser()

	//     const read = fs.readFileSync(userDirsConfigPath, "utf-8")
	//     parser.readString(`[top]\n${read}`)

	//     if (parser.get("top", key) === undefined) {
	//         return undefined
	//     }

	//     const path2 = parser.get("top", key).trim()
	//     return path2.replace("$HOME", expanduser("~"))
	// }

	return undefined;
}
