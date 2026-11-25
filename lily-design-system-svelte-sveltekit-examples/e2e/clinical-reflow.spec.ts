import { test, expect } from "@playwright/test";

// No clinical page scrolls sideways, and none breaks a word or a number across lines (tasks.md P49-T18). In November 2026 five of
// these pages scrolled sideways at 320px, and the flow board showed 09:00 as "09:0" over "0" at every width.

const ROUTES = [
    "/find-patient",
    "/flow-board",
    "/handover",
    "/medicines-administration",
    "/observations-chart",
    "/patient-banner",
    "/patient-dashboard",
    "/results-inbox",
    "/ward-board",
];

for (const route of ROUTES)
    for (const width of [320, 768, 1280])
        test(`${route} at ${width}px: no sideways scroll, no broken word or number`, async ({
            page,
        }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto(route);
            const main = page.locator("main");
            await expect(main).toBeVisible();
            const found = await main.evaluate((root) => {
                const broken: string[] = [];
                let runs = 0;
                const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                for (let node = walker.nextNode(); node; node = walker.nextNode())
                    // A run of letters or digits, with . : or , inside it: one that is laid out on two lines is broken.
                    for (const match of (node.textContent ?? "").matchAll(
                        /[\p{L}\p{N}]+(?:[.:,]\p{N}+)*/gu,
                    )) {
                        const range = document.createRange();
                        range.setStart(node, match.index);
                        range.setEnd(node, match.index + match[0].length);
                        const lines = new Set(
                            [...range.getClientRects()]
                                .filter((box) => box.width > 0)
                                .map((box) => Math.round(box.top)),
                        );
                        if (lines.size > 0) runs += 1;
                        if (lines.size > 1) broken.push(match[0]);
                    }
                const wide = [...document.querySelectorAll("body *")]
                    .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
                    .filter((el) => !el.closest(".horizontal-scroller"))
                    .map((el) => `${el.tagName.toLowerCase()}.${el.className}`);
                return {
                    wide,
                    broken,
                    runs,
                    over: document.documentElement.scrollWidth - window.innerWidth,
                };
            });
            expect(found.runs).toBeGreaterThan(20);
            expect(found.broken).toEqual([]);
            expect(found.over, found.wide.join(", ")).toBeLessThanOrEqual(0);
        });

test("a long patient name does not widen the handover, and is written out in full", async ({
    page,
}) => {
    // A browser's select is as wide as its longest option, and a fieldset does not shrink below it: on Linux's wider fonts the
    // page was 43px too wide in WebKit, and with this name 141px in WebKit and 205px in Firefox. Chromium hid it.
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("/handover");
    const patient = page.getByLabel("Patient", { exact: true });
    await expect(patient).toBeEnabled();
    await patient.evaluate((select: HTMLSelectElement) => {
        select.options[0].textContent =
            "MONTGOMERY-FITZWILLIAM, Alexandra Bartholomew-Josephine (born 3 Feb 1949)";
    });
    expect(
        await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
    ).toBeLessThanOrEqual(0);
    await patient.selectOption({ index: 1 });
    await expect(page.locator(".handover-patient")).toHaveText(
        "This handover is for: Example, Alexis (born 3 Feb 1979)",
    );
});

test("a wide clinical table scrolls by keyboard in its own named region", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    for (const [route, name] of [
        ["/flow-board", "Today's appointments"],
        ["/results-inbox", "Results waiting for review"],
        ["/patient-dashboard", "Vital signs trend"],
        ["/ward-board", "Beds on Ward 7"],
    ]) {
        await page.goto(route);
        const region = page.getByRole("region", { name });
        await region.focus();
        await expect(region).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
    }
});
