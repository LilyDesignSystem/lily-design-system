import { readFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

// A strict Content Security Policy: no unsafe-inline, no unsafe-eval, no third parties (spec/testing#content-security-policy).
const POLICY =
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'self'";

// Every composed page, and the catalog. Each component page is swept below.
const PAGES = [
    "/",
    "/book-an-appointment.html",
    "/contact-form.html",
    "/dashboard.html",
    "/dialog-flow.html",
    "/file-upload-form.html",
    "/logo-slot.html",
    "/navigation-and-menus.html",
    "/page-layout.html",
    "/rating-and-feedback.html",
    "/rtl-demo.html",
    "/search-and-filter.html",
    "/settings-page.html",
    "/tabbed-interface.html",
    "/task-management.html",
    "/timeline-and-cards.html",
    "/components/index.html",
];

async function violationsOn(page: Page, path: string): Promise<string[]> {
    await page.addInitScript(() => {
        (window as unknown as { cspViolations: string[] }).cspViolations = [];
        document.addEventListener("securitypolicyviolation", (event) => {
            (window as unknown as { cspViolations: string[] }).cspViolations.push(
                `${event.effectiveDirective} ${event.blockedURI} ${event.sourceFile}:${event.lineNumber} ${event.sample}`,
            );
        });
    });
    await page.route("**/*", async (route) => {
        const response = await route.fetch();
        await route.fulfill({
            response,
            headers: { ...response.headers(), "content-security-policy": POLICY },
        });
    });
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    return page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations);
}

for (const path of PAGES) {
    test(`no CSP violation on ${path}`, async ({ page }) => {
        expect(await violationsOn(page, path)).toEqual([]);
    });
}

test("the page-header pickers open and apply under the policy", async ({ page }) => {
    await violationsOn(page, "/");
    for (const picker of ["theme", "locale", "text-size"]) {
        await page.locator(`.${picker}-picker-button`).first().click();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
    }
    expect(
        await page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations),
    ).toEqual([]);
});

test("the policy is really applied: an inline style attribute is reported", async ({ page }) => {
    await violationsOn(page, "/");
    await page.evaluate(() => document.body.setAttribute("style", "color: red"));
    await expect
        .poll(() =>
            page.evaluate(
                () => (window as unknown as { cspViolations: string[] }).cspViolations.length,
            ),
        )
        .toBeGreaterThan(0);
});

test("every component page renders under the policy", async ({ page }) => {
    test.setTimeout(600_000);
    const slugs = readFileSync("../components.tsv", "utf8")
        .split("\n")
        .filter(Boolean)
        .map((row) => row.split("\t")[0]);
    await page.addInitScript(() => {
        (window as unknown as { cspViolations: string[] }).cspViolations = [];
        document.addEventListener("securitypolicyviolation", (event) => {
            (window as unknown as { cspViolations: string[] }).cspViolations.push(
                `${event.effectiveDirective} ${event.sample} ${event.sourceFile}:${event.lineNumber}`,
            );
        });
    });
    await page.route("**/*", async (route) => {
        const response = await route.fetch();
        await route.fulfill({
            response,
            headers: { ...response.headers(), "content-security-policy": POLICY },
        });
    });
    const found: string[] = [];
    for (const slug of slugs) {
        await page.goto(`/components/component.html?slug=${slug}`, {
            waitUntil: "domcontentloaded",
        });
        await expect(page.locator("#component-content h2").first()).toBeVisible();
        const violations = await page.evaluate(
            () => (window as unknown as { cspViolations: string[] }).cspViolations,
        );
        found.push(...violations.map((violation) => `${slug}: ${violation}`));
    }
    expect(found).toEqual([]);
});

test("a demo keeps its styles under the policy, and its code sample keeps its text", async ({
    page,
}) => {
    await page.route("**/*", async (route) => {
        const response = await route.fetch();
        await route.fulfill({
            response,
            headers: { ...response.headers(), "content-security-policy": POLICY },
        });
    });
    await page.goto("/components/component.html?slug=aspect-ratio-container");
    const styled = page.locator("#component-content [style]").first();
    await expect(styled).toHaveCount(1);
    expect(await styled.evaluate((element: HTMLElement) => element.style.length)).toBeGreaterThan(
        0,
    );
    await expect(page.locator("#component-content pre code").first()).toContainText("style=");
    await expect(page.locator("#component-content")).not.toContainText("data-demo-style");
});
