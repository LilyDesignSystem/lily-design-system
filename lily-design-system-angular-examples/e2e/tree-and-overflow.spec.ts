import { test, expect } from "@playwright/test";

// On /demos/tree-and-overflow: a checkbox that reveals a panel, a menu that overflows, shortened text and a tree, with real
// keys, a real resize and real layout, on the prerendered page.
//
// What IS asserted: which items fit is measured by the browser; the shortened text fits; the full text stays; the arrow keys,
// and that they swap right to left.
// What is NOT asserted: styling, or how a screen reader announces any of it.

const url = "/demos/tree-and-overflow";

test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(url);
    await expect(page.locator(".navigation-menu-more-button")).toHaveAttribute(
        "aria-controls",
        /.+/,
    );
});

test("the prerendered page has every component's content and hydrates cleanly", async ({
    page,
    request,
}) => {
    const html = await (await request.get(url + "/")).text();
    expect(html).toContain('aria-label="Sections"');
    expect(html).toContain(">report-final-version-of-the-third-quarter-for-the-board.pdf</span>");
    expect(html).not.toContain("data-truncated");

    const problems: string[] = [];
    page.on("console", (m) => {
        if (m.type() === "error" && /NG0|hydrat/i.test(m.text())) problems.push(m.text());
    });
    await page.reload();
    await expect(page.locator(".navigation-menu-more-button")).toHaveAttribute(
        "aria-controls",
        /.+/,
    );
    expect(problems).toEqual([]);
});

test("accordion checkbox: Space and a click reveal the panel, and a form reset closes it", async ({
    page,
}) => {
    const box = page.getByRole("checkbox", { name: "Send me updates" });
    const topics = page.getByRole("textbox", { name: "Topics" });
    const state = page.getByTestId("accordion-state");
    await expect(topics).toBeHidden();

    await box.focus();
    await page.keyboard.press("Space");
    await expect(box).toBeChecked();
    await expect(box).toHaveAttribute("aria-expanded", "true");
    await expect(topics).toBeVisible();
    await expect(state).toHaveText("Updates: true");
    await expect(page.getByRole("region", { name: "Send me updates" })).toBeVisible();

    await page.getByRole("button", { name: "Reset" }).click();
    await expect(state).toHaveText("Updates: false");
    await expect(box).not.toBeChecked();
    await expect(topics).toBeHidden();

    await page.getByText("Send me updates").click();
    await expect(topics).toBeVisible();
});

test("navigation menu: items move into More when narrow, and back when wide", async ({ page }) => {
    const more = page.locator(".navigation-menu-more");
    const moved = page.locator(".navigation-menu-more-list > li");
    await expect(more).toBeHidden();
    await expect(moved).toHaveCount(0);

    await page.setViewportSize({ width: 420, height: 800 });
    await expect(more).toBeVisible();
    await expect(moved.first()).toBeAttached();
    const count = await moved.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(8);
    await expect(moved.last()).toHaveText("Support");
    const list = page.locator(".navigation-menu-list");
    const fits = await list.evaluate((el) => el.scrollWidth <= el.clientWidth + 1);
    expect(fits).toBe(true);

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(more).toBeHidden();
    await expect(moved).toHaveCount(0);
    await expect(page.locator(".navigation-menu-list > li:not(.navigation-menu-more)")).toHaveCount(
        8,
    );
});

test("navigation menu: More opens by key, Escape refocuses it, a click outside closes it", async ({
    page,
    browserName,
}) => {
    await page.setViewportSize({ width: 420, height: 800 });
    const button = page.getByRole("button", { name: "More" });
    await expect(button).toBeVisible();
    const list = page.locator(".navigation-menu-more-list");

    const below = page.getByText("After the menu");
    const before = (await below.boundingBox())!.y;

    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(list).toBeVisible();
    expect((await below.boundingBox())!.y).toBeGreaterThan(before);

    // Safari's default skips links on Tab; Option+Tab reaches them.
    await page.keyboard.press(browserName === "webkit" ? "Alt+Tab" : "Tab");
    await expect(list.locator("a").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(list).toBeHidden();
    await expect(button).toBeFocused();
    await expect(button).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("Space");
    await expect(list).toBeVisible();
    await page.getByRole("heading", { name: "Tree and overflow" }).click();
    await expect(list).toBeHidden();
});

test("navigation menu: a moved link is still the same link", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(page.locator(".navigation-menu-more-list li").first()).toBeAttached();
    await page.getByRole("button", { name: "More" }).click();
    const link = page.locator('.navigation-menu a[aria-current="page"]');
    await expect(link).toHaveText("Results");
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/#Results$/);
});

test("middle truncation: the text fits, keeps its ends, and re-measures on resize", async ({
    page,
}) => {
    const root = page.locator(".middle-truncation");
    const visual = page.locator(".middle-truncation-visual");
    const full = "report-final-version-of-the-third-quarter-for-the-board.pdf";
    await page.setViewportSize({ width: 320, height: 800 });
    await expect(root).toHaveAttribute("data-truncated", "");
    await expect(root).toHaveAttribute("data-strategy", "min-end");

    const narrow = (await visual.textContent())!;
    expect(narrow).toContain("…");
    expect(narrow.length).toBeLessThan(full.length);
    expect(narrow.startsWith("report")).toBe(true);
    expect(narrow.endsWith(".pdf")).toBe(true);
    const fits = await root.evaluate((el) => {
        const span = el.querySelector(".middle-truncation-visual") as HTMLElement;
        return span.getBoundingClientRect().width <= el.clientWidth + 1;
    });
    expect(fits).toBe(true);
    await expect(page.locator(".middle-truncation-full")).toHaveText(full);
    await expect(visual).toHaveAttribute("aria-hidden", "true");

    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(visual).toHaveText(full);
    await expect(root).not.toHaveAttribute("data-truncated", "");
});

test("tree list item: the arrow keys expand, enter, leave and collapse", async ({ page }) => {
    const parent = page.getByRole("treeitem", { name: "Documents" });
    const child = page.getByRole("treeitem", { name: "Budget" });
    await parent.focus();
    await expect(parent).toHaveAttribute("aria-expanded", "false");
    await expect(child).toBeHidden();

    await page.keyboard.press("ArrowRight");
    await expect(parent).toHaveAttribute("aria-expanded", "true");
    await expect(child).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(child).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(parent).toBeFocused();
    await expect(parent).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(parent).toHaveAttribute("aria-expanded", "false");
    await expect(child).toBeHidden();

    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("treeitem", { name: "Music" })).toBeFocused();
    await expect(page.getByRole("treeitem", { name: "Music" })).not.toHaveAttribute(
        "aria-expanded",
        /.*/,
    );
});

test("tree list item: the keys swap right to left", async ({ page }) => {
    const branch = page.getByRole("treeitem", { name: "Branch" });
    await branch.focus();
    await page.keyboard.press("ArrowRight");
    await expect(branch).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("ArrowLeft");
    await expect(branch).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("treeitem", { name: "Leaf" })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(branch).toBeFocused();
});
