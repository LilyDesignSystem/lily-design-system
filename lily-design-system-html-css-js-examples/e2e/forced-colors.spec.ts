import { test, expect, type Page } from "@playwright/test";

// P12-T13: under forced colours (Windows High Contrast) the themes' shared section keeps a
// visible focus ring, gives controls a border, and marks the selected option with a system
// colour instead of a tint. Chromium emulates `forced-colors: active` with `forcedColors`.
test.use({ forcedColors: "active" });

async function ready(page: Page, path: string) {
    await page.goto(path);
    await page.waitForFunction(() => {
        const link = document.querySelector(
            "link[data-lily-theme-picker]",
        ) as HTMLLinkElement | null;
        return link !== null && link.sheet !== null;
    });
    await page.waitForTimeout(300);
}

test("forced colours are active in the emulation", async ({ page }) => {
    await ready(page, "/contact-form.html");
    expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
});

test("a keyboard-focused field keeps a 3px solid outline in the Highlight colour", async ({
    page,
}) => {
    await ready(page, "/contact-form.html");
    for (let i = 0; i < 40; i++) {
        await page.keyboard.press("Tab");
        if (await page.evaluate(() => document.activeElement?.tagName === "INPUT")) break;
    }
    const got = await page.evaluate(() => {
        const cs = getComputedStyle(document.activeElement!);
        const probe = document.createElement("div");
        probe.style.color = "Highlight";
        document.body.appendChild(probe);
        const highlight = getComputedStyle(probe).color;
        probe.remove();
        return {
            tag: document.activeElement!.tagName,
            style: cs.outlineStyle,
            width: cs.outlineWidth,
            color: cs.outlineColor,
            highlight,
        };
    });
    expect(got.tag).toBe("INPUT");
    expect(got.style).toBe("solid");
    expect(got.width).toBe("3px");
    expect(got.color).toBe(got.highlight);
});

test("a button has a border that does not rely on its background", async ({ page }) => {
    await ready(page, "/contact-form.html");
    const border = await page
        .getByRole("button", { name: /send|submit/i })
        .first()
        .evaluate((b) => {
            const cs = getComputedStyle(b);
            return { style: cs.borderTopStyle, width: cs.borderTopWidth };
        });
    expect(border.style).toBe("solid");
    expect(parseFloat(border.width)).toBeGreaterThanOrEqual(1);
});

test("the selected theme option is drawn in the SelectedItem system colour", async ({ page }) => {
    await ready(page, "/contact-form.html");
    await page.getByRole("button", { name: "Choose a theme" }).click();
    const got = await page.evaluate(() => {
        const sel = document.querySelector('[role="option"][aria-selected="true"]')!;
        const probe = document.createElement("div");
        probe.style.backgroundColor = "SelectedItem";
        document.body.appendChild(probe);
        const systemColour = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return { background: getComputedStyle(sel).backgroundColor, systemColour };
    });
    expect(got.background).toBe(got.systemColour);
});
