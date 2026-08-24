# Seen adapter

Use this adapter when the repository contains `Seen.toml` or owned `.seen`
source files.

1. Resolve the intended `seen` executable. Prefer the project-selected compiler
   and record `seen --version`.
2. Run top-level `seen --help` and confirm that it exposes `lint`. Do not assume
   subcommand flags, profiles, JSON output, or a configuration format.
3. Find the nearest `Seen.toml`; otherwise use the selected source directory as
   the project root.
4. Run exactly `seen lint` at that root. Preserve its output and exit status.
5. Use the core principles to explain findings. Preserve multilingual Seen
   keywords and do not replace native linting with English-token searches.

If `seen` or `seen lint` is unavailable, report the missing prerequisite and
perform advisory review only. Do not modify Seen source, lint configuration, or
compiler code unless the user explicitly requests it.

