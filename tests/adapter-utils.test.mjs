import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { matchesAdapter, nativeCheckPlan, runNativeCheck } from "../scripts/adapter-utils.mjs";

const seen = JSON.parse(readFileSync(new URL("../skills/anti-slop/references/adapters/seen.json", import.meta.url)));

test("detects Seen manifests, source-only repositories, multilingual source, and mixed workspaces", () => {
  assert.equal(matchesAdapter(seen, ["app/Seen.toml"]), true);
  assert.equal(matchesAdapter(seen, ["src/main.seen"]), true);
  assert.equal(matchesAdapter(seen, ["src/الرئيسي.seen"]), true);
  assert.equal(matchesAdapter(seen, ["package.json", "src/main.seen"]), true);
  assert.equal(matchesAdapter(seen, ["package.json", "src/main.ts"]), false);
});

test("keeps the native Seen command and project-root policy exact", () => {
  assert.deepEqual(nativeCheckPlan(seen, "/project"), { argv: ["seen", "lint"], cwd: "/project" });
});

test("preserves clean and failing native lint output", () => {
  const root = mkdtempSync(join(tmpdir(), "anti-slop-seen-"));
  const bin = join(root, "bin");
  mkdirSync(bin);
  const fakeSeen = join(bin, "seen");
  writeFileSync(fakeSeen, "#!/bin/sh\nprintf '%s|%s' \"$PWD\" \"$*\"\nprintf '%s' \"$FAKE_SEEN_MESSAGE\" >&2\nexit \"$FAKE_SEEN_EXIT\"\n");
  chmodSync(fakeSeen, 0o755);
  const baseEnv = { ...process.env, PATH: `${bin}:${process.env.PATH}` };
  const clean = runNativeCheck(seen, root, { ...baseEnv, FAKE_SEEN_EXIT: "0", FAKE_SEEN_MESSAGE: "clean" });
  assert.equal(clean.status, "clean");
  assert.equal(clean.stdout, `${root}|lint`);
  assert.equal(clean.stderr, "clean");
  const failing = runNativeCheck(seen, root, { ...baseEnv, FAKE_SEEN_EXIT: "1", FAKE_SEEN_MESSAGE: "finding" });
  assert.equal(failing.status, "findings");
  assert.equal(failing.code, 1);
  assert.equal(failing.stderr, "finding");
  rmSync(root, { recursive: true, force: true });
});

test("reports unavailable native tooling without falling back to text scans", () => {
  const result = runNativeCheck(seen, tmpdir(), { PATH: "" });
  assert.equal(result.status, "unavailable");
});

