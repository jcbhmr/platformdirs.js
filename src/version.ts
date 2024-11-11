// Cannot `import packageJSON from "../package.json"` since that would change
// the root TypeScript directory from the `./src` folder to the `./` folder
// which then nests everything weirdly. This is just easier for now. If you, the
// reader, have a better solution please enlighten me!

export const version = "4.3.6";
export const versionTuple = version.split(".").map((x) => +x);
