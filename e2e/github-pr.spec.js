import { test, expect } from "@playwright/test";

const REPO = "Sabyrzhanuly/cicd_test";

test.describe("GitHub: PR dev/nurlan → develop", () => {
  test("compare page — Able to merge, 2 коммита CI", async ({ page }) => {
    await page.goto(
      `https://github.com/${REPO}/compare/develop...dev/nurlan?expand=1`
    );

    await expect(page.getByRole("heading", { name: "Comparing changes" })).toBeVisible();
    await expect(page.getByText("Able to merge.")).toBeVisible();
    await expect(page.getByText("2 commits")).toBeVisible();
    await expect(page.getByRole("link", { name: /restore lint job/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /drop lint and test/i })).toBeVisible();
  });

  test("в diff есть ci.yml и package.json", async ({ page }) => {
    await page.goto(
      `https://github.com/${REPO}/compare/develop...dev/nurlan?expand=1`
    );

    await expect(page.getByRole("button", { name: /changed files/i })).toBeVisible();
    await expect(page.getByRole("link", { name: ".github/workflows/ci.yml" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "package.json" }).first()).toBeVisible();
  });
});

test.describe("GitHub: Actions", () => {
  test("страница Actions загружается", async ({ page }) => {
    await page.goto(`https://github.com/${REPO}/actions`);
    await expect(page).toHaveTitle(/Workflow runs/);
    await expect(page.getByRole("heading", { name: /actions/i }).first()).toBeVisible();
  });
});
