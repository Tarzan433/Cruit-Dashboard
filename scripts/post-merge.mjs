import { execSync } from "node:child_process";

execSync("pnpm install --frozen-lockfile", { stdio: "inherit" });
execSync("pnpm --filter @workspace/db push", { stdio: "inherit" });
