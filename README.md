# `platformdirs` for JavaScript

📂 Unified interface to get platform-specific directories

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
