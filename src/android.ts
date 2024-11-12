/**
 * @module
 * Android.
 *
 * TODO: Implement this module.
 */

import * as path from "node:path";
import { PlatformDirsABC } from "./api.js";

function throw2(error: unknown): never {
	throw error;
}

/**
 * Follows the guidance [from here](https://android.stackexchange.com/a/216132).
 *
 * Makes use of the {@link PlatformDirsABC.appname},
 * {@link PlatformDirsABC.version}, {@link PlatformDirsABC.ensureExists}.
 */
export class Android extends PlatformDirsABC {
	/**
	 * @return data directory tied to the user, e.g. `/data/user/<userid>/<packagename>/files/<AppName>`
	 */
	override get userDataDir(): string {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throw2(new Error("unreachable")),
			"files",
		);
	}

	/**
	 * @return data directory shared by users, same as `userDataDir`
	 */
	override get siteDataDir(): string {
		return this.userDataDir;
	}

	/**
	 * @return config directory tied to the user, e.g. `/data/user/<userid>/<packagename>/shared_prefs/<AppName>`
	 */
	override get userConfigDir(): string {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throw2(new Error("unreachable")),
			"shared_prefs",
		);
	}

	/**
	 * @return config directory shared by users, same as `userConfigDir`
	 */
	override get siteConfigDir(): string {
		return this.userConfigDir;
	}

	/**
	 * @return cache directory tied to the user, e.g. `/data/user/<userid>/<packagename>/cache/<AppName>`
	 */
	override get userCacheDir(): string {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throw2(new Error("unreachable")),
			"cache",
		);
	}

	/**
	 * @return cache directory shared by users, same as `userCacheDir`
	 */
	override get siteCacheDir(): string {
		return this.userCacheDir;
	}

	/**
	 * @return state directory tied to the user, same as `userDataDir`
	 */
	override get userStateDir(): string {
		return this.userDataDir;
	}

	/**
	 * @return log directory tied to the user, same as `userCacheDir` if not opinionated else `log` in it, e.g. `/data/user/<userid>/<packagename>/cache/<AppName>/log`
	 */
	override get userLogDir(): string {
		let path2 = this.userCacheDir;
		if (this.opinion) {
			path2 = path.join(path2, "log");
		}
		return path2;
	}

	/**
	 * @return documents directory tied to the user, e.g. `/storage/emulated/0/Documents`
	 */
	override get userDocumentsDir(): string {
		return androidDocumentsFolder();
	}

	/**
	 * @return downloads directory tied to the user, e.g. `/storage/emulated/0/Downloads`
	 */
	override get userDownloadsDir(): string {
		return androidDownloadsFolder();
	}

	/**
	 * @return pictures directory tied to the user, e.g. `/storage/emulated/0/Pictures`
	 */
	override get userPicturesDir(): string {
		return androidPicturesFolder();
	}

	/**
	 * @return videos directory tied to the user, e.g. `/storage/emulated/0/Movies`
	 */
	override get userVideosDir(): string {
		return androidVideosFolder();
	}

	/**
	 * @return music directory tied to the user, e.g. `/storage/emulated/0/Music`
	 */
	override get userMusicDir(): string {
		return androidMusicFolder();
	}

	/**
	 * @return desktop directory tied to the user, e.g. `/storage/emulated/0/Desktop`
	 */
	override get userDesktopDir(): string {
		return "/storage/emulated/0/Desktop";
	}

	/**
	 * @return runtime directory tied to the user, same as `userCacheDir` if not opinionated else `tmp` in it, e.g. `/data/user/<userid>/<packagename>/cache/<AppName>/tmp`
	 */
	override get userRuntimeDir(): string {
		let path2 = this.userCacheDir;
		if (this.opinion) {
			path2 = path.join(path2, "tmp");
		}
		return path2;
	}

	/**
	 * @return runtime directory shared by users, same as `userRuntimeDir`
	 */
	override get siteRuntimeDir(): string {
		return this.userRuntimeDir;
	}
}

/** @ignore @internal */
export function _androidFolder(): string | undefined {
	throw new Error("Not implemented");
}

function androidDocumentsFolder(): string {
	throw new Error("Not implemented");
}

function androidDownloadsFolder(): string {
	throw new Error("Not implemented");
}

function androidPicturesFolder(): string {
	throw new Error("Not implemented");
}

function androidVideosFolder(): string {
	throw new Error("Not implemented");
}

function androidMusicFolder(): string {
	throw new Error("Not implemented");
}
