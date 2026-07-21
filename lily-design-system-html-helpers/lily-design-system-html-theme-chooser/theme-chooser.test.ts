import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
    ThemeChooser,
    themeName,
    matchSystemTheme,
    normalizeThemesUrl,
    themeHref,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
} from "./theme-chooser.js";

// Ensure the custom element is registered exactly once for the suite.
if (typeof customElements !== "undefined" && !customElements.get("theme-chooser")) {
    customElements.define("theme-chooser", ThemeChooser);
}

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-chooser="${name}"]`,
    );
}

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function mount(attrs: Record<string, string>): ThemeChooser {
    const el = document.createElement("theme-chooser") as ThemeChooser;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

function button(): HTMLButtonElement {
    return document.body.querySelector<HTMLButtonElement>(".theme-chooser-button")!;
}

function list(): HTMLUListElement {
    return document.body.querySelector<HTMLUListElement>(".theme-chooser-list")!;
}

function options(): HTMLLIElement[] {
    return [...document.body.querySelectorAll<HTMLLIElement>(".theme-chooser-option")];
}

function press(el: Element, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

/** Open the listbox and click the option for `slug`. */
function pick(slug: string, themes: string[] = THEMES): void {
    click(button());
    click(options()[themes.indexOf(slug)]);
}

/**
 * jsdom does not implement `window.matchMedia`, so every test that
 * exercises system detection installs its own stub. Returns a restore
 * function; `null` installs no stub at all, which is the SSR / jsdom
 * shape `matchSystemTheme` has to survive.
 */
function stubMatchMedia(prefersDark: boolean | null): () => void {
    const had = Object.prototype.hasOwnProperty.call(window, "matchMedia");
    const original = (window as unknown as { matchMedia?: unknown }).matchMedia;
    const restore = () => {
        if (had) {
            (window as unknown as { matchMedia?: unknown }).matchMedia = original;
        } else {
            delete (window as unknown as { matchMedia?: unknown }).matchMedia;
        }
    };
    if (prefersDark === null) {
        delete (window as unknown as { matchMedia?: unknown }).matchMedia;
        return restore;
    }
    (window as unknown as { matchMedia: unknown }).matchMedia = (query: string) => ({
        matches: query.includes("prefers-color-scheme: dark") ? prefersDark : false,
        media: query,
        onchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent: () => false,
    });
    return restore;
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((n) => n.remove());
    document.body.replaceChildren();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.body.replaceChildren();
});

describe("<theme-chooser> — pure helpers", () => {
    test("normalizeThemesUrl keeps a trailing slash", () => {
        expect(normalizeThemesUrl("/a/")).toBe("/a/");
    });

    test("normalizeThemesUrl appends a missing trailing slash", () => {
        expect(normalizeThemesUrl("/a")).toBe("/a/");
    });

    test("themeHref builds the href", () => {
        expect(themeHref("/a", "light", ".css")).toBe("/a/light.css");
        expect(themeHref("/a/", "light", ".css")).toBe("/a/light.css");
    });

    // themeName is the exported mirror of locale-chooser's localeName.
    test("themeName title-cases a single-word slug", () => {
        expect(themeName("light")).toBe("Light");
    });

    test("themeName title-cases every hyphen-separated word", () => {
        expect(themeName("high-contrast")).toBe("High Contrast");
        expect(themeName("solarized-dark-soft")).toBe("Solarized Dark Soft");
    });

    test("themeName leaves an empty slug empty", () => {
        expect(themeName("")).toBe("");
    });
});

describe("<theme-chooser> — matchSystemTheme (mirrors matchNavigatorLanguage)", () => {
    test("resolves 'dark' when the OS prefers dark and dark is offered", () => {
        const restore = stubMatchMedia(true);
        try {
            expect(matchSystemTheme(["light", "dark"])).toBe("dark");
        } finally {
            restore();
        }
    });

    test("resolves 'light' when the OS does not prefer dark", () => {
        const restore = stubMatchMedia(false);
        try {
            expect(matchSystemTheme(["light", "dark"])).toBe("light");
        } finally {
            restore();
        }
    });

    test("returns '' when the preferred slug is not in themes", () => {
        const restoreDark = stubMatchMedia(true);
        try {
            // Prefers dark, but this catalog offers no "dark".
            expect(matchSystemTheme(["light", "abyss"])).toBe("");
        } finally {
            restoreDark();
        }
        const restoreLight = stubMatchMedia(false);
        try {
            expect(matchSystemTheme(["dark", "abyss"])).toBe("");
        } finally {
            restoreLight();
        }
    });

    test("returns '' when matchMedia is unavailable (SSR / jsdom)", () => {
        const restore = stubMatchMedia(null);
        try {
            expect(matchSystemTheme(["light", "dark"])).toBe("");
        } finally {
            restore();
        }
    });
});

describe("<theme-chooser> — detect-from-system attribute", () => {
    test("the detect-from-system attribute mirrors the detectFromSystem property", async () => {
        const el = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
        });
        await flush();
        expect(el.detectFromSystem).toBe(false);
        el.detectFromSystem = true;
        expect(el.hasAttribute("detect-from-system")).toBe(true);
        el.detectFromSystem = false;
        expect(el.hasAttribute("detect-from-system")).toBe(false);
        // Present-but-"false" reads as false, matching detect-from-navigator.
        el.setAttribute("detect-from-system", "false");
        expect(el.detectFromSystem).toBe(false);
        el.setAttribute("detect-from-system", "");
        expect(el.detectFromSystem).toBe(true);
    });

    test("detect-from-system resolves the initial theme from the OS preference", async () => {
        const restore = stubMatchMedia(true);
        try {
            const el = mount({
                label: "Theme",
                "themes-url": URL_TRAILING,
                themes: THEMES.join(","),
                "detect-from-system": "",
            });
            await flush();
            // Without detection this would resolve "light" (present in THEMES).
            expect(el.value).toBe("dark");
            expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
        } finally {
            restore();
        }
    });

    test("detection is off unless opted in", async () => {
        const restore = stubMatchMedia(true);
        try {
            const el = mount({
                label: "Theme",
                "themes-url": URL_TRAILING,
                themes: THEMES.join(","),
            });
            await flush();
            expect(el.value).toBe("light");
        } finally {
            restore();
        }
    });

    test("storage still beats detection", async () => {
        const restore = stubMatchMedia(true);
        try {
            localStorage.setItem("lily-theme", "abyss");
            const el = mount({
                label: "Theme",
                "themes-url": URL_TRAILING,
                themes: THEMES.join(","),
                "storage-key": "lily-theme",
                "detect-from-system": "",
            });
            await flush();
            expect(el.value).toBe("abyss");
        } finally {
            restore();
        }
    });

    test("an explicit value still beats detection", async () => {
        const restore = stubMatchMedia(true);
        try {
            const el = mount({
                label: "Theme",
                "themes-url": URL_TRAILING,
                themes: THEMES.join(","),
                "detect-from-system": "",
                value: "abyss",
            });
            await flush();
            expect(el.value).toBe("abyss");
        } finally {
            restore();
        }
    });

    test("detection falls through to default-value when the OS slug is absent", async () => {
        const restore = stubMatchMedia(true);
        try {
            // Prefers dark; this catalog has no "dark", so detection
            // returns "" and default-value takes over.
            const el = mount({
                label: "Theme",
                "themes-url": URL_TRAILING,
                themes: "abyss,sepia",
                "detect-from-system": "",
                "default-value": "sepia",
            });
            await flush();
            expect(el.value).toBe("sepia");
        } finally {
            restore();
        }
    });

    test("detection is a no-op when matchMedia is unavailable", async () => {
        const restore = stubMatchMedia(null);
        try {
            const el = mount({
                label: "Theme",
                "themes-url": URL_TRAILING,
                themes: THEMES.join(","),
                "detect-from-system": "",
            });
            await flush();
            expect(el.value).toBe("light");
        } finally {
            restore();
        }
    });
});

describe("<theme-chooser> — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a div root containing a button that controls a listbox", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        const root = document.body.querySelector("div.theme-chooser")!;
        expect(root.tagName).toBe("DIV");
        const btn = button();
        expect(btn.tagName).toBe("BUTTON");
        expect(btn.getAttribute("type")).toBe("button");
        expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
        expect(btn.getAttribute("aria-expanded")).toBe("false");
        const listId = btn.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
        expect(document.getElementById(listId!)).toBe(list());
    });

    test("§7.1 the button renders the half-circle glyph, hidden from assistive tech", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        const icon = document.body.querySelector<HTMLElement>(".theme-chooser-icon")!;
        // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
        expect(icon.textContent).toBe("◑");
        expect(CIRCLE_WITH_RIGHT_HALF_BLACK).toBe("◑");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.closest("button")).toBe(button());
    });

    test("§7.2 aria-label names the button and the listbox", async () => {
        mount({ label: "Choose theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        expect(button().getAttribute("aria-label")).toBe("Choose theme");
        expect(list().getAttribute("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one option per theme; the hidden input carries the supplied name and value", async () => {
        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            name: "appearance",
        });
        await flush();
        expect(options().length).toBe(THEMES.length);
        const hidden = document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
        expect(hidden.name).toBe("appearance");
        expect(hidden.value).toBe("light");
    });

    test("§7.3 no placeholder option is rendered any more", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        expect(document.body.querySelector(".theme-chooser-placeholder")).toBeNull();
        expect(document.body.querySelector("select")).toBeNull();
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(list().getAttribute("tabindex")).toBe("-1");
        click(button());
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(button().getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active theme is the aria-selected option", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        click(button());
        const selected = document.body.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].textContent?.trim()).toBe("Light");
    });

    test("§7.4 clicking an option selects it, applies it, and closes the listbox", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        pick("abyss");
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(button().getAttribute("aria-expanded")).toBe("false");
        const hidden = document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
        expect(hidden.value).toBe("abyss");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: "light,dark" });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Light");
        expect(text).toContain("Dark");
        expect(text).not.toMatch(/default/i);
    });

    test("§7.5 themeLabels override default title-casing", async () => {
        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: "light,dark",
            "theme-labels": JSON.stringify({ light: "Bright", dark: "Midnight" }),
        });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Bright");
        expect(text).toContain("Midnight");
    });

    test("§7.5 labelFor delegates to themeName so there is one title-casing rule", async () => {
        const el = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: "high-contrast",
            "theme-labels": JSON.stringify({ sepia: "Sepia Tone" }),
        });
        await flush();
        // Unmapped slug → themeName. Mapped slug → the override.
        expect(el.labelFor("high-contrast")).toBe(themeName("high-contrast"));
        expect(el.labelFor("high-contrast")).toBe("High Contrast");
        expect(el.labelFor("sepia")).toBe("Sepia Tone");
    });
});

describe("<theme-chooser> — keyboard contract (APG listbox, §7.14–§7.18)", () => {
    async function openWith(key: string): Promise<void> {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        press(button(), key);
    }

    test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            await openWith(key);
            expect(list().hasAttribute("hidden")).toBe(false);
            document.body.replaceChildren();
        }
    });

    test("§7.14 opening moves focus to the listbox and activates the selected option", async () => {
        await openWith("ArrowDown");
        expect(document.activeElement).toBe(list());
        // "light" is the resolved initial value, index 0.
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        expect(options()[0].hasAttribute("data-active")).toBe(true);
    });

    test("§7.14 ArrowUp opens with the last option active", async () => {
        await openWith("ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[THEMES.length - 1].id,
        );
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        await openWith("ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        // Clamp at the top.
        press(list(), "ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        press(list(), "ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
        press(list(), "ArrowDown");
        // Clamp at the bottom.
        press(list(), "ArrowDown");
        press(list(), "ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[THEMES.length - 1].id,
        );
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        await openWith("ArrowDown");
        press(list(), "End");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[THEMES.length - 1].id,
        );
        press(list(), "Home");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("§7.16 Enter selects the active option, applies it, closes, and refocuses the button", async () => {
        await openWith("ArrowDown");
        press(list(), "ArrowDown");
        press(list(), "Enter");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(document.activeElement).toBe(button());
        expect(list().hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("§7.16 Space also selects the active option", async () => {
        await openWith("ArrowDown");
        press(list(), "End");
        press(list(), " ");
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("§7.17 Escape closes without changing the theme and refocuses the button", async () => {
        await openWith("ArrowDown");
        press(list(), "ArrowDown");
        press(list(), "Escape");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.theme).toBe("light");
        expect(document.activeElement).toBe(button());
    });

    test("§7.17 Tab closes without stealing focus back to the button", async () => {
        await openWith("ArrowDown");
        press(list(), "Tab");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button());
    });

    test("§7.18 typeahead moves the active descendant by label prefix", async () => {
        await openWith("ArrowDown");
        press(list(), "a");
        // "Abyss" is index 2 in THEMES.
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[2].id);
    });

    test("§7.18 a click outside the root closes the listbox", async () => {
        await openWith("ArrowDown");
        expect(list().hasAttribute("hidden")).toBe(false);
        click(document.body);
        expect(list().hasAttribute("hidden")).toBe(true);
    });
});

describe("<theme-chooser> — dynamic loading (§7.6–§7.11)", () => {
    test("§7.6 default initial value is 'light' when present in themes", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: "dark,abyss" });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.7 injects a managed <link> with the resolved href", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        const link = getManagedLink();
        expect(link).not.toBeNull();
        expect(link!.rel).toBe("stylesheet");
        expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });

    test("§7.8 selecting an option updates href, data-theme, and fires themechange", async () => {
        const onChange = vi.fn();
        const el = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
        });
        el.addEventListener("themechange", (e) => {
            onChange((e as CustomEvent<{ theme: string }>).detail.theme);
        });
        await flush();
        pick("abyss");
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
        expect(onChange).toHaveBeenCalledWith("abyss");
    });

    test("§7.8 the managed <link> is discriminated by name", async () => {
        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            name: "appearance",
        });
        await flush();
        expect(getManagedLink("appearance")).not.toBeNull();
        expect(getManagedLink("theme")).toBeNull();
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const first = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            "storage-key": "lily-theme",
        });
        await flush();
        pick("dark");
        await flush();
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        first.remove();

        document.documentElement.removeAttribute("data-theme");
        document.head
            .querySelectorAll("link[data-lily-theme-chooser]")
            .forEach((n) => n.remove());

        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            "storage-key": "lily-theme",
        });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.10 a supplied value attribute wins over storage and defaults", async () => {
        localStorage.setItem("lily-theme", "abyss");
        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            value: "light",
            "storage-key": "lily-theme",
        });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.11 missing trailing slash on themes-url still yields one slash", async () => {
        mount({
            label: "Theme",
            "themes-url": URL_NO_TRAILING,
            themes: THEMES.join(","),
        });
        await flush();
        expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });
});

describe("<theme-chooser> — element shape + property API (§7.12–§7.13)", () => {
    test("§7.12 element survives a re-render with its id/data-* intact", async () => {
        const el = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
        });
        el.id = "tp";
        el.setAttribute("data-testid", "tp");
        await flush();
        // Force a re-render by changing themes.
        el.setAttribute("themes", "light,dark");
        await flush();
        expect(document.getElementById("tp")).toBe(el);
        expect(el.getAttribute("data-testid")).toBe("tp");
        expect(el.querySelectorAll(".theme-chooser-option").length).toBe(2);
    });

    test("§7.12 the consumer class is appended to the root class hook", async () => {
        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            class: "my-picker",
        });
        await flush();
        const root = document.body.querySelector("div.theme-chooser")!;
        expect(root.className).toBe("theme-chooser my-picker");
    });

    test("§7.13 setting el.themes as an array mirrors the CSV attribute", async () => {
        const el = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: "light,dark",
        }) as ThemeChooser;
        await flush();
        el.themes = ["light", "dark", "abyss"];
        await flush();
        expect(el.getAttribute("themes")).toBe("light,dark,abyss");
        expect(el.querySelectorAll(".theme-chooser-option").length).toBe(3);
        // Also accepts themeLabels as a property.
        el.themeLabels = { abyss: "Abyssal" };
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Abyssal");
    });

    test("§7.13 option ids are unique across instances", async () => {
        mount({ label: "A", "themes-url": URL_TRAILING, themes: "light,dark" });
        mount({ label: "B", "themes-url": URL_TRAILING, themes: "light,dark" });
        await flush();
        const ids = options().map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
        const listIds = [...document.body.querySelectorAll(".theme-chooser-list")].map(
            (l) => l.id,
        );
        expect(new Set(listIds).size).toBe(2);
    });
});

describe("<theme-chooser> — custom rendering by subclass (§7.19)", () => {
    class GlyphlessThemeChooser extends ThemeChooser {
        renderButtonContent(): Node {
            const span = document.createElement("span");
            span.setAttribute("data-testid", "custom");
            span.setAttribute("data-open", String(this.open));
            span.setAttribute("data-value", this.value);
            span.setAttribute("data-label-light", this.labelFor("light"));
            span.textContent = "custom glyph";
            return span;
        }
    }
    if (!customElements.get("glyphless-theme-chooser")) {
        customElements.define("glyphless-theme-chooser", GlyphlessThemeChooser);
    }

    test("§7.19 renderButtonContent replaces the glyph and keeps the aria wiring", async () => {
        const el = document.createElement(
            "glyphless-theme-chooser",
        ) as GlyphlessThemeChooser;
        el.setAttribute("label", "Theme");
        el.setAttribute("themes-url", URL_TRAILING);
        el.setAttribute("themes", THEMES.join(","));
        el.setAttribute("value", "dark");
        document.body.appendChild(el);
        await flush();

        const custom = el.querySelector<HTMLElement>('[data-testid="custom"]')!;
        expect(custom.closest("button")?.className).toBe("theme-chooser-button");
        expect(el.querySelector(".theme-chooser-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("dark");
        expect(custom.getAttribute("data-label-light")).toBe("Light");

        // The button/listbox structure and aria wiring are untouched.
        const btn = el.querySelector<HTMLButtonElement>(".theme-chooser-button")!;
        expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
        expect(btn.getAttribute("aria-label")).toBe("Theme");
        expect(el.querySelector(`#${btn.getAttribute("aria-controls")}`)).not.toBeNull();
    });

    test("§7.19 renderButtonContent re-runs when value or open changes", async () => {
        const el = document.createElement(
            "glyphless-theme-chooser",
        ) as GlyphlessThemeChooser;
        el.setAttribute("label", "Theme");
        el.setAttribute("themes-url", URL_TRAILING);
        el.setAttribute("themes", THEMES.join(","));
        document.body.appendChild(el);
        await flush();
        const read = (attr: string) =>
            el.querySelector('[data-testid="custom"]')!.getAttribute(attr);

        expect(read("data-value")).toBe("light");

        // A value change must refresh the button content, mirroring the
        // reactive `children` snippet in the other frameworks.
        el.value = "abyss";
        await flush();
        expect(read("data-value")).toBe("abyss");

        // So must opening the listbox.
        el.openList();
        expect(read("data-open")).toBe("true");
        el.closeList();
        expect(read("data-open")).toBe("false");
    });

    test("§7.19 a subclass still fires themechange through the base lifecycle", async () => {
        const el = document.createElement(
            "glyphless-theme-chooser",
        ) as GlyphlessThemeChooser;
        el.setAttribute("label", "Theme");
        el.setAttribute("themes-url", URL_TRAILING);
        el.setAttribute("themes", THEMES.join(","));
        document.body.appendChild(el);
        await flush();
        let detail: { theme: string } | undefined;
        el.addEventListener("themechange", (e) => {
            detail = (e as CustomEvent<{ theme: string }>).detail;
        });
        el.value = "dark";
        expect(detail).toEqual({ theme: "dark" });
    });
});
