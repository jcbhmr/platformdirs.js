# `platformdirs` for JavaScript

📂 Unified interface to get platform-specific directories

<table align=center><td>

<div><sub><i>Running on Linux</i></sub></div>

```js
const dirs = new PlatformDirs("awesome-app", "octocat", "1.2")
console.log(dirs.userDataDir)
//=> /home/jcbhmr/.local/share/awesome-app/1.2
console.log(dirs.userConfigDir)
//=> /home/jcbhmr/.config/awesome-app/1.2

console.log(userRuntimeDir("other-app", "ferris", "4.5"))
//=> /run/user/33333/other-app/4.5
console.log(userLogDir("my-app", "gopher", "7.8"))
//=> /home/jcbhmr/.local/state/my-app/7.8/log
```

</table>

<p align=center>
    <a href="https://jsdocs.io/package/platformdirs">Documentation</a>
    | <a href="https://pypi.org/project/platformdirs/">Original <code>platformdirs</code> project</a>
</p>

🚀 Works on Windows, macOS, Linux, ~~and Android~~<sup>not yet</sup> \
✅ Uses platform-specific best practices \
🐍 A re-implementation of Python's [`platformdirs`](https://pypi.org/project/platformdirs/) package

## Installation

![npm](https://img.shields.io/static/v1?style=for-the-badge&message=npm&color=CB3837&logo=npm&logoColor=FFFFFF&label=)
![pnpm](https://img.shields.io/static/v1?style=for-the-badge&message=pnpm&color=222222&logo=pnpm&logoColor=F69220&label=)
![Bun](https://img.shields.io/static/v1?style=for-the-badge&message=Bun&color=000000&logo=Bun&logoColor=FFFFFF&label=)
![Deno](https://img.shields.io/static/v1?style=for-the-badge&message=Deno&color=222222&logo=Deno&logoColor=70FFAF&label=)

You can install this package from [the npm registry](https://www.npmjs.com/) using npm, Yarn, pnpm, Bun, Deno, etc.

```sh
npm install platformdirs
```

## Usage

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=5FA04E&logo=Node.js&logoColor=FFFFFF&label=)
![Deno](https://img.shields.io/static/v1?style=for-the-badge&message=Deno&color=222222&logo=Deno&logoColor=70FFAF&label=)
![Bun](https://img.shields.io/static/v1?style=for-the-badge&message=Bun&color=000000&logo=Bun&logoColor=FFFFFF&label=)
![Windows](https://img.shields.io/static/v1?style=for-the-badge&message=Windows&color=0078D4&logo=Windows&logoColor=FFFFFF&label=)
![Linux](https://img.shields.io/static/v1?style=for-the-badge&message=Linux&color=222222&logo=Linux&logoColor=FCC624&label=)
![macOS](https://img.shields.io/static/v1?style=for-the-badge&message=macOS&color=000000&logo=macOS&logoColor=FFFFFF&label=)


```js
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as stream from "node:stream";
import { userCacheDir } from "platformdirs";

const cacheDir = userCacheDir("awesome-app", "octocat", "1.2")
const bigCSVPath = path.join(cacheDir, "big.csv");
if (!fs.existsSync(bigCSVPath)) {
    const response = await fetch("https://example.com/big.csv");
    await response.body.pipeTo(stream.Writable.toWeb(fs.createWriteStream(bigCSVPath)));
}
```

📚 For more information check out [the documentation](https://jsdocs.io/package/platformdirs)

You can quickly dump all the directories for the current environment by running the included `platformdirs` CLI command. This is helpful for quickly determining what `dirs.userConfigDir` and friends return.

```sh
npx platformdirs
```

<details><summary>Output on Windows</summary>

```
TODO
```

</details>

<details><summary>Output on macOS</summary>

```
TODO
```

</details>

<details><summary>Output on Linux</summary>

```
-- platformdirs 4.3.6 --
-- app dirs (with optional 'version')
user_data_dir: /home/me/.local/share/MyApp/1.0
user_config_dir: /home/me/.config/MyApp/1.0
user_cache_dir: /home/me/.cache/MyApp/1.0
user_state_dir: /home/me/.local/state/MyApp/1.0
user_log_dir: /home/me/.local/state/MyApp/1.0/log
user_documents_dir: /home/me/Documents
user_downloads_dir: /home/me/Downloads
user_pictures_dir: /home/me/Pictures
user_videos_dir: /home/me/Videos
user_music_dir: /home/me/Music
user_runtime_dir: /run/user/1000/MyApp/1.0
site_data_dir: /usr/local/share/MyApp/1.0
site_config_dir: /etc/xdg/MyApp/1.0
site_cache_dir: /var/cache/MyApp/1.0
site_runtime_dir: /run/MyApp/1.0

-- app dirs (without optional 'version')
user_data_dir: /home/me/.local/share/MyApp
user_config_dir: /home/me/.config/MyApp
user_cache_dir: /home/me/.cache/MyApp
user_state_dir: /home/me/.local/state/MyApp
user_log_dir: /home/me/.local/state/MyApp/log
user_documents_dir: /home/me/Documents
user_downloads_dir: /home/me/Downloads
user_pictures_dir: /home/me/Pictures
user_videos_dir: /home/me/Videos
user_music_dir: /home/me/Music
user_runtime_dir: /run/user/1000/MyApp
site_data_dir: /usr/local/share/MyApp
site_config_dir: /etc/xdg/MyApp
site_cache_dir: /var/cache/MyApp
site_runtime_dir: /run/MyApp

-- app dirs (without optional 'appauthor')
user_data_dir: /home/me/.local/share/MyApp
user_config_dir: /home/me/.config/MyApp
user_cache_dir: /home/me/.cache/MyApp
user_state_dir: /home/me/.local/state/MyApp
user_log_dir: /home/me/.local/state/MyApp/log
user_documents_dir: /home/me/Documents
user_downloads_dir: /home/me/Downloads
user_pictures_dir: /home/me/Pictures
user_videos_dir: /home/me/Videos
user_music_dir: /home/me/Music
user_runtime_dir: /run/user/1000/MyApp
site_data_dir: /usr/local/share/MyApp
site_config_dir: /etc/xdg/MyApp
site_cache_dir: /var/cache/MyApp
site_runtime_dir: /run/MyApp

-- app dirs (with disabled 'appauthor')
user_data_dir: /home/me/.local/share/MyApp
user_config_dir: /home/me/.config/MyApp
user_cache_dir: /home/me/.cache/MyApp
user_state_dir: /home/me/.local/state/MyApp
user_log_dir: /home/me/.local/state/MyApp/log
user_documents_dir: /home/me/Documents
user_downloads_dir: /home/me/Downloads
user_pictures_dir: /home/me/Pictures
user_videos_dir: /home/me/Videos
user_music_dir: /home/me/Music
user_runtime_dir: /run/user/1000/MyApp
site_data_dir: /usr/local/share/MyApp
site_config_dir: /etc/xdg/MyApp
site_cache_dir: /var/cache/MyApp
site_runtime_dir: /run/MyApp
```

</details>

## Development

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=5FA04E&logo=Node.js&logoColor=FFFFFF&label=)
![TypeScript](https://img.shields.io/static/v1?style=for-the-badge&message=TypeScript&color=3178C6&logo=TypeScript&logoColor=FFFFFF&label=)
![Biome](https://img.shields.io/static/v1?style=for-the-badge&message=Biome&color=60A5FA&logo=Biome&logoColor=FFFFFF&label=)

This project uses Node.js, npm, TypeScript, and [Biome](https://biomejs.dev/) instead of the usual [Prettier](https://prettier.io/) & [ESLint](https://eslint.org/) combo. Why? Because ESLint bungled their v9 release and Biome offers a more cohesive linter & formatter solution.

For package releases make sure to always release a `-rc1` version first. If it's 100% OK then proceed to release it as normal. The goal is to keep the npm `platformdirs@X.Y.Z` package in sync with PyPI `platformdirs==X.Y.Z`.
