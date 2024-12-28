import { readFile } from "node:fs/promises";

// https://github.com/nodejs/node/issues/51347
const packageJSON = JSON.parse(await readFile(new URL(import.meta.resolve("../package.json")), "utf8")) as { version: string; };

function throwExpression(error: unknown): never {
	throw error;
}

export const version: string = packageJSON.version;
const match =
	packageJSON.version.match(/^(\d+)\.(\d+)\.(\d+)/) ??
	throwExpression(new Error("unreachable"));
export const versionTuple: [number, number, number] = [+match[1], +match[2], +match[3]];
