import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The project tutorials (spec/tutorials, tasks.md Phase 51). bin/check-tutorials builds and drives the app each one teaches;
// this checks the pages themselves.
const TUTORIALS = [
    { slug: "international-patient-summary", title: "International Patient Summary tutorial" },
    { slug: "electronic-patient-record", title: "Electronic patient record tutorial" },
    { slug: "patient-administration-system", title: "Patient administration system tutorial" },
    {
        slug: "pre-operative-assessment-by-patient",
        title: "Pre-operative assessment by patient tutorial",
        repo: "https://github.com/FormExamples/form-examples",
    },
];

for (const { slug, title, repo } of TUTORIALS) {
    test(`/tutorials/${slug}/ is a complete tutorial`, async ({ page }) => {
        await page.setViewportSize({ width: 320, height: 800 });
        await page.goto(`/tutorials/${slug}/`);
        const main = page.locator("main");
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        await expect(main).toContainText("For learning only.");
        await expect(
            main.locator(`a[href="${repo ?? `https://github.com/${slug}/${slug}`}"]`).first(),
        ).toBeVisible();
        for (const other of TUTORIALS.filter((t) => t.slug !== slug))
            await expect(main.locator(`a[href="/tutorials/${other.slug}/"]`)).toHaveCount(1);
        // The code is whole: the tags are there, and nothing was read as Svelte.
        await expect(main.locator('pre[data-file="src/routes/+layout.svelte"]')).toContainText(
            '<script lang="ts">',
        );
        for (const pre of await main.locator("pre").all())
            await expect(pre).toHaveAttribute("tabindex", "0");
        const wide = await page.evaluate(() =>
            document.documentElement.scrollWidth <= document.documentElement.clientWidth
                ? []
                : [...document.querySelectorAll("body *")]
                      .filter(
                          (e) =>
                              !e.parentElement?.closest("pre") &&
                              e.getBoundingClientRect().right > innerWidth + 1,
                      )
                      .map(
                          (e) =>
                              `${e.tagName}.${e.className}: ${e.textContent?.trim().slice(0, 40)}`,
                      )
                      .slice(0, 6),
        );
        expect(wide, "wider than a 320px screen").toEqual([]);
        const { violations } = await new AxeBuilder({ page })
            .include("main")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
            .analyze();
        expect(
            violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target[0]).join(", ")}`),
        ).toEqual([]);
    });
}

test("the tutorials index, in English and in another language, and the site map list them", async ({
    page,
}) => {
    for (const path of ["/tutorials/", "/es-001/tutorials/", "/en-001/site-map/"]) {
        await page.goto(path);
        for (const { slug } of TUTORIALS)
            await expect(page.locator(`main a[href="/tutorials/${slug}/"]`)).toHaveCount(1);
    }
});
