import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The clinic example pages from the OpenEMR review (tasks.md P30-T2, P30-T3, P30-T4): each passes axe at WCAG 2.2 AA and keeps
// its own safety rule.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const path of ["/flow-board", "/find-patient", "/review-of-systems", "/results-inbox"]) {
    test(`${path} passes axe`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("main")).toBeVisible();
        const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
        expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target[0]).join(", ")}`),
        ).toEqual([]);
    });
}

test.describe("flow board", () => {
    test("statuses, priority and an overdue wait are words, and nothing animates", async ({
        page,
    }) => {
        await page.goto("/flow-board");
        const table = page.getByRole("table", { name: "Today's appointments" });
        await expect(table).toContainText("Arrived, waiting");
        await expect(table).toContainText("Urgent");
        const overdue = page.locator("tr[data-overdue]");
        await expect(overdue).toHaveCount(1);
        await expect(overdue).toContainText("Waiting over 20 minutes");
        await expect(page.locator("time.duration-view").first()).toHaveAttribute(
            "datetime",
            /^PT\d+M$/,
        );
        const animations = await page.evaluate(() => document.getAnimations().length);
        expect(animations).toBe(0);
    });

    test("the board changes only on Refresh, says so once, and focus stays on the button", async ({
        page,
    }) => {
        await page.goto("/flow-board");
        const before = await page.locator("tbody").textContent();
        await page.waitForTimeout(1500);
        expect(await page.locator("tbody").textContent()).toBe(before);
        const refresh = page.getByRole("button", { name: "Refresh" });
        await refresh.focus();
        await page.keyboard.press("Enter");
        await expect(page.getByRole("status")).toContainText("Updated:");
        await expect(refresh).toBeFocused();
        expect(await page.locator("tbody").textContent()).not.toBe(before);
    });
});

test.describe("find a patient", () => {
    test("a single match is listed with two identifiers and not opened", async ({ page }) => {
        await page.goto("/find-patient");
        await page.getByLabel("Family name").fill("Okafor");
        await page.keyboard.press("Enter");
        await expect(page.getByRole("heading", { name: "1 patient matches" })).toBeFocused();
        await expect(page).toHaveURL(/\/find-patient$/);
        const row = page.getByRole("table", { name: "Matching patients" }).getByRole("row").nth(1);
        await expect(row).toContainText("12 Jul 1990");
        await expect(row).toContainText("943 476 5870");
    });

    test("possible duplicates are marked side by side, and no results is said in words", async ({
        page,
    }) => {
        await page.goto("/find-patient");
        await page.getByLabel("Family name").fill("Jones");
        await page.getByLabel("Given name").fill("Mary");
        await page.getByRole("button", { name: "Search" }).click();
        await expect(page.locator("tr[data-possible-duplicate]")).toHaveCount(2);
        await expect(page.getByText("Possible duplicate record").first()).toBeVisible();
        await page.getByLabel("Family name").fill("Nobody");
        await page.getByRole("button", { name: "Search" }).click();
        await expect(page.getByRole("heading", { name: "No patients match" })).toBeVisible();
    });
});

test.describe("review of systems", () => {
    test("no answer is chosen at first, and all-others-absent sets only the unanswered", async ({
        page,
    }) => {
        await page.goto("/review-of-systems");
        const cough = page.getByRole("radiogroup", { name: "Cough" });
        for (const answer of ["Present", "Absent", "Not asked"])
            await expect(cough.getByRole("radio", { name: answer })).not.toBeChecked();
        // Answer one symptom by keyboard: Tab into the group, then Space chooses the first answer.
        await cough.getByRole("radio", { name: "Present" }).focus();
        await page.keyboard.press("Space");
        await expect(cough.getByRole("radio", { name: "Present" })).toBeChecked();
        await page.getByRole("button", { name: "All other respiratory symptoms absent" }).click();
        await expect(cough.getByRole("radio", { name: "Present" })).toBeChecked();
        await expect(
            page
                .getByRole("radiogroup", { name: "Breathlessness" })
                .getByRole("radio", { name: "Absent" }),
        ).toBeChecked();
        await expect(
            page.getByRole("radiogroup", { name: "Wheeze" }).getByRole("radio", { name: "Absent" }),
        ).toBeChecked();
        // The other body system is untouched.
        await expect(
            page
                .getByRole("radiogroup", { name: "Chest pain" })
                .getByRole("radio", { name: "Absent" }),
        ).not.toBeChecked();
    });
});

test.describe("results inbox", () => {
    test("select-all is mixed while only some rows are chosen", async ({ page }) => {
        await page.goto("/results-inbox");
        const all = page.getByRole("checkbox", { name: "Select all results" });
        await page.getByRole("checkbox", { name: "Select Potassium for JONES, Mary" }).check();
        expect(await all.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(true);
        await all.check();
        await expect(page.getByRole("checkbox", { name: /^Select .+ for / })).toHaveCount(3);
        for (const box of await page.getByRole("checkbox", { name: /^Select .+ for / }).all())
            await expect(box).toBeChecked();
        expect(await all.evaluate((el: HTMLInputElement) => el.indeterminate)).toBe(false);
    });

    test("a bulk action says what it did once, in words per row, and focus stays on its button", async ({
        page,
    }) => {
        await page.goto("/results-inbox");
        const status = page.getByRole("status");
        const review = page.getByRole("button", { name: "Mark selected as reviewed" });
        await review.click();
        await expect(status).toHaveText("Select at least one result first.");
        await page.getByRole("checkbox", { name: "Select Sodium for NGUYEN, Linh" }).check();
        await review.focus();
        await page.keyboard.press("Enter");
        await expect(status).toHaveText("1 marked as reviewed.");
        await expect(review).toBeFocused();
        const row = page.getByRole("row", { name: /NGUYEN, Linh/ });
        await expect(row).toContainText("Reviewed by Dr A. Rahman at 09:30");
        await expect(page.getByRole("row", { name: /JONES, Mary/ })).toContainText("Not reviewed");
        await expect(page.locator(".results-inbox-coverage")).toContainText("2 not yet reviewed");
    });

    test("flags and priority are words, not colour", async ({ page }) => {
        await page.goto("/results-inbox");
        const jones = page.getByRole("row", { name: /JONES, Mary/ });
        await expect(jones).toContainText("High");
        await expect(jones).toContainText("Urgent");
        await expect(jones).toHaveAttribute("data-priority", "urgent");
    });
});
