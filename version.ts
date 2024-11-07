import denoJSON from "./deno.json" with { type: "json" };

export const version  = denoJSON.version;
// export const versionTuple = denoJSON.version.match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/)!.map(x => Number.isNaN(+x) ? x : +x);
export const versionTuple = denoJSON.version.split(".").map(x => +x);
