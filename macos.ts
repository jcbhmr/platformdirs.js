import * as path from "node:path"
import * as os from "node:os"
import process from "node:process";
import { PlatformDirsABC } from "./api.ts";

function expanduser(path2: string): string {
    return path2.replace(/^~\//, os.homedir() + "/");
}

export class MacOS extends PlatformDirsABC {
    override get userDataDir(): string {
      return this._appendAppNameAndVersion(expanduser("~/Library/Application Support"));
    }

    override get siteDataDir(): string {
      const isHomebrew = process.execPath.startsWith("/opt/homebrew");
      const pathList = isHomebrew ? [this._appendAppNameAndVersion("/opt/homebrew/share")] : []
      pathList.push(this._appendAppNameAndVersion("/Library/Application Support"));
      if (this.multipath) {
        return pathList.join(path.delimiter);
      }
        return pathList[0];
    }

    override get siteDataPath(): string {
      return this._firstItemAsPathIfMultipath(this.siteDataDir);
    }

    override get userConfigDir(): string {
      return this.userDataDir
    }

    override get siteConfigDir(): string {
      return this.siteDataDir
    }

    override get userCacheDir(): string {
      return this._appendAppNameAndVersion(expanduser("~/Library/Caches"));
    }

    override get siteCacheDir(): string {
      const isHomebrew = process.execPath.startsWith("/opt/homebrew");
      const pathList = isHomebrew ? [this._appendAppNameAndVersion("/opt/homebrew/var/cache")] : []
        pathList.push(this._appendAppNameAndVersion("/Library/Caches"));
        if (this.multipath) {
          return pathList.join(path.delimiter);
        }
        return pathList[0];
    }

    override get siteCachePath(): string {
        return this._firstItemAsPathIfMultipath(this.siteCacheDir);
    }

    override get userStateDir(): string {
      return this.userDataDir
    }

    override get userLogDir(): string {
      return this._appendAppNameAndVersion(expanduser("~/Library/Logs"));
    }

    override get userDocumentsDir(): string {
        return expanduser("~/Documents");
    }

    override get userDownloadsDir(): string {
        return expanduser("~/Downloads");
    }

    override get userPicturesDir(): string {
        return expanduser("~/Pictures");
    }

    override get userVideosDir(): string {
        return expanduser("~/Movies");
    }

    override get userMusicDir(): string {
        return expanduser("~/Music");
    }

    override get userDesktopDir(): string {
        return expanduser("~/Desktop");
    }

    override get userRuntimeDir(): string {
      return this._appendAppNameAndVersion(expanduser("~/Library/Caches/TemporaryItems"));
    }

    override get siteRuntimeDir(): string {
        return this.userRuntimeDir;
    }
}