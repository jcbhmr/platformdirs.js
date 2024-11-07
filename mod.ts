import process from "node:process";
import type { PlatformDirsABC } from "./api.ts";
import type { Windows } from "./windows.ts";
import type { MacOS } from "./macos.ts";
import type { Unix } from "./unix.ts";
import type { Android } from "./android.ts";

export { PlatformDirsABC } from "./api.ts";
export { version, versionTuple as versionInfo } from "./version.ts";

let Result: typeof Windows | typeof MacOS | typeof Unix;
if (process.platform === 'win32') {
  ({ Windows: Result } = await import("./windows.ts"));
} else if (process.platform === 'darwin') {
  ({ MacOS: Result } = await import("./macos.ts"));
} else {
  ({ Unix: Result } = await import("./unix.ts"));
}

async function setPlatformDirClass(): Promise<typeof Windows | typeof MacOS | typeof Unix | typeof Android> {
  if (process.env.ANDROID_DATA == "/data" && process.env.ANDROID_ROOT == "/system") {
    if (process.env.SHELL || process.env.PREFIX) {
      return Result;
    }

    const { _androidFolder } = await import("./android.ts");

    if (_androidFolder() != null) {
      const { Android } = await import("./android.ts");

      return Android;
    }
  }

  return Result;
}

export const PlatformDirs: typeof Windows | typeof MacOS | typeof Unix | typeof Android = await setPlatformDirClass();
export const AppDirs = PlatformDirs;

export function userDataDir(appname?: string, appauthor?: string, version?: string, roaming: boolean = false, ensureExists: boolean = false): string {
  return new PlatformDirs(appname, appauthor, version, roaming, ensureExists).userDataDir;
}