import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const distDir = "dist";

await mkdir(distDir, { recursive: true });

const artifact = {
  name: "cicd-sandbox",
  builtAt: new Date().toISOString(),
  version: "0.1.0",
};

await writeFile(
  join(distDir, "artifact.json"),
  JSON.stringify(artifact, null, 2),
  "utf8"
);

console.log("Build OK:", join(distDir, "artifact.json"));
