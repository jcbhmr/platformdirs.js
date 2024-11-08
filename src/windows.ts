import * as path from "node:path";
import process from "node:process";
import { PlatformDirsABC } from "./api.js";

export class Windows extends PlatformDirsABC {
	override get userDataDir(): string {
		const const2 = this.roaming ? "CSIDL_APPDATA" : "CSIDL_LOCAL_APPDATA";
		const path2 = path.normalize(getWinFolder(const2));
		return this._appendParts(path2);
	}

	protected _appendParts(
		path2: string,
		{ opinionValue }: { opinionValue?: string | undefined } = {},
	) {
		const params = [];
		if (this.appname) {
			if (this.appauthor !== false) {
				const author = this.appauthor || this.appname;
				params.push(author);
			}
			params.push(this.appname);
			if (opinionValue !== undefined && this.opinion) {
				params.push(opinionValue);
			}
			if (this.version) {
				params.push(this.version);
			}
		}
		const path3 = path.join(path2, ...params);
		this._optionallyCreateDirectory(path3);
		return path3;
	}

	override get siteDataDir(): string {
		const path2 = path.normalize(getWinFolder("CSIDL_COMMON_APPDATA"));
		return this._appendParts(path2);
	}

	override get userConfigDir(): string {
		return this.userDataDir;
	}

	override get siteConfigDir(): string {
		return this.siteDataDir;
	}

	override get userCacheDir(): string {
		const path2 = path.normalize(getWinFolder("CSIDL_LOCAL_APPDATA"));
		return this._appendParts(path2, { opinionValue: "Cache" });
	}

	override get siteCacheDir(): string {
		const path2 = path.normalize(getWinFolder("CSIDL_COMMON_APPDATA"));
		return this._appendParts(path2, { opinionValue: "Cache" });
	}

	override get userStateDir(): string {
		return this.userDataDir;
	}

	override get userLogDir(): string {
		let path2 = this.userDataDir;
		if (this.opinion) {
			path2 = path.join(path2, "Logs");
			this._optionallyCreateDirectory(path2);
		}
		return path2;
	}

	override get userDocumentsDir(): string {
		return path.normalize(getWinFolder("CSIDL_PERSONAL"));
	}

	override get userDownloadsDir(): string {
		return path.normalize(getWinFolder("CSIDL_DOWNLOADS"));
	}

	override get userPicturesDir(): string {
		return path.normalize(getWinFolder("CSIDL_MYPICTURES"));
	}

	override get userVideosDir(): string {
		return path.normalize(getWinFolder("CSIDL_MYVIDEO"));
	}

	override get userMusicDir(): string {
		return path.normalize(getWinFolder("CSIDL_MYMUSIC"));
	}

	override get userDesktopDir(): string {
		return path.normalize(getWinFolder("CSIDL_DESKTOPDIRECTORY"));
	}

	override get userRuntimeDir(): string {
		const path2 = path.normalize(
			path.join(getWinFolder("CSIDL_LOCAL_APPDATA"), "Temp"),
		);
		return this._appendParts(path2);
	}

	override get siteRuntimeDir(): string {
		return this.userRuntimeDir;
	}
}

function getWinFolderFromEnvVars(csidlName: string): string {
	let result = getWinFolderIfCSIDLNameNotEnvVar(csidlName);
	if (result !== undefined) {
		return result;
	}

	if (csidlName === "CSIDL_APPDATA") {
		result = process.env.APPDATA;
		if (result === undefined) {
			throw new Error("Unset environment variable: APPDATA");
		}
	} else if (csidlName === "CSIDL_COMMON_APPDATA") {
		result = process.env.ALLUSERSPROFILE;
		if (result === undefined) {
			throw new Error("Unset environment variable: ALLUSERSPROFILE");
		}
	} else if (csidlName === "CSIDL_LOCAL_APPDATA") {
		result = process.env.LOCALAPPDATA;
		if (result === undefined) {
			throw new Error("Unset environment variable: LOCALAPPDATA");
		}
	} else {
		throw new Error(`Unknown CSIDL name: ${csidlName}`);
	}
	return result;
}

function getWinFolderIfCSIDLNameNotEnvVar(
	csidlName: string,
): string | undefined {
	if (csidlName === "CSIDL_PERSONAL") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Documents");
	}
	if (csidlName === "CSIDL_DOWNLOADS") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Downloads");
	}
	if (csidlName === "CSIDL_MYPICTURES") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Pictures");
	}
	if (csidlName === "CSIDL_MYVIDEO") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Videos");
	}
	if (csidlName === "CSIDL_MYMUSIC") {
		const p = process.env.USERPROFILE;
		if (p === undefined) {
			throw new Error("Unset environment variable: USERPROFILE");
		}
		return path.join(path.normalize(p), "Music");
	}
	return undefined;
}

// function getWinFolderFromRegistry(csidlName: string): string {
//   throw new Error("Not implemented");
// }

// function getWinFolderViaCTypes(csidlName: string): string {
//   throw new Error("Not implemented");
// }

function pickGetWinFolder(): (csidlName: string) => string {
	return getWinFolderFromEnvVars;
}

const getWinFolder: (csidlName: string) => string = pickGetWinFolder();
