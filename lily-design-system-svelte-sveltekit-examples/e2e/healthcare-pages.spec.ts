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
    await expect(page.getByRole("article", { name: "Patient summary" })).toBeVisible();
    for (const name of ["Allergies and intolerances", "Medication summary", "Problems"])
        await expect(page.getByRole("region", { name })).toBeVisible();
    // The contents link to each section, in order; nothing is missing, so nothing is added.
    const contents = page.getByRole("navigation", { name: "Contents" }).getByRole("link");
    await expect(contents).toHaveText([
        "Allergies and intolerances",
        "Medication summary",
        "Problems",
        "Results",
    ]);
    await expect(page.locator('section[data-status="omitted"]')).toHaveCount(0);
    await expect(page.getByRole("region", { name: "Problems" })).toHaveAttribute(
        "data-code",
        "11450-4",
    );
    await expect(page.getByText("No problems were recorded at the last review.")).toBeVisible();
    await expect(page.getByRole("region", { name: "Problems" })).toContainText(
        "No information about current problems is available",
    );
    await expect(page.locator(".medication-view-tall-man")).toHaveText("ALAZINE");
    await expect(page.locator(".problem-record-list")).toHaveAttribute(
        "data-status",
        "not-recorded",
    );
    await expect(page.locator(".medication-record-list-item-status").first()).toHaveText("Active");
    await expect(page.locator(".allergy-record-list-item")).toHaveAttribute(
        "data-criticality",
        "high",
    );
    // Coded values (P28-T9): hidden until asked for, then beside each entry.
    await expect(page.getByText("ATC A10BA02")).toBeHidden();
    await page.getByRole("button", { name: "Show codes" }).press("Enter");
    await expect(page.getByText("ATC A10BA02")).toBeVisible();
    await expect(page.getByText("SNOMED CT 373270004")).toBeVisible();
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
    const cells = page.locator("tbody td[data-status]");
    expect(await cells.count()).toBe(8);
    for (const text of await cells.allTextContents()) expect(text.trim().length).toBeGreaterThan(0);
    const row = page.getByRole("row", { name: /enoxaparin/ });
    await expect(row).toContainText("Omitted 08:10: patient refused");
    // The product on the box and the prescribed dose differ, and each is in its own cell.
    await expect(row.getByRole("rowheader")).toContainText("60\u00a0mg");
    await expect(row.getByRole("cell").first()).toHaveText("40\u00a0mg subcutaneous");
});

test("the medicines chart names its patient and its date, and prints them", async ({ page }) => {
    await page.goto("/medicines-administration");
    const banner = page.getByRole("region", { name: "Patient details: EXAMPLE, Alex" });
    for (const media of ["screen", "print"] as const) {
        await page.emulateMedia({ media });
        await expect(banner).toContainText("Invented-0001");
        await expect(page.locator("main time[datetime='2026-11-14']")).toHaveText(
            "14 November 2026",
        );
        await expect(page.getByText("Omitted 08:10: patient refused")).toBeVisible();
    }
    await expect(page.locator("main")).not.toContainText("today");
});

test("the observations chart has one source: a new reading changes the headline, chart, table and score", async ({
    page,
}) => {
    await page.goto("/observations-chart");
    const agree = async (rate: string, time: string, count: number, flag: string, band: string) => {
        await expect(page.locator(".observation-view-value").first()).toHaveText(rate);
        await expect(
            page.getByRole("img", { name: new RegExp(`${rate} at ${time}$`) }),
        ).toBeVisible();
        const rows = page.getByRole("table", { name: /Respiration rate/ }).locator("tbody tr");
        await expect(rows).toHaveCount(count);
        await expect(rows.last()).toContainText(rate);
        await expect(rows.last()).toContainText(flag);
        await expect(page.locator(".early-warning-score-view")).toHaveAttribute("data-band", band);
    };
    await agree("26", "18:00", 4, "High", "medium");
    await expect(page.locator(".observation-view-flag").first()).toHaveText("High");
    await page.getByRole("button", { name: "Show the 22:00 reading" }).click();
    await agree("16", "22:00", 5, "None", "low");
    await expect(
        page.locator(".observation-view").first().locator(".observation-view-flag"),
    ).toHaveCount(0);
});

test("a corrected result keeps seen, acknowledged and follow-up apart", async ({ page }) => {
    await page.goto("/observations-chart");
    const result = page.getByRole("region", { name: "Corrected potassium result" });
    await expect(result.locator("del")).toHaveText("6.1");
    for (const term of [
        "Sample collected",
        "Amended",
        "Responsible for follow-up",
        "Seen",
        "Acknowledged",
        "Follow-up",
    ])
        await expect(result.locator("dt").getByText(term, { exact: true })).toBeVisible();
});

test("the handover rehearsal is completed by keyboard alone, says nothing was sent, and keeps the text", async ({
    page,
    browserName,
}) => {
    await page.goto("/handover");
    const form = page.getByRole("form", { name: "SBAR handover rehearsal" });
    const fields = ["Situation", "Background", "Assessment", "Recommendation"];
    // The fields are off until the page's script runs.
    await expect(form.getByRole("textbox", { name: fields[0] })).toBeEnabled();
    await form.getByRole("textbox", { name: fields[0] }).focus();
    for (const [i, name] of fields.entries()) {
        await expect(form.getByRole("textbox", { name })).toBeFocused();
        await page.keyboard.type(`${name} text`);
        // Safari's Tab skips buttons unless Option is held, as a Safari user's keyboard does.
        await page.keyboard.press(
            i === fields.length - 1 && browserName === "webkit" ? "Alt+Tab" : "Tab",
        );
    }
    const button = page.getByRole("button", { name: "Rehearse handover" });
    await expect(button).toBeFocused();
    // Twice, as a person retrying would.
    for (let i = 0; i < 2; i++) {
        await page.keyboard.press("Enter");
        await expect(page.getByRole("status")).toContainText("Rehearsal only. Nothing was sent");
    }
    await expect(page.getByRole("status")).not.toContainText(/delivered|accepted|handover sent/i);
    await expect(form.getByRole("textbox", { name: "Situation" })).toHaveValue("Situation text");
    expect(new URL(page.url()).search).toBe("");
});

test("a handover draft stays with its patient", async ({ page }) => {
    await page.goto("/handover");
    const situation = page.getByRole("textbox", { name: "Situation" });
    await situation.fill("About the first person");
    await page.getByLabel("Patient").selectOption({ index: 1 });
    await expect(situation).toHaveValue("");
    await situation.fill("About the second person");
    await page.getByLabel("Patient").selectOption({ index: 0 });
    await expect(situation).toHaveValue("About the first person");
});

test.describe("the handover before its script runs", () => {
    test.use({ javaScriptEnabled: false });
    test("cannot submit a narrative: its fields are off and have no names, and it would not use GET", async ({
        page,
    }) => {
        await page.goto("/handover");
        const form = page.locator("form[aria-label='SBAR handover rehearsal']");
        await expect(form).toHaveAttribute("method", "post");
        await expect(form.locator("fieldset")).toHaveAttribute("disabled", "");
        for (const field of await form.locator("textarea, select").all()) {
            await expect(field).toBeDisabled();
            expect(await field.getAttribute("name")).toBeNull();
        }
    });
});

test("a section that cannot load says so in words, offers a retry, and announces only the retry", async ({
    page,
}) => {
    await page.goto("/patient-summary");
    const results = page.getByRole("region", { name: "Results" });
    await expect(results).toHaveAttribute("data-status", "unavailable");
    await expect(results).toContainText("This does not mean there are none");
    await expect(page.locator(".patient-summary-results-status")).toHaveText("");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await results.getByRole("button", { name: "Try again" }).click();
    await expect(results).toContainText("Potassium 4.6 mmol/L");
    await expect(page.locator(".patient-summary-results-status")).toHaveText("Results loaded");
});

test.describe("the patient summary is one patient's (P50-T8)", () => {
    const banner = (page: import("@playwright/test").Page, name: string) =>
        page.getByRole("region", { name: `Patient details: ${name}` });
    const ALEXANDRA = /943 476 5919|3 February 1949|Penicillin|metformin|4\.6 mmol/;
    const ALEXANDER = /943 476 5870|3 February 1979|amlodipine|3\.9 mmol/;

    test("the banner names the patient with two more identifiers, on screen and in print", async ({
        page,
    }) => {
        await page.goto("/patient-summary");
        for (const media of ["screen", "print"] as const) {
            await page.emulateMedia({ media });
            const details = banner(page, "EXAMPLE, Alexandra");
            await expect(details).toBeVisible();
            for (const text of ["EXAMPLE, Alexandra", "3 February 1949", "943 476 5919"])
                await expect(details.getByText(text, { exact: true })).toBeVisible();
            await expect(
                page.getByRole("article", { name: "Patient summary" }).getByRole("region").first(),
            ).toHaveAccessibleName("Patient details: EXAMPLE, Alexandra");
        }
    });

    test("switching patient replaces the banner and every section", async ({ page }) => {
        await page.goto("/patient-summary");
        const article = page.getByRole("article", { name: "Patient summary" });
        await expect(article).toContainText("943 476 5919");
        await page.getByLabel("Patient", { exact: true }).selectOption("q4m9");
        await expect(banner(page, "EXAMPLE, Alexander")).toContainText("943 476 5870");
        await expect(banner(page, "EXAMPLE, Alexandra")).toHaveCount(0);
        await expect(article).not.toContainText(ALEXANDRA);
        await expect(article).toContainText("No known allergies");
        await expect(article).toContainText("amlodipine");
        await expect(page.locator(".patient-summary-switched")).toHaveText(
            "Now showing EXAMPLE, Alexander, born 3 February 1979",
        );
        expect(await article.innerHTML()).not.toMatch(ALEXANDRA);
    });

    test("a late answer is never shown under another patient, and a retry is that patient's", async ({
        page,
    }) => {
        await page.goto("/patient-summary");
        const results = page.getByRole("region", { name: "Results" });
        const article = page.getByRole("article", { name: "Patient summary" });
        await results.getByRole("button", { name: "Try again" }).click();
        await expect(page.locator(".patient-summary-results-status")).toHaveText(
            "Loading results for EXAMPLE, Alexandra",
        );
        await page.getByLabel("Patient", { exact: true }).selectOption("q4m9");
        await page.waitForTimeout(1200);
        await expect(results).toHaveAttribute("data-status", "unavailable");
        await expect(article).not.toContainText(ALEXANDRA);
        await expect(page.locator(".patient-summary-results-status")).toHaveText("");
        await results.getByRole("button", { name: "Try again" }).click();
        await expect(results).toContainText("3.9 mmol/L");
        await expect(results.locator("[data-results-for]")).toHaveAttribute(
            "data-results-for",
            "q4m9",
        );
        await page.getByLabel("Patient", { exact: true }).selectOption("r7k2");
        await expect(article).not.toContainText(ALEXANDER);
    });
});
