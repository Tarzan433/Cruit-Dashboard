import { unlinkSync } from "node:fs";

const userAgent = process.env.npm_config_user_agent ?? "";
if (!userAgent.includes("pnpm")) {
  console.error("Use pnpm instead");
  process.exit(1);
}

for (const file of ["package-lock.json", "yarn.lock"]) {
  try {
    unlinkSync(file);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
}
