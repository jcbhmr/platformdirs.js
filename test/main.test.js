import assert from "node:assert";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { $, ExecaError } from "execa";

test("matches python platformdirs", async (t) => {
	/** @type {string} */
	let expected;
	try {
		const { stdout } = await $`python3 -m platformdirs`;
		expected = stdout;
	} catch (error) {
		if (error instanceof ExecaError) {
			t.skip(error.shortMessage);
			return;
		}
		throw error;
	}

	const mainTSPath = fileURLToPath(import.meta.resolve("../src/main.ts"));
	const { stdout: actual } = await $`tsx ${mainTSPath}`;
	assert.equal(
		actual.split(/\r?\n/g).slice(1).join("\n"),
		expected.split(/\r?\n/g).slice(1).join("\n"),
	);
});
