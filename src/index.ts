import process from "node:process";
import type { Android } from "./android.js";
import type { PlatformDirsABC } from "./api.js";
import type { MacOS } from "./macos.js";
import type { Unix } from "./unix.js";
import type { Windows } from "./windows.js";

let Result: typeof Windows | typeof MacOS | typeof Unix;
if (process.platform === "win32") {
	({ Windows: Result } = await import("./windows.js"));
} else if (process.platform === "darwin") {
	({ MacOS: Result } = await import("./macos.js"));
} else {
	({ Unix: Result } = await import("./unix.js"));
}

async function setPlatformDirClass(): Promise<typeof PlatformDirsABC> {
	if (
		process.env.ANDROID_DATA === "/data" &&
		process.env.ANDROID_ROOT === "/system"
	) {
		if (process.env.SHELL || process.env.PREFIX) {
			return Result;
		}

		const { _androidFolder } = await import("./android.js");

		if (_androidFolder() != null) {
			const { Android } = await import("./android.js");

			return Android;
		}
	}

	return Result;
}

export type PlatformDirs = Windows | MacOS | Unix | Android;
export const PlatformDirs:
	| typeof Windows
	| typeof MacOS
	| typeof Unix
	| typeof Android = (await setPlatformDirClass()) as
	| typeof Windows
	| typeof MacOS
	| typeof Unix
	| typeof Android;
export const AppDirs = PlatformDirs;

export function userDataDir(
	appname?: string,
	appauthor?: string,
	version?: string,
	roaming = false,
	ensureExists = false,
): string {
	return new PlatformDirs(appname, appauthor, version, roaming, ensureExists)
		.userDataDir;
}

export { PlatformDirsABC } from "./api.js";
export { version, versionTuple as versionInfo } from "./version.js";
