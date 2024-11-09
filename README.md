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
    <a href="https://tsdocs.dev/search/docs/platformdirs">Documentation</a>
    | <a href="https://pypi.org/project/platformdirs/">Original <code>platformdirs</code> project</a>
</p>

🚀 Works on Windows, macOS, Linux, ~~and Android~~<sup>not yet</sup> \
✅ Uses platform-specific best practices \
🐍 A re-implementation of Python's [`platformdirs`](https://pypi.org/project/platformdirs/) package

## Installation

```sh
npm install platformdirs
```

## Usage

```js
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as platformdirs from "platformdirs";

const cacheDir = platformdirs.userCacheDir("awesome-app", "octocat", "1.2.3")
const bigCSVPath = path.join(cacheDir, "big.csv");
if (!fs.existsSync(bigCSVPath)) {
    const response = await fetch("https://example.com/big.csv");
    const file = stream.Writable.toWeb(fs.createWriteStream(bigCSVPath))
    await response.body.pipeTo(file);
}
```

📚 For more information check out [the documentation](https://tsdocs.dev/search/docs/platformdirs)
