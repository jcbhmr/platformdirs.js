#!/usr/bin/env node
import { PlatformDirs, version } from "./index.js";

const props: Record<string, keyof PlatformDirs> = {
	user_data_dir: "userDataDir",
	user_config_dir: "userConfigDir",
	user_cache_dir: "userCacheDir",
	user_state_dir: "userStateDir",
	user_log_dir: "userLogDir",
	user_documents_dir: "userDocumentsDir",
	user_downloads_dir: "userDownloadsDir",
	user_pictures_dir: "userPicturesDir",
	user_videos_dir: "userVideosDir",
	user_music_dir: "userMusicDir",
	user_runtime_dir: "userRuntimeDir",
	site_data_dir: "siteDataDir",
	site_config_dir: "siteConfigDir",
	site_cache_dir: "siteCacheDir",
	site_runtime_dir: "siteRuntimeDir",
};

const appName = "MyApp";
const appAuthor = "MyCompany";

console.log(`-- platformdirs ${version} --`);

console.log("-- app dirs (with optional 'version')");
let dirs = new PlatformDirs(appName, appAuthor, "1.0");
for (const [label, key] of Object.entries(props)) {
	console.log(`${label}: ${dirs[key]}`);
}

console.log("\n-- app dirs (without optional 'version')");
dirs = new PlatformDirs(appName, appAuthor);
for (const [label, key] of Object.entries(props)) {
	console.log(`${label}: ${dirs[key]}`);
}

console.log("\n-- app dirs (without optional 'appauthor')");
dirs = new PlatformDirs(appName);
for (const [label, key] of Object.entries(props)) {
	console.log(`${label}: ${dirs[key]}`);
}

console.log("\n-- app dirs (with disabled 'appauthor')");
dirs = new PlatformDirs(appName, false);
for (const [label, key] of Object.entries(props)) {
	console.log(`${label}: ${dirs[key]}`);
}
