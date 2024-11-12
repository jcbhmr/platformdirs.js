import packageJSON from "../package.json" with { type: "json" };

export const version = packageJSON.version;
export const versionTuple = packageJSON.version.split(".").map((x) => +x);
