import { test, expect } from "@playwright/test";

// The patient banner composition (spec/healthcare-ui item 7, P27-T8): two identifiers, age, allergies whose status is never
// blank, a deceased state in words, and no field truncated or clipped at 320 CSS pixels.

test.describe("patient banner at 320px", () => {
    test.use({ viewport: { width: 320, height: 800 } });

    test("every field is visible, unclipped and inside the page", async ({ page }) => {
        await page.goto("/patient-banner");
        const banner = page.getByRole("region", { name: /MONTGOMERY-FITZWILLIAM/ });
        await expect(banner).toBeVisible();
        const fields = banner.locator("dd");
        expect(await fields.count()).toBe(5);
        for (const field of await fields.all()) {
            await expect(field).toBeVisible();
            const box = await field.boundingBox();
            expect(box, "field has a box").not.toBeNull();
            expect(box!.x).toBeGreaterThanOrEqual(0);
            expect(box!.x + box!.width).toBeLessThanOrEqual(320);
            const clipped = await field.evaluate((el) => {
                const style = getComputedStyle(el);
                return el.scrollWidth > el.clientWidth + 1 || style.textOverflow === "ellipsis";
            });
            expect(clipped, "field is clipped or truncated").toBe(false);
        }
        await expect(banner).toContainText(
            "MONTGOMERY-FITZWILLIAM, Alexandra Bartholomew-Josephine (Dr)",
        );
        await expect(banner).toContainText("Chlorhexidine gluconate skin preparations");
        const pageOverflows = await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth,
        );
        expect(pageOverflows, "the page scrolls sideways").toBe(false);
    });

    test("two identifiers and the age are shown", async ({ page }) => {
        await page.goto("/patient-banner");
        const banner = page.getByRole("region", { name: /MONTGOMERY-FITZWILLIAM/ });
        await expect(banner.locator("time[datetime='1949-02-03']")).toBeVisible();
        await expect(banner.locator(".england-national-health-service-number-view")).toBeVisible();
        await expect(banner.locator(".age-view")).toHaveAttribute("data-duration", "P77Y");
    });

    test("allergies are never blank, and a deceased patient is said in words", async ({ page }) => {
        await page.goto("/patient-banner");
        const living = page.getByRole("region", { name: /MONTGOMERY-FITZWILLIAM/ });
        await expect(
            living.getByRole("list", { name: "Known allergies" }).locator("li"),
        ).toHaveCount(4);

        const deceased = page.getByRole("region", { name: /NOAH, Baby/ });
        await expect(deceased).toHaveAttribute("data-deceased", "true");
        await expect(deceased.getByText("Deceased", { exact: true })).toBeVisible();
        const allergies = deceased.getByRole("list", { name: "Allergies not recorded" });
        await expect(allergies.locator("li")).toHaveText(["Allergies not recorded"]);
        await expect(deceased.locator("dd").filter({ hasText: "Not known" })).toHaveCount(1);
        await expect(deceased.locator(".age-view")).toHaveAttribute("data-duration", /^P\d+D$/);
    });
});
