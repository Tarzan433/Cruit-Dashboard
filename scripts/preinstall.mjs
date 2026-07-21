import { unlinkSync } from "node:fs";

const userAgent = process.env.npm_config_user_agent ?? "";
if (!userAgent.includes("pnpm")) {
  console.warn("Use pnpm instead");
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
