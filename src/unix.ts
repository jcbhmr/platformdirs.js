import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";

function throw2(error: unknown): never {
	throw error;
}

function expanduser(path2: string): string {
	return path2.replace(/^~/, os.homedir());
}

export class Unix extends PlatformDirsABC {
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

	override get siteDataDir(): string {
		const dirs = this._siteDataDirs;
		if (!this.multipath) {
			return dirs[0];
		}
		return dirs.join(path.delimiter);
	}

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

	override get siteConfigDir(): string {
		const dirs = this._siteConfigDirs;
		if (!this.multipath) {
			return dirs[0];
		}
		return dirs.join(path.delimiter);
	}

	override get userCacheDir(): string {
		let path2 = process.env.XDG_CACHE_HOME ?? "";
		if (!path2.trim()) {
			path2 = expanduser("~/.cache");
		}
		return this._appendAppNameAndVersion(path2);
	}

	override get siteCacheDir(): string {
		return this._appendAppNameAndVersion("/var/cache");
	}

	override get userStateDir(): string {
		let path2 = process.env.XDG_STATE_HOME ?? "";
		if (!path2.trim()) {
			path2 = expanduser("~/.local/state");
		}
		return this._appendAppNameAndVersion(path2);
	}

	override get userLogDir(): string {
		let path2 = this.userStateDir;
		if (this.opinion) {
			path2 = path.join(path2, "log");
			this._optionallyCreateDirectory(path2);
		}
		return path2;
	}

	override get userDocumentsDir(): string {
		return getUserMediaDir("XDG_DOCUMENTS_DIR", "~/Documents");
	}

	override get userDownloadsDir(): string {
		return getUserMediaDir("XDG_DOWNLOAD_DIR", "~/Downloads");
	}

	override get userPicturesDir(): string {
		return getUserMediaDir("XDG_PICTURES_DIR", "~/Pictures");
	}

	override get userVideosDir(): string {
		return getUserMediaDir("XDG_VIDEOS_DIR", "~/Videos");
	}

	override get userMusicDir(): string {
		return getUserMediaDir("XDG_MUSIC_DIR", "~/Music");
	}

	override get userDesktopDir(): string {
		return getUserMediaDir("XDG_DESKTOP_DIR", "~/Desktop");
	}

	override get userRuntimeDir(): string {
		let path2 = process.env.XDG_RUNTIME_DIR ?? "";
		if (!path2.trim()) {
			if (
				process.platform === "freebsd" ||
				process.platform === "netbsd" ||
				process.platform === "openbsd"
			) {
				path2 = `/var/run/user/${(process.getuid ?? throw2(new Error("unreachable")))()}`;
				if (!fs.existsSync(path2)) {
					path2 = `/tmp/runtime-${(process.getuid ?? throw2(new Error("unreachable")))()}`;
				}
			} else {
				path2 = `/run/user/${process.getuid?.() ?? 0}`;
			}
		}
		return this._appendAppNameAndVersion(path2);
	}

	override get siteRuntimeDir(): string {
		let path2 = process.env.XDG_RUNTIME_DIR ?? "";
		if (!path2.trim()) {
			if (process.platform.match(/^(freebsd|openbsd|netbsd)/)) {
				path2 = "/var/run";
			} else {
				path2 = "/run";
			}
		}
		return this._appendAppNameAndVersion(path2);
	}

	override get siteDataPath(): string {
		return this._firstItemAsPathIfMultipath(this.siteDataDir);
	}

	override get siteConfigPath(): string {
		return this._firstItemAsPathIfMultipath(this.siteConfigDir);
	}

	override get siteCachePath(): string {
		return this._firstItemAsPathIfMultipath(this.siteCacheDir);
	}

	override *iterConfigDirs(): Generator<string> {
		yield this.userConfigDir;
		yield* this._siteConfigDirs;
	}

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
