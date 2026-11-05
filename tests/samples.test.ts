// Golden-output tests: run each sample program and compare stdout with
// tests/expected/<name>.out. Programs that read INPUT get their answers
// from tests/inputs/<name>.in (one value per line).
//
// Not covered: guess.bas (uses RND) and trig.bas (number formatting does
// not follow the ECMA-55 significance width yet).
import { describe, expect, test } from "bun:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const expectedDir = join(import.meta.dir, "expected");
const names = readdirSync(expectedDir)
  .filter((f) => f.endsWith(".out"))
  .map((f) => f.replace(/\.out$/, ""));

describe("sample programs (golden output)", () => {
  for (const name of names) {
    test(name, () => {
      const inputPath = join(import.meta.dir, "inputs", `${name}.in`);
      const proc = Bun.spawnSync({
        cmd: [process.execPath, "index.ts", "--file", `tests/samples/${name}.bas`],
        cwd: root,
        stdin: existsSync(inputPath) ? Bun.file(inputPath) : "ignore",
      });
      expect(proc.exitCode).toBe(0);
      const actual = proc.stdout.toString();
      const expected = readFileSync(join(expectedDir, `${name}.out`), "utf8");
      expect(actual).toBe(expected);
    });
  }
});
