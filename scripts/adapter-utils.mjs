import { spawnSync } from "node:child_process";

export function matchesAdapter(adapter, paths) {
  return paths.some((path) =>
    adapter.detection.manifests.some((name) => path.endsWith(name)) ||
    adapter.detection.extensions.some((extension) => path.endsWith(extension))
  );
}

export function nativeCheckPlan(adapter, projectRoot) {
  if (adapter.enforcement !== "native") return null;
  return { argv: adapter.check.argv, cwd: projectRoot };
}

export function runNativeCheck(adapter, projectRoot, env = process.env) {
  const plan = nativeCheckPlan(adapter, projectRoot);
  if (!plan) return { status: "advisory", stdout: "", stderr: "" };
  const [command, ...args] = plan.argv;
  const result = spawnSync(command, args, {
    cwd: plan.cwd,
    env,
    encoding: "utf8"
  });
  if (typeof result.status === "number") {
    return { status: result.status === 0 ? "clean" : "findings", code: result.status, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
  }
  return { status: "unavailable", error: result.error, stdout: result.stdout ?? "", stderr: result.stderr ?? "" };
}
