/**
 * @module
 * macOS.
 */

import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";

function expanduser(path2: string): string {
	return path2.replace(/^~\//, `${os.homedir()}/`);
}

/**
 * Platform directories for the macOS operating system.
 *
 * Follows the guidance from [Apple documentation](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/MacOSXDirectories/MacOSXDirectories.html). Makes use of the {@link PlatformDirsABC.appname}, {@link PlatformDirsABC.version}, {@link PlatformDirsABC.ensureExists}.
 */
export class MacOS extends PlatformDirsABC {
	/**
	 * @return data directory tied to the user, e.g. `~/Library/Application Support/$appname/$version`
	 */
	override get userDataDir(): string {
		return this._appendAppNameAndVersion(
			expanduser("~/Library/Application Support"),
		);
	}

	/**
	 * @return data directory shared by users, e.g. `/Library/Application
	 * Support/$appname/$version`. If we're using a Node.js, Deno, or Bun binary
	 * managed by [Homebrew](https://brew.sh), the directory will be under the
	 * Homebrew prefix, e.g. `/opt/homebrew/share/$appname/$version`. If
	 * {@link PlatformDirsABC.multipath} is enabled, and we're in Homebrew, the
	 * response is a multi-path string separated by ":", e.g.
	 * `/opt/homebrew/share/$appname/$version:/Library/Application
	 * Support/$appname/$version`.
	 */
	override get siteDataDir(): string {
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
	 * @return data path shared by users. Only return the first item, even if
	 * `multipath` is enabled is set to `true`.
	 */
	override get siteDataPath(): string {
		return this._firstItemAsPathIfMultipath(this.siteDataDir);
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
	 * @return cache directory tied to the user, e.g. `~/Library/Caches/$appname/$version`
	 */
	override get userCacheDir(): string {
		return this._appendAppNameAndVersion(expanduser("~/Library/Caches"));
	}

	/**
	 * @return cache directory shared by users, e.g. `/Library/Caches/$appname/$version`.
	 * If we're using a Node.js, Deno, or Bun binary managed by [Homebrew](https://brew.sh),
	 * the directory will be under the Homebrew prefix, e.g. `/opt/homebrew/var/cache/$appname/$version`.
	 * If {@link PlatformDirsABC.multipath} is enabled, and we're in Homebrew, the response is a multi-path string separated by ":", e.g.
	 * `/opt/homebrew/var/cache/$appname/$version:/Library/Caches/$appname/$version`.
	 */
	override get siteCacheDir(): string {
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
	 * @return cache path shared by users. Only return the first item, even if
	 * `multipath` is enabled is set to `true`.
	 */
	override get siteCachePath(): string {
		return this._firstItemAsPathIfMultipath(this.siteCacheDir);
	}

	/**
	 * @return state directory tied to the user, e.g. `~/Library/Application Support/$appname/$version`
	 */
	override get userStateDir(): string {
		return this.userDataDir;
	}

	/**
	 * @return log directory tied to the user, e.g. `~/Library/Logs/$appname/$version`
	 */
	override get userLogDir(): string {
		return this._appendAppNameAndVersion(expanduser("~/Library/Logs"));
	}

	/**
	 * @return documents directory tied to the user, e.g. `~/Documents`
	 */
	override get userDocumentsDir(): string {
		return expanduser("~/Documents");
	}

	/**
	 * @return downloads directory tied to the user, e.g. `~/Downloads`
	 */
	override get userDownloadsDir(): string {
		return expanduser("~/Downloads");
	}

	/**
	 * @return pictures directory tied to the user, e.g. `~/Pictures`
	 */
	override get userPicturesDir(): string {
		return expanduser("~/Pictures");
	}

	/**
	 * @return videos directory tied to the user, e.g. `~/Movies`
	 */
	override get userVideosDir(): string {
		return expanduser("~/Movies");
	}

	/**
	 * @return music directory tied to the user, e.g. `~/Music`
	 */
	override get userMusicDir(): string {
		return expanduser("~/Music");
	}

	/**
	 * @return desktop directory tied to the user, e.g. `~/Desktop`
	 */
	override get userDesktopDir(): string {
		return expanduser("~/Desktop");
	}

	/**
	 * @return runtime directory tied to the user, e.g. `~/Library/Caches/TemporaryItems`
	 */
	override get userRuntimeDir(): string {
		return this._appendAppNameAndVersion(
			expanduser("~/Library/Caches/TemporaryItems"),
		);
	}

	/**
	 * @return runtime directory shared by users, same as `userRuntimeDir`
	 */
	override get siteRuntimeDir(): string {
		return this.userRuntimeDir;
	}
}
