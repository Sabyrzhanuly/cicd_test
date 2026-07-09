import { test, expect } from "@playwright/test";

const REPO = "Sabyrzhanuly/cicd_test";

test.describe("GitHub: compare develop...dev/nurlan", () => {
  test("страница compare загружается (sync или Able to merge)", async ({
    page,
  }) => {
    await page.goto(
      `https://github.com/${REPO}/compare/develop...dev/nurlan?expand=1`
    );

    await expect(
      page.getByRole("heading", {
        name: /Comparing changes|Open a pull request/i,
      })
    ).toBeVisible();

    const body = await page.locator("body").innerText();
    const synced =
      /There isn't anything to compare|are identical|0 commits/i.test(body);
    const canMerge = /Able to merge/i.test(body);

    expect(synced || canMerge).toBe(true);
  });
});

test.describe("GitHub: merged PR (self-merge policy)", () => {
  test("PR #12 смержен автором без обязательного approval", async ({
    page,
  }) => {
    await page.goto(`https://github.com/${REPO}/pull/12`);

    await expect(page).toHaveTitle(
      /optional CODEOWNERS, self-merge with 0 approvals/i
    );
    await expect(page.getByText(/Merged/i).first()).toBeVisible();

    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Sabyrzhanuly|merged/i);
  });
});

test.describe("GitHub: Actions", () => {
  test("страница Actions загружается", async ({ page }) => {
    await page.goto(`https://github.com/${REPO}/actions`);
    await expect(page).toHaveTitle(/Workflow runs/);
    await expect(
      page.getByRole("heading", { name: /actions/i }).first()
    ).toBeVisible();
  });

  test("CI workflow page загружается", async ({ page }) => {
    await page.goto(`https://github.com/${REPO}/actions/workflows/ci.yml`);
    await expect(page).toHaveTitle(/CI/);
    await expect(page.getByRole("heading", { name: /^CI$/i }).first()).toBeVisible();
  });
});
