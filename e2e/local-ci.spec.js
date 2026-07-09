import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

test.describe("Локальный CI (lint + build)", () => {
  test("npm run lint проходит", () => {
    execSync("npm run lint", { stdio: "pipe" });
  });

  test("npm run build создаёт dist/artifact.json", () => {
    execSync("npm run build", { stdio: "pipe" });
    expect(existsSync("dist/artifact.json")).toBe(true);
    const artifact = JSON.parse(readFileSync("dist/artifact.json", "utf8"));
    expect(artifact.name).toBe("cicd-sandbox");
  });

  test("npm run ci = lint + build", () => {
    execSync("npm run ci", { stdio: "pipe" });
  });
});

test.describe("Модуль src/index.js", () => {
  test("greet и add работают", async () => {
    const { greet, add } = await import("../src/index.js");
    expect(greet("World")).toMatch(/Hello, World!/);
    expect(add(2, 3)).toBe(5);
  });
});
