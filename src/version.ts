import * as fs from "node:fs/promises";

const packageJSONText = await fs.readFile(
	new URL(import.meta.resolve("../package.json")),
	"utf-8",
);
const packageJSON = JSON.parse(packageJSONText) as { version: string };

export const version = packageJSON.version;
// export const versionTuple = packageJSON.version.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/)!.map(x => Number.isNaN(+x) ? x : +x);
export const versionTuple = packageJSON.version.split(".").map((x) => +x);
