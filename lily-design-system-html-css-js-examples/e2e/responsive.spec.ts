import { test, expect } from "@playwright/test";

// Responsive design smoke check across the HTML + CSS + JS examples app.
// See the SvelteKit examples app's responsive.spec.ts for the rationale
// — this file mirrors that pattern for the static-HTML route shape.
// Static-file paths in this app are flat `.html` files (not directory
// index files), so composed pages are served as /{slug}.html — a
// trailing-slash directory URL 404s to an empty document under the
// `http-server` config the webServer uses (same fix already applied in
// e2e/accessibility.spec.ts's composedPages list). Component-detail
// pages are served as /components/component.html?slug={slug}.
//
// Loads a representative set of routes at 4 viewport sizes (mobile,
// tablet, desktop, 4K) and asserts:
//   - No horizontal overflow (page width fits the viewport).
//   - The skip-link is reachable in the tab order.
//   - The main landmark and the page H1 are visible.

const viewports = [
    { name: "mobile  ", width: 375, height: 667 }, // iPhone SE
    { name: "tablet  ", width: 768, height: 1024 }, // iPad portrait
    { name: "desktop ", width: 1280, height: 800 }, // laptop
    { name: "4K      ", width: 2560, height: 1440 }, // 27" 1440p
];

const routes = [
    "/",
    "/components/",
    "/components/component.html?slug=button",
    "/components/component.html?slug=data-table",
    "/components/component.html?slug=grail-layout",
    "/contact-form.html",
    "/dashboard.html",
    "/logo-slot.html",
    "/page-layout.html",
    "/task-management.html",
    "/timeline-and-cards.html",
];

async function expectNoHorizontalOverflow(page: import("@playwright/test").Page, label: string) {
    const overflow = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
    }));
    if (overflow.documentWidth > overflow.viewportWidth + 2) {
        throw new Error(
            `horizontal overflow on ${label}: documentWidth=${overflow.documentWidth} > viewportWidth=${overflow.viewportWidth}`,
        );
    }
}

for (const vp of viewports) {
    test.describe(`responsive: ${vp.name.trim()} (${vp.width}x${vp.height})`, () => {
        test.use({ viewport: { width: vp.width, height: vp.height } });

        for (const route of routes) {
            test(route, async ({ page }) => {
                await page.goto(route);
                await expect(
                    page.getByRole("link", { name: /skip to main content/i }),
                ).toBeAttached();
                await expect(page.getByRole("main").first()).toBeVisible();
                await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
                await expectNoHorizontalOverflow(page, `${vp.name}${route}`);
            });
        }
    });
}

// ---------------------------------------------------------------------------
// P15-T8: reflow (WCAG 1.4.10), 400% zoom (1.4.4), long unbroken strings
// (P15-T6) and grail-layout DOM order == visual order (P15-T7).
//
// What IS asserted:
//   - reflow 320: at 320x256 CSS px the sweep routes have a skip-link, a
//     visible <main> and H1, and no document-level horizontal scroll.
//   - zoom 400: the same at an EMULATED 400% zoom (see below).
//   - long string: a 60-character unbroken string injected into a summary-list
//     and a data-table inside <main> at 320px causes no document-level
//     horizontal scroll (it may wrap, or scroll inside its own region).
//   - grail order: at 320 / 768 / 1280 px the grail-layout regions' DOM order is
//     header, left aside, main, right aside, footer, and each region is not
//     visually before the one preceding it (below it, or in the same row to its
//     right; side-by-side regions count as ordered left to right).
// What is NOT asserted:
//   - Playwright cannot set browser zoom. 400% of 1280 px is 320 CSS px, so
//     the zoom case is a 320 CSS px viewport with deviceScaleFactor 4 (256 px
//     high, 1024/4). That reproduces the reflow layout, not the browser's zoom
//     UI, and it does NOT detect clipped or overlapping text: only
//     document-level overflow and a still-visible H1 are checked.
//   - Content scrolling inside its own region is allowed (1.4.10 exception).
//   - The grail order case is skipped where no .grail-layout is rendered.
// ---------------------------------------------------------------------------

const reflowRoutes = routes;
const grailRoute = "/components/component.html?slug=grail-layout";
const LONG_STRING = "Abcdefghij".repeat(6); // 60 characters, no break opportunity

async function expectReflowAssertions(
    page: import("@playwright/test").Page,
    route: string,
    label: string,
) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: /skip to main content/i })).toBeAttached();
    await expect(page.getByRole("main").first()).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expectNoHorizontalOverflow(page, `${label}${route}`);
}

test.describe("responsive: reflow 320 (320x256, WCAG 1.4.10)", () => {
    test.use({ viewport: { width: 320, height: 256 } });
    for (const route of reflowRoutes) {
        test(route, async ({ page }) => {
            await expectReflowAssertions(page, route, "reflow-320");
        });
    }
});

test.describe("responsive: 400% zoom emulation (320x256 at deviceScaleFactor 4, WCAG 1.4.4)", () => {
    test.use({ viewport: { width: 320, height: 256 }, deviceScaleFactor: 4 });
    for (const route of reflowRoutes) {
        test(route, async ({ page }) => {
            await expectReflowAssertions(page, route, "zoom-400");
        });
    }
});

test.describe("responsive: 60-character unbroken string at 320px (P15-T6)", () => {
    test.use({ viewport: { width: 320, height: 568 } });
    for (const route of [reflowRoutes[0], grailRoute]) {
        test(`summary-list and data-table on ${route}`, async ({ page }) => {
            await page.goto(route);
            // Let a client framework hydrate first, or it replaces the injected fixture.
            await page.waitForLoadState("networkidle");
            await page.evaluate((text) => {
                const host = document.querySelector("main") ?? document.body;
                const wrap = document.createElement("div");
                wrap.setAttribute("data-test-fixture", "long-string");
                wrap.innerHTML =
                    '<ol class="summary-list"><li class="summary-list-item"><span>Reference</span> <strong>' +
                    text +
                    "</strong></li></ol>" +
                    '<table class="data-table" aria-label="Long string"><thead class="data-table-head"><tr class="data-table-row"><th class="data-table-th">Name</th><th class="data-table-th">Value</th></tr></thead>' +
                    '<tbody class="data-table-body"><tr class="data-table-row"><td class="data-table-td">' +
                    text +
                    '</td><td class="data-table-td">' +
                    text +
                    "</td></tr></tbody></table>";
                host.prepend(wrap);
            }, LONG_STRING);
            await expect(page.locator("[data-test-fixture] .summary-list")).toBeVisible();
            await expectNoHorizontalOverflow(page, `long-string${route}`);
        });
    }
});

// P15-T7: DOM order must equal visual order, so keyboard and screen reader
// order matches what sighted users see (WCAG 1.3.2, 2.4.3).
for (const width of [320, 768, 1280]) {
    test.describe(`responsive: grail-layout order at ${width}px`, () => {
        test.use({ viewport: { width, height: 800 } });
        test(`DOM order equals visual order on ${grailRoute}`, async ({ page }) => {
            await page.goto(grailRoute);
            const found = await page.locator(".grail-layout").count();
            test.skip(found === 0, `no .grail-layout rendered on ${grailRoute} in this app`);
            const regions = await page.evaluate(() => {
                const names = [
                    "grail-layout-top-header",
                    "grail-layout-left-aside",
                    "grail-layout-center-main",
                    "grail-layout-right-aside",
                    "grail-layout-bottom-footer",
                ];
                const root = document.querySelector(".grail-layout")!;
                const els = names.flatMap((n) =>
                    Array.from(root.querySelectorAll("." + n)).slice(0, 1),
                );
                // document order, independent of the order of `names`
                els.sort((x, y) =>
                    x.compareDocumentPosition(y) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
                );
                return els.map((el) => {
                    const r = el.getBoundingClientRect();
                    return {
                        cls: names.find((n) => el.classList.contains(n)) as string,
                        top: r.top,
                        bottom: r.bottom,
                        left: r.left,
                        right: r.right,
                    };
                });
            });
            expect(regions.map((r) => r.cls)).toEqual([
                "grail-layout-top-header",
                "grail-layout-left-aside",
                "grail-layout-center-main",
                "grail-layout-right-aside",
                "grail-layout-bottom-footer",
            ]);
            for (let i = 1; i < regions.length; i++) {
                const a = regions[i - 1];
                const b = regions[i];
                const below = b.top >= a.bottom - 1;
                const sameRowToRight = b.top < a.bottom - 1 && b.left >= a.right - 1;
                expect(
                    below || sameRowToRight,
                    `${b.cls} is visually before ${a.cls} at ${width}px: ` +
                        JSON.stringify({ a, b }),
                ).toBe(true);
            }
        });
    });
}

// ---------------------------------------------------------------------------
// DHCW lessons item 6: text expansion. Welsh (lang="cy") labels run 20 to 30
// percent longer than English, so a layout that only fits English will clip
// or overflow. We cannot translate every route, so a pseudo-locale lengthens
// every visible text node by 30 percent (each word grows by 30 percent, rounded
// up, with a suffix of letters; words stay breakable at spaces), after setting document.documentElement.lang = "cy".
//
// Asserted, at 320 CSS px wide, on every reflow-320 route:
//   1. no document-level horizontal scroll (expectNoHorizontalOverflow);
//   2. no CLIPPED label: no element with computed overflow-x or overflow-y of
//      hidden or clip, and non-empty text, whose scrollWidth exceeds its
//      clientWidth by more than 1px. Excluded: elements that deliberately
//      truncate (text-overflow: ellipsis, and .middle-truncation*), and
//      elements with a clientWidth of 1px or less (visually-hidden text).
// NOT asserted: clipping or overflow inside scroll containers
//   (overflow auto or scroll), which keep the content reachable; text nodes
//   inside script, style, code, pre, svg and .avatar (initials are names, not
//   translatable labels; left unchanged); vertical clipping;
//   overlap between elements; wording or truncation quality of real Welsh.
// ---------------------------------------------------------------------------

test.describe('responsive: 30% text expansion with lang="cy" at 320px', () => {
    test.use({ viewport: { width: 320, height: 568 } });
    for (const route of reflowRoutes) {
        test(route, async ({ page }) => {
            await page.goto(route);
            // Let a client framework hydrate first, or it replaces the expanded nodes.
            await page.waitForLoadState("networkidle");
            const clipped = await page.evaluate(() => {
                document.documentElement.lang = "cy";
                const skip = "script, style, code, pre, svg, .avatar";
                const roots = document.querySelectorAll("main, header, footer");
                const seen = new Set<Node>();
                for (const root of Array.from(roots)) {
                    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
                    let node = walker.nextNode();
                    while (node) {
                        const parent = node.parentElement;
                        const text = node.nodeValue ?? "";
                        if (!seen.has(node) && parent && !parent.closest(skip) && text.trim()) {
                            seen.add(node);
                            // Lengthen each word by 30 percent (rounded up), as Welsh words are longer;
                            // gluing all the extra letters to the last word would build one unbreakable
                            // word, which no translation does.
                            node.nodeValue = text.replace(
                                /\S+/g,
                                (word) =>
                                    word +
                                    "abcdefghi".repeat(4).slice(0, Math.ceil(word.length * 0.3)),
                            );
                        }
                        node = walker.nextNode();
                    }
                }
                const offenders: string[] = [];
                for (const el of Array.from(document.body.querySelectorAll("*"))) {
                    if (el.closest("[class*='middle-truncation']")) continue;
                    if (el.closest("script, style, svg")) continue;
                    if (!el.textContent?.trim()) continue;
                    const style = getComputedStyle(el);
                    const hidden = (v: string) => v === "hidden" || v === "clip";
                    if (!hidden(style.overflowX) && !hidden(style.overflowY)) continue;
                    if (style.textOverflow === "ellipsis") continue;
                    if (el.clientWidth <= 1) continue;
                    if (el.scrollWidth > el.clientWidth + 1) {
                        const cls = (el.getAttribute("class") ?? "")
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean)
                            .join(".");
                        offenders.push(
                            `${el.tagName.toLowerCase()}${cls ? "." + cls : ""} scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}`,
                        );
                    }
                }
                return offenders;
            });
            await expectNoHorizontalOverflow(page, `text-expansion-cy${route}`);
            expect(clipped, `clipped labels on ${route}:\n${clipped.join("\n")}`).toEqual([]);
        });
    }
});
