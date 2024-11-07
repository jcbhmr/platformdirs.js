import { assertEquals } from "@std/assert"
import { $ } from "execa"

Deno.test({ permissions: "inherit"}, async function diff() {
    const { stdout: expected } = await $`python3 -m platformdirs`;
    const { stdout: actual } = await $`deno run -A ./main.ts`;
  assertEquals(actual, expected);  
})