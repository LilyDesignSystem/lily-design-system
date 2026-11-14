import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The clinical example pages (spec/healthcare-ui item 9, P27-T9): each passes axe at WCAG 2.2 AA, and each keeps its own
// safety rule: words, never colour alone; a reason, never a blank; changes summarised, not announced cell by cell.

const PAGES = [
    "/patient-summary",
    "/ward-board",
    "/medicines-administration",
    "/observations-chart",
    "/handover",
];
const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

for (const path of PAGES) {
    test(`${path} passes axe`, async ({ page }) => {
        await page.goto(path);
        await expect(page.locator("main")).toBeVisible();
        const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
        expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target[0]).join(", ")}`),
        ).toEqual([]);
    });
}

test("the patient summary has the three IPS sections, and an empty one says why", async ({
    page,
}) => {
    await page.goto("/patient-summary");
    for (const name of ["Allergies and intolerances", "Medication summary", "Problems"])
        await expect(page.getByRole("region", { name })).toBeVisible();
    await expect(page.getByRole("region", { name: "Problems" })).toContainText(
        "No information about current problems is available",
    );
    await expect(page.locator(".medication-view-tall-man")).toHaveText("ALAZINE");
    await expect(page.locator(".medication-view-strength").last()).toHaveText("0.05 mg");
});

test("the ward board summarises a change in one status line", async ({ page }) => {
    await page.goto("/ward-board");
    const status = page.getByRole("status");
    await expect(status).toHaveText("1 free, 1 being cleaned, of 4 beds");
    await page.getByRole("button", { name: "Mark cleaning finished" }).press("Enter");
    await expect(status).toHaveText("2 free, 0 being cleaned, of 4 beds");
    expect(
        await page.locator("main").locator("[aria-live], [role=status], [role=alert]").count(),
    ).toBe(1);
    await expect(page.getByRole("row", { name: /Bed 2/ })).toContainText("Medium");
});

test("every administration on the chart is words", async ({ page }) => {
    await page.goto("/medicines-administration");
    const cells = page.locator("tbody td");
    expect(await cells.count()).toBe(8);
    for (const text of await cells.allTextContents()) expect(text.trim().length).toBeGreaterThan(0);
    await expect(page.getByRole("row", { name: /enoxaparin/ })).toContainText(
        "Omitted: patient refused",
    );
});

test("the observations chart has its data table and the latest flag in words", async ({ page }) => {
    await page.goto("/observations-chart");
    await expect(page.getByRole("img", { name: /Respiration rate today/ })).toBeVisible();
    await expect(
        page.getByRole("table", { name: /Respiration rate/ }).locator("tbody tr"),
    ).toHaveCount(4);
    await expect(page.locator(".observation-view-flag")).toHaveText("High");
    await expect(page.locator(".early-warning-score-view")).toHaveAttribute("data-band", "medium");
});

test("the handover is completed and sent by keyboard alone", async ({ page, browserName }) => {
    await page.goto("/handover");
    const form = page.getByRole("form", { name: "SBAR handover" });
    const fields = ["Situation", "Background", "Assessment", "Recommendation"];
    await form.getByRole("textbox", { name: fields[0] }).focus();
    for (const [i, name] of fields.entries()) {
        await expect(form.getByRole("textbox", { name })).toBeFocused();
        await page.keyboard.type(`${name} text`);
        // Safari's Tab skips buttons unless Option is held, as a Safari user's keyboard does.
        await page.keyboard.press(
            i === fields.length - 1 && browserName === "webkit" ? "Alt+Tab" : "Tab",
        );
    }
    await expect(page.getByRole("button", { name: "Send handover" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("status")).toHaveText("Handover sent");
});
