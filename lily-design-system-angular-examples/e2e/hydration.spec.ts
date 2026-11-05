import { expect, test } from "@playwright/test";

// Every composed page hydrates: the browser keeps the prerendered DOM, with no mismatch.
const PAGES = [
    "/",
    "/components",
    "/components/dialog",
    "/demos/actions",
    "/demos/composed-inputs",
    "/demos/disclosures",
    "/demos/modals",
    "/demos/modals-open",
    "/demos/tree-and-overflow",
    "/book-an-appointment",
    "/contact-form",
    "/dashboard",
    "/dialog-flow",
    "/file-upload-form",
    "/navigation-and-menus",
    "/page-layout",
    "/rating-and-feedback",
    "/rtl-demo",
    "/search-and-filter",
    "/settings-page",
    "/tabbed-interface",
    "/task-management",
    "/timeline-and-cards",
];

for (const path of PAGES) {
    test(`${path} hydrates cleanly`, async ({ page }) => {
        const problems: string[] = [];
        page.on("pageerror", (e) => problems.push(e.message));
        page.on("console", (m) => {
            if (/NG0|hydrat/i.test(m.text()) && m.type() !== "debug" && m.type() !== "info")
                problems.push(m.text());
        });
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        await expect(page.locator("[ng-version]").first()).toBeAttached();
        expect(problems).toEqual([]);
    });
}

test("tabbed interface: one panel shows, and the tabs switch it", async ({ page }) => {
    await page.goto("/tabbed-interface");
    await expect(page.getByText("Overview content.")).toBeVisible();
    await expect(page.getByText("Details content.")).toBeHidden();
    const tabs = page.getByRole("tab");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await tabs.nth(1).click();
    await expect(page.getByText("Details content.")).toBeVisible();
    await expect(page.getByText("Overview content.")).toBeHidden();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.first()).toHaveAttribute("tabindex", "-1");
});
