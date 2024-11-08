import * as path from "node:path";
import { PlatformDirsABC } from "./api.js";

function throw2(error: unknown): never {
	throw error;
}

export class Android extends PlatformDirsABC {
	override get userDataDir(): string {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throw2(new Error("unreachable")),
			"files",
		);
	}

	override get siteDataDir(): string {
		return this.userDataDir;
	}

	override get userConfigDir(): string {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throw2(new Error("unreachable")),
			"shared_prefs",
		);
	}

	override get siteConfigDir(): string {
		return this.userConfigDir;
	}

	override get userCacheDir(): string {
		return this._appendAppNameAndVersion(
			_androidFolder() ?? throw2(new Error("unreachable")),
			"cache",
		);
	}

	override get siteCacheDir(): string {
		return this.userCacheDir;
	}

	override get userStateDir(): string {
		return this.userDataDir;
	}

	override get userLogDir(): string {
		let path2 = this.userCacheDir;
		if (this.opinion) {
			path2 = path.join(path2, "log");
		}
		return path2;
	}

	override get userDocumentsDir(): string {
		return androidDocumentsFolder();
	}

	override get userDownloadsDir(): string {
		return androidDownloadsFolder();
	}

	override get userPicturesDir(): string {
		return androidPicturesFolder();
	}

	override get userVideosDir(): string {
		return androidVideosFolder();
	}

	override get userMusicDir(): string {
		return androidMusicFolder();
	}

	override get userDesktopDir(): string {
		return "/storage/emulated/0/Desktop";
	}

	override get userRuntimeDir(): string {
		let path2 = this.userCacheDir;
		if (this.opinion) {
			path2 = path.join(path2, "tmp");
		}
		return path2;
	}

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
