import { test, expect, type Page } from "@playwright/test";

// Real keys on the real macros, in Chromium, Firefox and WebKit, for the Lily Core candidates. These pages render the
// catalog's macros and load its behaviour scripts, so this is what a consumer gets. bin/generate-core counts a spec by the
// route or class hook it names, so each route is written out in full.
// What it does NOT prove: what a screen reader announces. That is docs/screen-reader-matrix.md.

// Firefox and WebKit on macOS skip links and some controls on Tab by default, so focus starts on an element's neighbour
// with .focus() where a test is about the element's own keys, not about tab order.
const open = (page: Page, route: string) => page.goto(route);

// WebKit on macOS moves Tab between text fields only unless Option is held, as Safari does by default.
const tabKey = (browserName: string) =>
    browserName === "webkit" && process.platform === "darwin" ? "Alt+Tab" : "Tab";

test.describe("named form controls take keys", () => {
    const inputs: [string, string, string, string][] = [
        ["/components/text-input/", ".text-input", "Full name", "Ada"],
        ["/components/email-input/", ".email-input", "Email address", "a@b.org"],
        ["/components/password-input/", ".password-input", "Password", "secret"],
        ["/components/number-input/", ".number-input", "Age in years", "42"],
        ["/components/text-area-input/", ".text-area-input", "How did we do?", "Good"],
    ];
    for (const [route, hook, name, typed] of inputs) {
        test(`${hook}: its label names it, and it takes typing`, async ({ page }) => {
            await open(page, route);
            const field = page.locator(hook).first();
            await expect(field).toHaveAccessibleName(name);
            await field.focus();
            await page.keyboard.type(typed);
            await expect(field).toHaveValue(typed);
        });
    }

    test(".date-input: its label names it, and it holds a date", async ({ page }) => {
        await open(page, "/components/date-input/");
        const field = page.locator(".date-input").first();
        await expect(field).toHaveAccessibleName("Date of birth");
        await field.fill("2000-02-29");
        await expect(field).toHaveValue("2000-02-29");
    });

    test(".select: its label names it, and a value can be chosen", async ({ page }) => {
        await open(page, "/components/select/");
        const field = page.locator(".select").first();
        await expect(field).toHaveAccessibleName("Country");
        await expect(field).toHaveValue("gb");
        await field.selectOption("ie");
        await expect(field).toHaveValue("ie");
    });

    test(".checkbox-input: Space toggles it", async ({ page }) => {
        await open(page, "/components/checkbox-input/");
        const box = page.locator(".checkbox-input").first();
        await expect(box).toHaveAccessibleName("I accept the terms and conditions");
        await box.focus();
        await page.keyboard.press("Space");
        await expect(box).toBeChecked();
        await page.keyboard.press("Space");
        await expect(box).not.toBeChecked();
    });

    test(".radio-input: Space selects it", async ({ page }) => {
        await open(page, "/components/radio-input/");
        const radio = page.locator(".radio-input").first();
        await expect(radio).toHaveAccessibleName("Yes");
        await radio.focus();
        await page.keyboard.press("Space");
        await expect(radio).toBeChecked();
    });

    test(".button: Enter and Space activate it", async ({ page }) => {
        await open(page, "/components/button/");
        const button = page.locator(".button").first();
        await expect(button).toHaveAccessibleName("Save");
        await button.evaluate((el) => {
            (window as unknown as { clicks: number }).clicks = 0;
            el.addEventListener("click", () => (window as unknown as { clicks: number }).clicks++);
        });
        await button.focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Space");
        expect(await page.evaluate(() => (window as unknown as { clicks: number }).clicks)).toBe(2);
    });
});

test.describe("groups and structure", () => {
    test(".form: a labelled landmark, submitted with Enter", async ({ page }) => {
        await open(page, "/components/form/");
        const form = page.locator(".form").first();
        await expect(form).toHaveRole("form");
        await expect(form).toHaveAccessibleName("Contact");
        await form.evaluate((el) =>
            el.addEventListener("submit", (e) => {
                e.preventDefault();
                el.setAttribute("data-submitted", "yes");
            }),
        );
        await form.locator("input").focus();
        await page.keyboard.press("Enter");
        await expect(form).toHaveAttribute("data-submitted", "yes");
    });

    test(".field and .hint: the hint describes the input", async ({ page }) => {
        await open(page, "/components/field/");
        const field = page.locator(".field").first();
        await expect(field).toHaveAttribute("data-state", "valid");
        await expect(field.locator("input")).toHaveAccessibleName("Full name");
        await expect(field.locator("input")).toHaveAccessibleDescription(
            "As it appears on your passport.",
        );
    });

    test(".hint: the input names it as its description", async ({ page }) => {
        await open(page, "/components/hint/");
        await expect(page.getByLabel("NHS number").first()).toHaveAccessibleDescription(
            /It is a 10-digit number/,
        );
    });

    test(".label: a click on it moves focus to its input", async ({ page }) => {
        await open(page, "/components/label/");
        await page.locator(".label").first().click();
        await expect(page.locator("#fullname")).toBeFocused();
    });

    test(".fieldset: the legend names the group", async ({ page }) => {
        await open(page, "/components/fieldset/");
        const set = page.locator(".fieldset").first();
        await expect(set).toHaveRole("group");
        await expect(set).toHaveAccessibleName("What is your home address?");
    });

    test(".checkbox-group: a named group, and Tab moves between its boxes", async ({
        page,
        browserName,
    }) => {
        await open(page, "/components/checkbox-group/");
        const group = page.locator(".checkbox-group").first();
        await expect(group).toHaveRole("group");
        await expect(group).toHaveAccessibleName("Conditions");
        const boxes = group.locator(".checkbox-input");
        await boxes.first().focus();
        await page.keyboard.press(tabKey(browserName));
        await expect(boxes.nth(1)).toBeFocused();
    });

    test(".radio-group: a named group, and the arrows walk its radios", async ({ page }) => {
        await open(page, "/components/radio-group/");
        const group = page.locator(".radio-group").first();
        await expect(group).toHaveRole("radiogroup");
        await expect(group).toHaveAccessibleName("Where do you live?");
        const radios = group.locator(".radio-input");
        await radios.first().focus();
        await page.keyboard.press("Space");
        await page.keyboard.press("ArrowDown");
        await expect(radios.nth(1)).toBeFocused();
        await expect(radios.nth(1)).toBeChecked();
    });

    test(".error-message: an alert", async ({ page }) => {
        await open(page, "/components/error-message/");
        await expect(page.locator(".error-message").first()).toHaveRole("alert");
        await expect(page.locator(".error-message").first()).toContainText("Enter your NHS number");
    });

    test(".error-summary: an alert that takes focus, with a named link for each error", async ({
        page,
        browserName,
    }) => {
        await open(page, "/components/error-summary/");
        const summary = page.locator(".error-summary").first();
        await expect(summary).toHaveRole("alert");
        await expect(summary).toHaveAccessibleName("There is a problem");
        await summary.focus();
        await expect(summary).toBeFocused();
        const links = summary.locator("a");
        for (const link of await links.all()) await expect(link).not.toHaveAccessibleName("");
        await page.keyboard.press(tabKey(browserName));
        await expect(links.first()).toBeFocused();
    });

    test(".data-table: a caption and column headers", async ({ page }) => {
        await open(page, "/components/data-table/");
        const table = page.locator(".data-table").first();
        await expect(table).toHaveAccessibleName("Your upcoming appointments");
        await expect(table.getByRole("columnheader", { name: "Date" })).toBeVisible();
    });

    test(".skip-link: first on the page, and it moves focus to the main content", async ({
        page,
    }) => {
        await open(page, "/components/skip-link/");
        const link = page.locator(".skip-link").first();
        await link.focus();
        await page.keyboard.press("Enter");
        await expect(page.locator("#main-content")).toBeFocused();
    });

    for (const [route, hook, name] of [
        ["/components/breadcrumb-nav/", ".breadcrumb-nav", "Breadcrumb"],
        ["/components/pagination-nav/", ".pagination-nav", "Pagination"],
    ]) {
        test(`${hook}: a named landmark, with links that Tab reaches`, async ({
            page,
            browserName,
        }) => {
            await open(page, route);
            const nav = page.locator(`main ${hook}`).first();
            await expect(nav).toHaveRole("navigation");
            await expect(nav).toHaveAccessibleName(name);
            const first = nav.locator("a").first();
            await first.focus();
            await page.keyboard.press(tabKey(browserName));
            await expect(nav.locator("a").nth(1)).toBeFocused();
        });
    }

    test(".accordion-nav: a named landmark, and Enter toggles a section", async ({ page }) => {
        await open(page, "/components/accordion-nav/");
        const nav = page.locator(".accordion-nav").first();
        await expect(nav).toHaveRole("navigation");
        await expect(nav).toHaveAccessibleName("Health A to Z");
        const details = nav.locator("details").first();
        await expect(details).toHaveAttribute("open", "");
        await details.locator("summary").focus();
        await page.keyboard.press("Enter");
        await expect(details).not.toHaveAttribute("open", "");
    });
});

test.describe("dialogs", () => {
    for (const [route, hook, opener, role] of [
        ["/components/dialog/", ".dialog", "Open confirm dialog", "dialog"],
        ["/components/alert-dialog/", ".alert-dialog", "Delete patient record", "alertdialog"],
    ]) {
        test(`${hook}: modal, and Escape closes it and returns focus`, async ({ page }) => {
            await open(page, route);
            const button = page.getByRole("button", { name: opener });
            await button.focus();
            await page.keyboard.press("Enter");
            const dialog = page.locator(hook).first();
            await expect(dialog).toBeVisible();
            await expect(dialog).toHaveRole(role);
            expect(await dialog.evaluate((el) => el.matches(":modal"))).toBe(true);
            await page.keyboard.press("Escape");
            await expect(dialog).toBeHidden();
            await expect(button).toBeFocused();
        });
    }
});

test.describe("composite widgets", () => {
    test(".tab-bar: the arrows move focus, Enter selects, with one tab stop", async ({ page }) => {
        await open(page, "/components/tab-bar/");
        const tabs = page.locator(".tab-bar").first().getByRole("tab");
        await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
        await expect(tabs.nth(1)).toHaveAttribute("tabindex", "-1");
        await tabs.first().focus();
        await page.keyboard.press("ArrowRight");
        await expect(tabs.nth(1)).toBeFocused();
        await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
        await page.keyboard.press("Enter");
        await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
        await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
        await page.keyboard.press("Home");
        await expect(tabs.first()).toBeFocused();
    });

    test(".tab-bar-button: a disabled tab is skipped", async ({ page }) => {
        await open(page, "/components/tab-bar-button/");
        const tabs = page.locator(".tab-bar-button");
        await tabs.first().focus();
        await page.keyboard.press("ArrowRight");
        await expect(tabs.nth(1)).toBeFocused();
        await page.keyboard.press("ArrowRight");
        await expect(tabs.first()).toBeFocused();
    });

    test(".tab-panel: names itself from its tab, and only the shown one is exposed", async ({
        page,
    }) => {
        await open(page, "/components/tab-panel/");
        const shown = page.locator(".tab-panel").first();
        await expect(shown).toHaveRole("tabpanel");
        await expect(shown).toHaveAccessibleName("Overview");
        await expect(shown).toHaveAttribute("tabindex", "0");
        await expect(page.locator(".tab-panel").nth(1)).toBeHidden();
    });

    test(".menu: the arrows walk its items, and End and Home jump", async ({ page }) => {
        await open(page, "/components/menu/");
        const menu = page.locator(".menu").first();
        await expect(menu).toHaveRole("menu");
        await expect(menu).toHaveAccessibleName("File");
        const items = menu.getByRole("menuitem");
        await items.first().focus();
        await page.keyboard.press("ArrowDown");
        await expect(items.nth(1)).toBeFocused();
        await page.keyboard.press("End");
        await expect(items.last()).toBeFocused();
        await page.keyboard.press("Home");
        await expect(items.first()).toBeFocused();
    });

    test(".menu-bar: the arrows walk its items, sideways", async ({ page }) => {
        await open(page, "/components/menu-bar/");
        const bar = page.locator(".menu-bar").first();
        await expect(bar).toHaveRole("menubar");
        const items = bar.getByRole("menuitem");
        await items.first().focus();
        await page.keyboard.press("ArrowRight");
        await expect(items.nth(1)).toBeFocused();
    });

    test(".dropdown-menu: opens as a popover, the arrows walk it, Escape closes it", async ({
        page,
    }) => {
        await open(page, "/components/dropdown-menu/");
        const button = page.getByRole("button", { name: "Actions" });
        const menu = page.locator(".dropdown-menu").first();
        await expect(menu).toBeHidden();
        await button.focus();
        await page.keyboard.press("Enter");
        await expect(menu).toBeVisible();
        await expect(menu).toHaveRole("menu");
        const items = menu.getByRole("menuitem");
        await items.first().focus();
        await page.keyboard.press("ArrowDown");
        await expect(items.nth(1)).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(menu).toBeHidden();
    });

    test(".context-menu: a named menu, and the arrows walk it", async ({ page }) => {
        await open(page, "/components/context-menu/");
        const menu = page.locator(".context-menu").first();
        await expect(menu).toHaveRole("menu");
        await expect(menu).toHaveAccessibleName("Record actions");
        const items = menu.getByRole("menuitem");
        await items.first().focus();
        await page.keyboard.press("ArrowDown");
        await expect(items.nth(1)).toBeFocused();
    });

    test(".tree-nav: one tab stop, and the arrow keys move and fold", async ({ page }) => {
        await open(page, "/components/tree-nav/");
        const tree = page.locator(".tree-nav").first().getByRole("tree");
        await expect(tree).toHaveAccessibleName("Services");
        const items = tree.getByRole("treeitem");
        const first = items.first();
        await expect(first).toHaveAttribute("tabindex", "0");
        await expect(first).toHaveAttribute("aria-expanded", "true");
        await first.focus();
        await page.keyboard.press("ArrowDown");
        await expect(items.nth(1)).toBeFocused();
        await page.keyboard.press("ArrowUp");
        await expect(first).toBeFocused();
        await page.keyboard.press("ArrowLeft");
        await expect(first).toHaveAttribute("aria-expanded", "false");
        await page.keyboard.press("ArrowRight");
        await expect(first).toHaveAttribute("aria-expanded", "true");
    });

    test(".net-promoter-score-picker: a named radio group that a keyboard can reach", async ({
        page,
    }) => {
        await open(page, "/components/net-promoter-score-picker/");
        const group = page.locator(".net-promoter-score-picker").first();
        await expect(group).toHaveRole("radiogroup");
        await expect(group).toHaveAccessibleName(/How likely are you to recommend us/);
        const radios = group.getByRole("radio");
        await expect(radios).toHaveCount(11);
        // Native radios: the browser's keys, from the checked one (8).
        const checked = group.getByRole("radio", { checked: true });
        await expect(checked).toHaveCount(1);
        await checked.focus();
        await page.keyboard.press("ArrowRight");
        await expect(radios.nth(9)).toBeChecked();
    });
});

test.describe("helper pickers", () => {
    test("share-picker: opens with Enter, the arrows walk its links, Escape returns focus", async ({
        page,
    }) => {
        await open(page, "/pickers/");
        const button = page.locator(".share-picker-button");
        await expect(button).toHaveAccessibleName("Share this page");
        await expect(button).toHaveAttribute("aria-expanded", "false");
        await button.focus();
        await page.keyboard.press("Enter");
        await expect(button).toHaveAttribute("aria-expanded", "true");
        const links = page.locator(".share-picker-target");
        await expect(links.first()).toBeVisible();
        await expect(links.first()).toHaveRole("link");
        await expect(links.first()).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(links.nth(1)).toBeFocused();
        await page.keyboard.press("Escape");
        await expect(button).toHaveAttribute("aria-expanded", "false");
        await expect(button).toBeFocused();
    });

    test("date-time-picker: a typeable field and a dialog of days, driven by keys", async ({
        page,
    }) => {
        await open(page, "/pickers/");
        const field = page.locator(".date-time-picker-input");
        await expect(field).toHaveAccessibleName("Appointment date");
        const button = page.locator(".date-time-picker-button");
        await expect(button).toHaveAttribute("aria-expanded", "false");
        await button.focus();
        await page.keyboard.press("Enter");
        const dialog = page.getByRole("dialog", { name: "Choose an appointment date" });
        await expect(dialog).toBeVisible();
        const day = dialog.locator('[tabindex="0"]').first();
        await expect(day).toBeFocused();
        const before = await day.getAttribute("data-date");
        await page.keyboard.press("ArrowRight");
        await expect(dialog.locator('[tabindex="0"]').first()).not.toHaveAttribute(
            "data-date",
            before ?? "",
        );
        await page.keyboard.press("Escape");
        await expect(dialog).toBeHidden();
        await expect(button).toBeFocused();
    });
});
