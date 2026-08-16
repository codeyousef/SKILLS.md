---
name: anti-slop
description: Review, improve, or configure code to reject low-evidence and low-signal implementation patterns in any programming language. Use when a user asks for anti-slop review, evidence-first code generation, safer boundary handling, or native anti-slop lint setup and verification.
---

# Anti-Slop

Apply evidence-first engineering without inventing language support.

## Workflow

1. Read repository instructions and inspect the working tree. Preserve unrelated work.
2. Identify source languages from manifests and owned source files.
3. Read [core principles](references/core-principles.md).
4. For every matching adapter manifest in `references/adapters/`, read its linked guidance and follow its native-check contract.
5. For languages without an executable adapter, perform advisory review using the core principles. State that native enforcement is unavailable.
6. Report findings with concrete evidence, a safer alternative, native-check output when run, and anything not verified.

## Enforcement rules

- Treat native-check output and exit status as authoritative. Do not parse or normalize diagnostics unless an adapter explicitly requires it.
- Do not add suppressions, weaken rules, or modify application code unless the user asks for remediation.
- Do not substitute text-pattern scans for a missing native adapter.
- Preserve each source file's language, conventions, and comments.
- Read [the adapter contract](references/adapter-contract.md) before adding or changing an adapter.

