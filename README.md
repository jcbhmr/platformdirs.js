# `platformdirs` for JavaScript

📂 Unified interface to get platform-specific directories

<table align=center><td>

<div><sub><i>Running on Linux</i></sub></div>

```js
const dirs = new PlatformDirs("awesome-app", "octocat", "1.2.3")
console.log(dirs.userDataDir)
//=> /home/jcbhmr/.local/share/awesome-app/1.2.3
console.log(dirs.userConfigDir)
//=> /home/jcbhmr/.config/awesome-app/1.2.3

console.log(userRuntimeDir("other-app", "ferris", "4.5.6"))
//=> /run/user/33333/other-app/4.5.6
console.log(userLogDir("my-app", "gopher", "7.8.9"))
//=> /home/jcbhmr/.local/state/my-app/7.8.9/log
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
import * as platformdirs from "platformdirs";

const cacheDir = platformdirs.userCacheDir("awesome-app", "octocat", "1.2.3")
const bigCSVPath = path.join(cacheDir, "big.csv");
if (!fs.existsSync(bigCSVPath)) {
    const response = await fetch("https://example.com/big.csv");
    await response.body.pipeTo(stream.Writable.toWeb(fs.createWriteStream(bigCSVPath)));
}
```

📚 For more information check out [the documentation](https://jsdocs.io/package/platformdirs)
