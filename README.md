# SKILLS.md

A small, reusable collection of agent skills. Each skill is self-contained in
`skills/<name>/` and is listed in the root [catalog](SKILLS.md).

## Install

Use a compatible skill manager to install an individual skill from this
repository. For managers supporting the `skills` CLI convention:

```bash
npx skills add codeyousef/SKILLS.md --skill anti-slop
```

Manual installation is also supported: copy `skills/anti-slop` into the
consumer's skill directory. Target repositories do not need Node merely to use
the installed skill; Node is used only for this repository's development checks.

## Development

```bash
npm run check
```

Add a skill under `skills/<name>/`, register it in `SKILLS.md`, and keep its
language-specific material isolated within that skill.
