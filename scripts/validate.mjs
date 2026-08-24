import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const root = resolve(dirname(new URL(import.meta.url).pathname), "..");
const skillsRoot = join(root, "skills");
const failures = [];

function fail(message) { failures.push(message); }
function read(path) { return readFileSync(path, "utf8"); }

const catalog = read(join(root, "SKILLS.md"));
const catalogEntries = [...catalog.matchAll(/^\| \[\$?([a-z0-9-]+)\]\(skills\/[^/]+\/SKILL\.md\)/gm)].map((match) => match[1]);
const skillNames = readdirSync(skillsRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();

if (new Set(catalogEntries).size !== catalogEntries.length) fail("catalog contains duplicate skill entries");
if (catalogEntries.sort().join(",") !== skillNames.join(",")) fail("catalog entries must exactly match skill directories");

for (const name of skillNames) {
  const skillRoot = join(skillsRoot, name);
  const skillPath = join(skillRoot, "SKILL.md");
  const metadataPath = join(skillRoot, "agents", "openai.yaml");
  if (!existsSync(skillPath)) { fail(`${name}: missing SKILL.md`); continue; }
  const source = read(skillPath);
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) fail(`${name}: missing YAML frontmatter`);
  else {
    if (!new RegExp(`^name: ${name}$`, "m").test(frontmatter[1])) fail(`${name}: frontmatter name must match directory`);
    if (!/^description: (?!\[TODO)/m.test(frontmatter[1])) fail(`${name}: missing useful description`);
  }
  if (!existsSync(metadataPath)) fail(`${name}: missing agents/openai.yaml`);
  else {
    const metadata = read(metadataPath);
    for (const key of ["display_name", "short_description", "default_prompt"]) {
      if (!new RegExp(`^  ${key}: \\".+\\"$`, "m").test(metadata)) fail(`${name}: openai.yaml missing ${key}`);
    }
    if (!metadata.includes(`$${name}`)) fail(`${name}: default prompt must mention $${name}`);
  }
}

const antiSlopRoot = join(skillsRoot, "anti-slop", "references");
const schemaPath = join(antiSlopRoot, "adapter.schema.json");
if (!existsSync(schemaPath)) fail("anti-slop: missing adapter schema");
const adapterDirectory = join(antiSlopRoot, "adapters");
const adapterIds = new Set();
for (const file of readdirSync(adapterDirectory).filter((name) => name.endsWith(".json"))) {
  const path = join(adapterDirectory, file);
  let adapter;
  try { adapter = JSON.parse(read(path)); } catch { fail(`${file}: invalid JSON`); continue; }
  for (const key of ["schemaVersion", "id", "displayName", "enforcement", "detection", "guidance"]) {
    if (!(key in adapter)) fail(`${file}: missing ${key}`);
  }
  if (adapter.schemaVersion !== 1) fail(`${file}: unsupported schemaVersion`);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(adapter.id ?? "")) fail(`${file}: invalid id`);
  if (adapterIds.has(adapter.id)) fail(`${file}: duplicate adapter id ${adapter.id}`);
  adapterIds.add(adapter.id);
  if (!['native', 'advisory'].includes(adapter.enforcement)) fail(`${file}: invalid enforcement mode`);
  if (!Array.isArray(adapter.detection?.manifests) || adapter.detection.manifests.length === 0) fail(`${file}: missing manifest detection`);
  if (!Array.isArray(adapter.detection?.extensions) || adapter.detection.extensions.length === 0) fail(`${file}: missing extension detection`);
  if (!existsSync(resolve(dirname(path), adapter.guidance ?? ""))) fail(`${file}: missing guidance ${adapter.guidance}`);
  if (adapter.enforcement === "native") {
    if (!Array.isArray(adapter.check?.argv) || adapter.check.argv.length < 2) fail(`${file}: native adapter needs a complete command`);
    if (adapter.check?.cwd !== "project-root") fail(`${file}: native adapter cwd must be project-root`);
  }
}

if (failures.length) {
  console.error(failures.map((message) => `validation error: ${message}`).join("\n"));
  process.exit(1);
}
console.log(`validated ${skillNames.length} skill(s) and ${adapterIds.size} anti-slop adapter(s)`);

