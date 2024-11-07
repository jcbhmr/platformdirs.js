import { PlatformDirs, version } from "./mod.ts";

const props = [
    "userDataDir",
    "userConfigDir",
    "userCacheDir",
    "userStateDir",
    "userLogDir",
    "userDocumentsDir",
    "userDownloadsDir",
    "userPicturesDir",
    "userVideosDir",
    "userMusicDir",
    "userRuntimeDir",
    "siteDataDir",
    "siteConfigDir",
    "siteCacheDir",
    "siteRuntimeDir",
] as const

function main() {
    const appName = "MyApp";
    const appAuthor = "MyCompany";

    console.log(`-- platformdirs ${version} --`);

    console.log("-- app dirs (with optional 'version')")
    let dirs = new PlatformDirs(appName, appAuthor, "1.0.0");
    for (const prop of props) {
        console.log(`${prop}: ${dirs[prop]}`);
    }

    console.log("\n-- app dirs (without optional 'version')")
    dirs = new PlatformDirs(appName, appAuthor);
    for (const prop of props) {
        console.log(`${prop}: ${dirs[prop]}`);
    }

    console.log("\n-- app dirs (without optional 'appauthor')")
    dirs = new PlatformDirs(appName);
    for (const prop of props) {
        console.log(`${prop}: ${dirs[prop]}`);
    }

    console.log("\n-- app dirs (with disabled 'appaauthor')")
    dirs = new PlatformDirs(appName, false);
    for (const prop of props) {
        console.log(`${prop}: ${dirs[prop]}`);
    }
}

if (import.meta.main) {
    main();
}
