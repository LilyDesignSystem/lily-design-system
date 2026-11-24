import { expect, test } from "@playwright/test";

// The Purpose filter on /components (tasks.md P46-T3): one select, counts in its options, and it narrows the list.
test("the Purpose filter narrows the component list and combines with search", async ({ page }) => {
    await page.goto("/components/");
    const items = page.locator('ul[aria-label="Component list"] li');
    const total = await items.count();
    expect(total).toBeGreaterThan(600);

    // The page is server-rendered; choose again until the script has hydrated and the choice takes effect.
    await expect(async () => {
        await page.getByLabel("Purpose").selectOption("navigate");
        expect(await items.count()).toBeLessThan(total);
    }).toPass();
    const navigate = await items.count();
    expect(navigate).toBeGreaterThan(0);
    await expect(page.getByRole("status")).toContainText(`${navigate} of ${total} components`);

    await page.getByLabel("Search components").fill("breadcrumb");
    await expect.poll(() => items.count()).toBeLessThan(navigate);
    expect(await items.count()).toBeGreaterThan(0);

    await page.getByLabel("Purpose").selectOption("");
    await page.getByLabel("Search components").fill("");
    await expect(items).toHaveCount(total);
});
