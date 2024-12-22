// https://github.com/nodejs/node/issues/51347
import packageJSON from "../package.json" with { type: "json" };

/**
 * @param {unknown} error
 * @return {never}
 */
function throwExpression(error) {
	throw error;
}

export const version = packageJSON.version;
const match =
	packageJSON.version.match(/^(\d+)\.(\d+)\.(\d+)/) ??
	throwExpression(new Error("unreachable"));
export const versionTuple = [+match[1], +match[2], +match[3]];
