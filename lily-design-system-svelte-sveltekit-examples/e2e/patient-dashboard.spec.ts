import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// The patient dashboard (tasks.md P30-T5, P33-T4): never-blank cards with provenance, flags in words, and a workspace panel
// that keeps focus and the draft safe.

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

test("passes axe", async ({ page }) => {
    await page.goto("/patient-dashboard");
    const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target[0]).join(", ")}`)).toEqual(
        [],
    );
});

test("every card says what it holds, and whose and how current it is", async ({ page }) => {
    await page.goto("/patient-dashboard");
    await expect(page.getByRole("group", { name: "Patient flags" })).toContainText(
        "Needs an interpreter",
    );
    await expect(page.getByText("Active visit: outpatient")).toBeVisible();
    await expect(page.getByText("Location: Riverside Health Centre")).toBeVisible();
    await expect(page.locator(".immunization-record-list")).toHaveAttribute(
        "data-status",
        "not-recorded",
    );
    await expect(page.getByText("No immunizations have been recorded")).toBeVisible();
    await expect(page.locator(".problem-record-list-item-subject")).toHaveText("Mother");
    await expect(page.locator('.record-provenance-view[data-attestation="pending"]')).toContainText(
        "Awaiting a pharmacist's review",
    );
    await expect(page.locator('[data-due="overdue"]')).toContainText("Overdue");
});

test("every field is visible and unclipped at 320 pixels", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/patient-dashboard");
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
    await expect(page.getByText("Awaiting a pharmacist's review")).toBeVisible();
});

test.describe("workspace panel", () => {
    test("opens beside the chart, saves, and returns focus to the opener", async ({ page }) => {
        await page.goto("/patient-dashboard");
        const opener = page.getByRole("button", { name: "Add an allergy" });
        await opener.click();
        const panel = page.getByRole("complementary", { name: "Add an allergy" });
        await expect(panel).toBeVisible();
        // Not modal: the chart behind it is still in the accessibility tree.
        await expect(page.getByRole("heading", { name: "Problems" })).toBeVisible();
        await expect(page.getByLabel("Substance")).toBeFocused();
        await page.keyboard.type("Latex");
        await page.getByRole("button", { name: "Save allergy" }).click();
        await expect(panel).toBeHidden();
        await expect(opener).toBeFocused();
        await expect(page.getByRole("status")).toHaveText("Allergy to Latex added");
        await expect(page.locator(".allergy-record-list-item")).toHaveCount(2);
    });

    test("minimise keeps the draft, and restoring brings it back", async ({ page }) => {
        await page.goto("/patient-dashboard");
        await page.getByRole("button", { name: "Add an allergy" }).click();
        await page.getByLabel("Substance").fill("Iodine");
        await page.getByRole("button", { name: "Minimise" }).click();
        const restore = page.getByRole("button", { name: "Return to: Add an allergy (not saved)" });
        await expect(restore).toBeFocused();
        await page.keyboard.press("Enter");
        await expect(page.getByLabel("Substance")).toHaveValue("Iodine");
    });

    test("closing with unsaved changes asks first; keep editing keeps them", async ({ page }) => {
        await page.goto("/patient-dashboard");
        await page.getByRole("button", { name: "Add an allergy" }).click();
        await page.getByLabel("Substance").fill("Iodine");
        await page.getByRole("button", { name: "Close" }).click();
        const dialog = page.getByRole("alertdialog", { name: "Discard this allergy?" });
        await expect(dialog).toBeVisible();
        await dialog.getByRole("button", { name: "Keep editing" }).click();
        await expect(page.getByLabel("Substance")).toHaveValue("Iodine");
        await page.getByRole("button", { name: "Close" }).click();
        await page.getByRole("alertdialog").getByRole("button", { name: "Discard" }).click();
        await expect(page.getByRole("complementary", { name: "Add an allergy" })).toBeHidden();
        await expect(page.getByRole("button", { name: "Add an allergy" })).toBeFocused();
    });
});

test("the vital signs trend gives each sign's last, lowest and highest in words, and the line's label repeats them", async ({
    page,
}) => {
    await page.goto("/patient-dashboard");
    const pulse = page.getByRole("row", { name: /^Pulse/ });
    await expect(pulse).toContainText("94 beats a minute");
    await expect(pulse).toContainText("72 beats a minute");
    await expect(
        pulse.getByRole("img", { name: "Pulse: 72, 76, 81, 88, 94 beats a minute" }),
    ).toBeVisible();
});
