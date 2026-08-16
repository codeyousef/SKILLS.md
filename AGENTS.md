# Repository guidance

- Keep each reusable skill in `skills/<name>/` with a required `SKILL.md`.
- Keep `SKILLS.md` synchronized with the skill directories.
- Make target-repository runtimes optional. Development-only validation may use Node.
- Keep language-specific rules and references inside the owning skill.
- Do not claim native enforcement until an adapter manifest, guidance, and tests exist.
- Run `npm run check` before publishing changes.
