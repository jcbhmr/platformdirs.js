import * as fs from "node:fs";
import * as path from "node:path";

export abstract class PlatformDirsABC {
	appname: string | undefined;
	appauthor: string | false | undefined;
	version: string | undefined;
	roaming: boolean;
	multipath: boolean;
	opinion: boolean;
	ensureExists: boolean;
	constructor(
		appname?: string,
		appauthor?: string | false,
		version?: string,
		roaming = false,
		multipath = false,
		opinion = true,
		ensureExists = false,
	) {
		this.appname = appname;
		this.appauthor = appauthor;
		this.version = version;
		this.roaming = roaming;
		this.multipath = multipath;
		this.opinion = opinion;
		this.ensureExists = ensureExists;
	}

	/** @ignore @internal */
	protected _appendAppNameAndVersion(...base: string[]): string {
		const params = base.slice(1);
		if (this.appname) {
			params.push(this.appname);
			if (this.version) {
				params.push(this.version);
			}
		}
		const path2 = path.join(base[0], ...params);
		this._optionallyCreateDirectory(path2);
		return path2;
	}

	/** @ignore @internal */
	protected _optionallyCreateDirectory(dir: string): void {
		if (this.ensureExists) {
			fs.mkdirSync(dir, { recursive: true });
		}
	}

	/** @ignore @internal */
	protected _firstItemAsPathIfMultipath(directory: string): string {
		if (this.multipath) {
			return directory.split(path.delimiter)[0];
		}
		return directory;
	}

	abstract get userDataDir(): string;

	abstract get siteDataDir(): string;

	abstract get userConfigDir(): string;

	abstract get siteConfigDir(): string;

	abstract get userCacheDir(): string;

	abstract get siteCacheDir(): string;

	abstract get userStateDir(): string;

	abstract get userLogDir(): string;

	abstract get userDocumentsDir(): string;

	abstract get userDownloadsDir(): string;

	abstract get userPicturesDir(): string;

	abstract get userVideosDir(): string;

	abstract get userMusicDir(): string;

	abstract get userDesktopDir(): string;

	abstract get userRuntimeDir(): string;

	abstract get siteRuntimeDir(): string;

	get userDataPath(): string {
		return this.userDataDir;
	}

	get siteDataPath(): string {
		return this.siteDataDir;
	}

	get userConfigPath(): string {
		return this.userConfigDir;
	}

	get siteConfigPath(): string {
		return this.siteConfigDir;
	}

	get userCachePath(): string {
		return this.userCacheDir;
	}

	get siteCachePath(): string {
		return this.siteCacheDir;
	}

	get userStatePath(): string {
		return this.userStateDir;
	}

	get userLogPath(): string {
		return this.userLogDir;
	}

	get userDocumentsPath(): string {
		return this.userDocumentsDir;
	}

	get userDownloadsPath(): string {
		return this.userDownloadsDir;
	}

	get userPicturesPath(): string {
		return this.userPicturesDir;
	}

	get userVideosPath(): string {
		return this.userVideosDir;
	}

	get userMusicPath(): string {
		return this.userMusicDir;
	}

	get userDesktopPath(): string {
		return this.userDesktopDir;
	}

	get userRuntimePath(): string {
		return this.userRuntimeDir;
	}

	get siteRuntimePath(): string {
		return this.siteRuntimeDir;
	}

	*iterConfigDirs(): Generator<string> {
		yield this.userConfigDir;
		yield this.siteConfigDir;
	}

	*iterDataDirs(): Generator<string> {
		yield this.userDataDir;
		yield this.siteDataDir;
	}

	*iterCacheDirs(): Generator<string> {
		yield this.userCacheDir;
		yield this.siteCacheDir;
	}

	*iterRuntimeDirs(): Generator<string> {
		yield this.userRuntimeDir;
		yield this.siteRuntimeDir;
	}

	*iterConfigPaths(): Generator<string> {
		yield* this.iterConfigDirs();
	}

	*iterDataPaths(): Generator<string> {
		yield* this.iterDataDirs();
	}

	*iterCachePaths(): Generator<string> {
		yield* this.iterCacheDirs();
	}

	*iterRuntimePaths(): Generator<string> {
		yield* this.iterRuntimeDirs();
	}
}
