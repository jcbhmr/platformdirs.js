import assert from "node:assert";
import test from "node:test";
import { $ } from "execa";
import which from "which";

test("matches python platformdirs", async (t) => {
	// https://docs.astral.sh/uv/getting-started/installation/
	if (!(await which("uv", { nothrow: true }))) {
		t.skip("uv not found");
		return;
	}

	// Strip first line which has version info like "-- platformdirs 1.2.3 --".
	const expected = (
		await $`uv run --with platformdirs python -m platformdirs`
	).stdout.replace(/^.*/m, "");
	const actual = (await $`node src/main.js`).stdout.replace(/^.*/m, "");
	assert.equal(actual, expected);
});
