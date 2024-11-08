import assert from "node:assert";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { $ } from "execa";

test("matches python platformdirs", async () => {
	const { stdout: expected } = await $`python3 -m platformdirs`;
	const mainTSPath = fileURLToPath(import.meta.resolve("../src/main.ts"));
	const { stdout: actual } = await $`tsx ${mainTSPath}`;
	assert.equal(actual, expected);
});
