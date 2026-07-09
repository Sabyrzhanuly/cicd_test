import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";

const REPO = "Sabyrzhanuly/cicd_test";

function git(cmd) {
  return execSync(cmd, { encoding: "utf8", stdio: "pipe" }).trim();
}

function tryPush(branch) {
  try {
    const out = execSync(`git push origin ${branch}`, {
      encoding: "utf8",
      stdio: "pipe",
    });
    return { ok: true, output: out };
  } catch (error) {
    const err = /** @type {{ stdout?: string; stderr?: string }} */ (error);
    return {
      ok: false,
      output: `${err.stdout ?? ""}${err.stderr ?? ""}`,
    };
  }
}

function withEmptyCommit(branch, fn) {
  git("git fetch origin");
  git(`git checkout ${branch}`);
  git(`git reset --hard origin/${branch}`);
  const remoteBefore = git(`git rev-parse origin/${branch}`);
  git(`git commit --allow-empty -m "pw-test: ruleset direct push ${branch}"`);
  try {
    return fn();
  } finally {
    git(`git reset --hard ${remoteBefore}`);
    try {
      execSync(`git push --force-with-lease origin ${branch}:${branch}`, {
        stdio: "pipe",
      });
    } catch {
      // develop/main: push был отклонён — remote не менялся
    }
  }
}

test.describe("Ruleset: direct push", () => {
  test("develop — push заблокирован (GH013)", () => {
    const result = withEmptyCommit("develop", () => tryPush("develop"));

    expect(result.ok).toBe(false);
    expect(result.output).toMatch(/GH013|repository rule violations/i);
    expect(result.output).toMatch(/pull request/i);
  });

  test("main — push заблокирован (GH013)", () => {
    const result = withEmptyCommit("main", () => tryPush("main"));

    if (result.ok) {
      test.info().annotations.push({
        type: "warning",
        description:
          "main НЕ защищён ruleset! Создайте protect-main в GitHub Settings → Rules",
      });
    }
    expect(result.ok).toBe(false);
    expect(result.output).toMatch(/GH013|repository rule violations/i);
  });

  test("dev/nurlan — push разрешён", () => {
    const result = withEmptyCommit("dev/nurlan", () => tryPush("dev/nurlan"));

    expect(result.ok).toBe(true);
  });
});

test.describe("GitHub UI: Rulesets (публичная проверка)", () => {
  test("страница rules требует авторизацию", async ({ page }) => {
    await page.goto(`https://github.com/${REPO}/settings/rules`);
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });
});
