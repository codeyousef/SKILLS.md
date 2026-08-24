# Core anti-slop principles

Use these principles for every language. A language adapter may provide more
specific native enforcement, but it must not contradict them.

## Preserve evidence

- Keep known values, keys, and types precise instead of widening them and later
  asserting precision back.
- Prefer named domain contracts over shapeless containers and catch-all values.
- Make assumptions explicit where the language cannot prove them.

## Validate at boundaries

- Parse or validate untrusted input at the boundary, then pass typed values
  inward.
- Preserve failure context rather than converting errors into speculative
  defaults.
- Prefer explicit capability and ownership boundaries to ambient access.

## Make risky operations reviewable

- Use static calls and explicit dependencies when they are available.
- Keep unsafe, reflective, dynamic, or foreign-function transitions narrow.
- Document the checked invariant immediately beside a necessary unsafe step.
- Prefer real dependency seams over module-wide replacement or hidden global
  behavior.

## Review output

For each finding, identify the evidence that is missing or erased, explain the
risk, and propose the smallest behavior-preserving repair. Do not report a
style preference as an anti-slop finding without a concrete evidence loss.

