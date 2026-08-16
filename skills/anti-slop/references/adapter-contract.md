# Adapter contract

Every adapter is a JSON file in `references/adapters/` conforming to
`adapter.schema.json`.

Required fields:

- `schemaVersion`: currently `1`.
- `id` and `displayName`: stable language identity.
- `enforcement`: `native` or `advisory`.
- `detection.manifests` and `detection.extensions`: non-empty language signals.
- `guidance`: a path relative to the adapter file.

Native adapters also require `check.argv` and `check.cwd`. `argv` must contain
the exact documented command and `cwd` must be `project-root` unless the
adapter documents another validated policy.

Add fixtures for manifest detection, extension-only detection, unsupported
workspaces, missing native tooling, successful checks, and failing checks before
advertising native enforcement.

