// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
    initThemeChooser,
    matchSystemTheme,
    normaliseThemesUrl,
    themeHref,
    themeName,
} from "./theme-chooser.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./theme-chooser.njk` from this dir.
// ---------------------------------------------------------------------

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./theme-chooser.njk" import themeChooser %}` +
        `{{ themeChooser(opts) }}`;
    return env.renderString(src, { opts });
}

function renderMacroWithCaller(
    opts: Record<string, unknown>,
    body: string,
): string {
    const src =
        `{% from "./theme-chooser.njk" import themeChooser %}` +
        `{% call themeChooser(opts) %}${body}{% endcall %}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-theme-chooser-root]",
    ) as HTMLElement;
}

type Parts = {
    root: HTMLElement;
    button: HTMLButtonElement;
    list: HTMLElement;
    options: HTMLElement[];
    input: HTMLInputElement;
};

function partsOf(root: HTMLElement): Parts {
    return {
        root,
        button: root.querySelector(".theme-chooser-button") as HTMLButtonElement,
        list: root.querySelector(".theme-chooser-list") as HTMLElement,
        options: Array.from(
            root.querySelectorAll<HTMLElement>(".theme-chooser-option"),
        ),
        input: root.querySelector(
            "[data-lily-theme-chooser-input]",
        ) as HTMLInputElement,
    };
}

/** Render + mount + init in one step, returning the DOM parts. */
function setup(
    opts: Record<string, unknown> = {},
    initOpts: Record<string, unknown> = {},
) {
    const root = mountIntoBody(
        renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            ...opts,
        }),
    );
    const controller = initThemeChooser(root, initOpts);
    return { ...partsOf(root), controller };
}

function key(el: Element, k: string, init: KeyboardEventInit = {}) {
    el.dispatchEvent(
        new KeyboardEvent("keydown", { key: k, bubbles: true, ...init }),
    );
}

function click(el: Element) {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

/**
 * Run `fn` with a stubbed `window.matchMedia` that reports the given
 * `prefers-color-scheme: dark` answer, then restore jsdom's ambient
 * state (which is: no matchMedia at all).
 */
function withMatchMedia(prefersDark: boolean, fn: () => void) {
    const had = Object.prototype.hasOwnProperty.call(window, "matchMedia");
    const original = (window as unknown as { matchMedia?: unknown })
        .matchMedia;
    (window as unknown as { matchMedia: unknown }).matchMedia = (
        query: string,
    ) => ({
        matches: query.includes("dark") ? prefersDark : !prefersDark,
        media: query,
    });
    try {
        fn();
    } finally {
        if (had) {
            (window as unknown as { matchMedia: unknown }).matchMedia =
                original;
        } else {
            delete (window as unknown as { matchMedia?: unknown }).matchMedia;
        }
    }
}

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-chooser="${name}"]`,
    );
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-chooser]")
        .forEach((n) => n.remove());
    document.body.innerHTML = "";
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
});

describe("ThemeChooser — macro markup contract (§7.1–§7.6)", () => {
    test("§7.1 macro renders a div root containing a button that controls a listbox", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("theme-chooser")).toBe(true);

        const { button, list } = partsOf(root);
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(button.getAttribute("aria-controls")).toBe(list.id);
        expect(list.getAttribute("role")).toBe("listbox");
        expect(list.getAttribute("tabindex")).toBe("-1");
    });

    test("§7.1 the button renders the half-circle glyph, hidden from assistive tech", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        const icon = root.querySelector(".theme-chooser-icon") as HTMLElement;
        expect(icon.textContent).toBe(CIRCLE_WITH_RIGHT_HALF_BLACK);
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        // The glyph must never be the accessible name.
        expect(root.querySelector(".theme-chooser-button")!.textContent).not.toBe(
            root
                .querySelector(".theme-chooser-button")!
                .getAttribute("aria-label"),
        );
    });

    test("§7.2 aria-label names both the button and the listbox", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Choose theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        const { button, list } = partsOf(root);
        expect(button.getAttribute("aria-label")).toBe("Choose theme");
        expect(list.getAttribute("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one option per theme; the hidden input carries the supplied name", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                name: "appearance",
            }),
        );
        const { options, input } = partsOf(root);
        expect(options.length).toBe(THEMES.length);
        expect(input.type).toBe("hidden");
        expect(input.name).toBe("appearance");
    });

    test("§7.4 each option carries the slug on data-value and a stable unique id", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        const { options } = partsOf(root);
        expect(options.map((o) => o.getAttribute("data-value"))).toEqual(THEMES);

        const ids = options.map((o) => o.id);
        // Unique, non-empty, and deterministic (no Math.random / Date.now).
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids.every((id) => id.length > 0)).toBe(true);

        const again = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        expect(partsOf(again).options.map((o) => o.id)).toEqual(ids);
    });

    test("§7.4 an explicit id namespaces the listbox and its options", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                id: "sidebar-theme",
            }),
        );
        const { list, options } = partsOf(root);
        expect(list.id).toBe("sidebar-theme-list");
        expect(options[0].id).toBe("sidebar-theme-option-0");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: ["light", "dark"],
            }),
        );
        const text = root.textContent || "";
        expect(text).toMatch(/Light/);
        expect(text).toMatch(/Dark/);
        expect(text).not.toMatch(/default/i);
    });

    test("§7.6 themeLabels override the default title-case label", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: ["light", "dark"],
                themeLabels: { light: "Bright", dark: "Midnight" },
            }),
        );
        const text = root.textContent || "";
        expect(text).toMatch(/Bright/);
        expect(text).toMatch(/Midnight/);
    });
});

describe("ThemeChooser — server-rendered listbox state (§7.14–§7.16)", () => {
    // These replace the retired "only the placeholder is selected"
    // regression guard: there is no placeholder and no <select> any more,
    // so the meaningful pre-hydration invariants are (a) the listbox is
    // closed and (b) exactly one option is marked selected.

    test("§7.14 the listbox renders hidden and the button collapsed, before any JS runs", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                value: "abyss",
            }),
        );
        const { button, list } = partsOf(root);
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        // Nothing is "active" until the listbox opens.
        expect(list.hasAttribute("aria-activedescendant")).toBe(false);
        expect(root.querySelector("[data-active]")).toBeNull();
    });

    test("§7.15 exactly one option is aria-selected in the server markup, and it is opts.value", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                value: "abyss",
            }),
        );
        const { options } = partsOf(root);
        const selected = options.filter(
            (o) => o.getAttribute("aria-selected") === "true",
        );
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("data-value")).toBe("abyss");
        // Every other option is explicitly false, never absent.
        expect(
            options.every((o) => o.hasAttribute("aria-selected")),
        ).toBe(true);
    });

    test("§7.15 with no value, the server marks 'light' selected; without 'light', the first theme", () => {
        const withLight = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        expect(
            partsOf(withLight)
                .options.find(
                    (o) => o.getAttribute("aria-selected") === "true",
                )!
                .getAttribute("data-value"),
        ).toBe("light");

        const withoutLight = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: ["abyss", "dark"],
            }),
        );
        expect(
            partsOf(withoutLight)
                .options.find(
                    (o) => o.getAttribute("aria-selected") === "true",
                )!
                .getAttribute("data-value"),
        ).toBe("abyss");
    });

    test("§7.16 the hidden input is pre-filled server-side so a no-JS form submit still carries a theme", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                value: "dark",
            }),
        );
        expect(partsOf(root).input.value).toBe("dark");
    });
});

describe("ThemeChooser — keyboard contract (APG listbox, §7.20–§7.24)", () => {
    test("§7.20 ArrowDown, Enter and Space all open the listbox and focus it", () => {
        for (const k of ["ArrowDown", "Enter", " "]) {
            const { button, list } = setup();
            key(button, k);
            expect(list.hasAttribute("hidden")).toBe(false);
            expect(button.getAttribute("aria-expanded")).toBe("true");
            expect(document.activeElement).toBe(list);
        }
    });

    test("§7.20 ArrowUp opens with the last option active", () => {
        const { button, list, options } = setup();
        key(button, "ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[THEMES.length - 1].id,
        );
    });

    test("§7.21 opening puts the active descendant on the selected theme", () => {
        // "light" resolves as the initial theme, so it is index 0.
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
        expect(options[0].hasAttribute("data-active")).toBe(true);
    });

    test("§7.21 ArrowDown / ArrowUp move the active descendant and clamp", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[1].id);
        key(list, "ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
        // Clamps at the top rather than wrapping.
        key(list, "ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
        // ...and at the bottom.
        key(list, "End");
        key(list, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[THEMES.length - 1].id,
        );
    });

    test("§7.21 Home and End jump to the first and last option", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "End");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[THEMES.length - 1].id,
        );
        key(list, "Home");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    test("§7.22 Enter selects the active option, applies it, closes, and returns focus", () => {
        const onChange = vi.fn();
        const { button, list, input } = setup({}, { onChange });
        key(button, "ArrowDown");
        key(list, "ArrowDown");
        key(list, "Enter");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(input.value).toBe("dark");
        expect(onChange).toHaveBeenLastCalledWith("dark");
        expect(document.activeElement).toBe(button);
    });

    test("§7.22 Space also selects the active option", () => {
        const { button, list } = setup();
        key(button, "ArrowDown");
        key(list, "End");
        key(list, " ");
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.23 Escape closes and returns focus without changing the theme", () => {
        const onChange = vi.fn();
        const { button, list } = setup({}, { onChange });
        onChange.mockClear(); // ignore the initial apply
        key(button, "ArrowDown");
        key(list, "ArrowDown");
        key(list, "Escape");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.theme).toBe("light");
        expect(onChange).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(button);
    });

    test("§7.23 Tab closes without stealing focus back to the button", () => {
        const { button, list } = setup();
        key(button, "ArrowDown");
        expect(document.activeElement).toBe(list);
        key(list, "Tab");
        expect(list.hasAttribute("hidden")).toBe(true);
        // Focus is left alone so the browser's own Tab handling proceeds.
        expect(document.activeElement).not.toBe(button);
    });

    test("§7.24 typeahead moves the active descendant by label prefix", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "a"); // "Abyss"
        expect(list.getAttribute("aria-activedescendant")).toBe(options[2].id);
    });

    test("§7.24 the typeahead buffer accumulates, then resets after 500ms", () => {
        vi.useFakeTimers();
        try {
            const { button, list, options } = setup();
            key(button, "ArrowDown");
            // "da" matches only "Dark".
            key(list, "d");
            key(list, "a");
            expect(list.getAttribute("aria-activedescendant")).toBe(
                options[1].id,
            );
            // After the reset window, a lone "a" starts a fresh search.
            vi.advanceTimersByTime(600);
            key(list, "a");
            expect(list.getAttribute("aria-activedescendant")).toBe(
                options[2].id,
            );
        } finally {
            vi.useRealTimers();
        }
    });

    test("§7.24 modifier chords are not treated as typeahead", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "a", { ctrlKey: true });
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    test("§7.24 clicking an option selects and applies it", () => {
        const { button, list, options } = setup();
        click(button);
        click(options[2]);
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.24 clicking the button toggles the listbox shut again", () => {
        const { button, list } = setup();
        click(button);
        expect(list.hasAttribute("hidden")).toBe(false);
        click(button);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.24 clicking outside the root closes the listbox", () => {
        const { button, list } = setup();
        const outside = document.createElement("p");
        document.body.appendChild(outside);
        click(button);
        expect(list.hasAttribute("hidden")).toBe(false);
        click(outside);
        expect(list.hasAttribute("hidden")).toBe(true);
        outside.remove();
    });

    test("§7.24 focus leaving the root closes the listbox", () => {
        const { root, button, list } = setup();
        const outside = document.createElement("button");
        document.body.appendChild(outside);
        key(button, "ArrowDown");
        expect(list.hasAttribute("hidden")).toBe(false);
        root.dispatchEvent(
            new FocusEvent("focusout", {
                bubbles: true,
                relatedTarget: outside,
            }),
        );
        expect(list.hasAttribute("hidden")).toBe(true);
        outside.remove();
    });

    test("§7.24 aria-selected follows the applied theme, not merely the active option", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "ArrowDown"); // active = dark, but not chosen yet
        expect(options[0].getAttribute("aria-selected")).toBe("true");
        expect(options[1].getAttribute("aria-selected")).toBe("false");
        key(list, "Enter");
        expect(options[0].getAttribute("aria-selected")).toBe("false");
        expect(options[1].getAttribute("aria-selected")).toBe("true");
    });
});

describe("ThemeChooser — pure helpers (§7.12)", () => {
    test("§7.12 normaliseThemesUrl keeps an existing trailing slash", () => {
        expect(normaliseThemesUrl("/a/")).toBe("/a/");
    });

    test("§7.12 normaliseThemesUrl appends a missing trailing slash", () => {
        expect(normaliseThemesUrl("/a")).toBe("/a/");
    });

    test("§7.12 themeHref builds the href", () => {
        expect(themeHref("/a", "light", ".css")).toBe("/a/light.css");
        expect(themeHref("/a/", "light", ".css")).toBe("/a/light.css");
    });

    test("§7.25 themeName title-cases each hyphen-separated word", () => {
        expect(themeName("light")).toBe("Light");
        expect(themeName("high-contrast")).toBe("High Contrast");
        expect(
            themeName(
                "united-kingdom-national-health-service-england-for-patients",
            ),
        ).toBe(
            "United Kingdom National Health Service England For Patients",
        );
    });

    test("§7.25 themeName is the JS statement of the rule the macro renders", () => {
        // A Nunjucks macro cannot call into the client module, so the two
        // implementations are held in agreement by this test rather than
        // by delegation.
        const slugs = ["light", "dark", "high-contrast", "solarized-dark"];
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: slugs,
            }),
        );
        expect(
            partsOf(root).options.map((o) => (o.textContent || "").trim()),
        ).toEqual(slugs.map(themeName));
    });

    test("§7.26 matchSystemTheme resolves the dark preference", () => {
        withMatchMedia(true, () => {
            expect(matchSystemTheme(["light", "dark"])).toBe("dark");
        });
    });

    test("§7.26 matchSystemTheme resolves the light preference", () => {
        withMatchMedia(false, () => {
            expect(matchSystemTheme(["light", "dark"])).toBe("light");
        });
    });

    test("§7.26 matchSystemTheme returns '' when the resolved slug is absent", () => {
        withMatchMedia(true, () => {
            expect(matchSystemTheme(["abyss", "light"])).toBe("");
        });
        withMatchMedia(false, () => {
            expect(matchSystemTheme(["abyss", "dark"])).toBe("");
        });
    });

    test("§7.26 matchSystemTheme returns '' when matchMedia is unavailable (SSR / jsdom)", () => {
        // jsdom does not implement matchMedia, so this is the ambient
        // state — the guard is required, not defensive decoration.
        expect(typeof window.matchMedia).not.toBe("function");
        expect(matchSystemTheme(["light", "dark"])).toBe("");
    });
});

describe("ThemeChooser — system-preference detection (§7.27)", () => {
    test("§7.27 detectFromSystem resolves the initial theme when nothing else does", () => {
        withMatchMedia(true, () => {
            setup({ detectFromSystem: true });
            expect(document.documentElement.dataset.theme).toBe("dark");
        });
    });

    test("§7.27 detection is off unless opted in", () => {
        withMatchMedia(true, () => {
            setup();
            // Falls through detection to the "light" fallback.
            expect(document.documentElement.dataset.theme).toBe("light");
        });
    });

    test("§7.27 storage beats detection", () => {
        localStorage.setItem("lily-theme", "abyss");
        withMatchMedia(true, () => {
            setup({ detectFromSystem: true, storageKey: "lily-theme" });
            expect(document.documentElement.dataset.theme).toBe("abyss");
        });
    });

    test("§7.27 detection beats defaultValue", () => {
        withMatchMedia(true, () => {
            setup({ detectFromSystem: true, defaultValue: "abyss" });
            expect(document.documentElement.dataset.theme).toBe("dark");
        });
    });

    test("§7.27 the macro emits the detect flag; detection never affects server markup", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                detectFromSystem: true,
            }),
        );
        expect(
            root.getAttribute("data-lily-theme-chooser-detect-from-system"),
        ).toBe("true");
        // matchMedia does not exist at render time, so the server-rendered
        // aria-selected still resolves value/defaultValue/"light"/first.
        const selected = partsOf(root).options.filter(
            (o) => o.getAttribute("aria-selected") === "true",
        );
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("data-value")).toBe("light");
    });

    test("§7.27 the flag defaults to false", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        expect(
            root.getAttribute("data-lily-theme-chooser-detect-from-system"),
        ).toBe("false");
    });
});

describe("ThemeChooser — initial-value precedence (§7.28)", () => {
    // BREAKING (Unreleased): `value` now beats storage. Before this
    // change a consumer who resolved the theme on the server and passed
    // it as opts.value had it silently overridden by stale localStorage
    // — the exact SSR case this catalog exists for.

    test("§7.28 opts.value beats a conflicting localStorage entry", () => {
        localStorage.setItem("lily-theme", "abyss");
        setup({ value: "dark", storageKey: "lily-theme" });
        expect(document.documentElement.dataset.theme).toBe("dark");
        // ...and the applied value is written back, so storage converges.
        expect(localStorage.getItem("lily-theme")).toBe("dark");
    });

    test("§7.29 warns once when value and storage disagree", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem("lily-theme", "abyss");
        setup({ value: "dark", storageKey: "lily-theme" });
        expect(warn).toHaveBeenCalledTimes(1);
        const msg = String(warn.mock.calls[0][0]);
        // Names both values and points at the version, so the reader can
        // tell what changed without digging.
        expect(msg).toContain("dark");
        expect(msg).toContain("abyss");
        expect(msg).toContain("0.4.0");
        warn.mockRestore();
    });

    test("§7.29 stays silent when value and storage agree", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem("lily-theme", "dark");
        setup({ value: "dark", storageKey: "lily-theme" });
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });

    test("§7.29 stays silent when only one of the two is set", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        setup({ value: "dark" });
        localStorage.setItem("lily-theme", "abyss");
        setup({ storageKey: "lily-theme" });
        // Neither case changed behaviour in 0.4.0, so neither warrants noise.
        expect(warn).not.toHaveBeenCalled();
        warn.mockRestore();
    });

    test("§7.28 storage still applies when opts.value is absent", () => {
        localStorage.setItem("lily-theme", "abyss");
        setup({ storageKey: "lily-theme" });
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });

    test("§7.28 the full order is value > storage > detection > default > 'light' > first", () => {
        // default beats "light"
        setup({ defaultValue: "abyss" });
        expect(document.documentElement.dataset.theme).toBe("abyss");

        // "light" beats first-option
        document.documentElement.removeAttribute("data-theme");
        setup({ themes: ["abyss", "light", "dark"] });
        expect(document.documentElement.dataset.theme).toBe("light");

        // first-option is the last resort
        document.documentElement.removeAttribute("data-theme");
        setup({ themes: ["abyss", "dark"] });
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });
});

describe("ThemeChooser — client.js lifecycle (§7.7–§7.11, §7.13)", () => {
    test("§7.7 initThemeChooser injects a managed <link> with the resolved href", () => {
        setup();
        const link = getManagedLink();
        expect(link).not.toBeNull();
        expect(link!.rel).toBe("stylesheet");
        expect(link!.getAttribute("href")).toBe("/assets/themes/light.css");
    });

    test("§7.8 initial apply sets data-theme on documentElement", () => {
        setup();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.9 choosing an option updates href, data-theme, the hidden input, and fires onChange", () => {
        const onChange = vi.fn();
        const { button, options, input } = setup({}, { onChange });
        click(button);
        click(options[2]);
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(getManagedLink()!.getAttribute("href")).toBe(
            "/assets/themes/abyss.css",
        );
        expect(input.value).toBe("abyss");
        expect(onChange).toHaveBeenLastCalledWith("abyss");
    });

    test("§7.10 persists to localStorage and reads back on a fresh init", () => {
        const { controller } = setup({ storageKey: "lily-theme" });
        controller.setTheme("dark");
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        controller.destroy();
        document.documentElement.removeAttribute("data-theme");
        document.head
            .querySelectorAll("link[data-lily-theme-chooser]")
            .forEach((n) => n.remove());

        setup({ storageKey: "lily-theme" });
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.11 themesUrl without trailing slash still yields one slash", () => {
        setup({ themesUrl: URL_NO_TRAILING });
        expect(getManagedLink()!.getAttribute("href")).toBe(
            "/assets/themes/light.css",
        );
    });

    test("§7.13 extra attributes spread onto the root div", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                attributes: { "data-testid": "tp" },
            }),
        );
        expect(root.getAttribute("data-testid")).toBe("tp");
    });

    test("§7.17 opts.value is carried on data-lily-theme-chooser-value and resolves the initial theme", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                value: "abyss",
                defaultValue: "dark",
            }),
        );
        expect(root.getAttribute("data-lily-theme-chooser-value")).toBe("abyss");
        initThemeChooser(root);
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });

    test("§7.18 the value data attribute is omitted entirely when opts.value is unset", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
            }),
        );
        expect(root.hasAttribute("data-lily-theme-chooser-value")).toBe(false);
    });

    test("§7.19 a call block replaces the glyph inside the button", () => {
        const root = mountIntoBody(
            renderMacroWithCaller(
                {
                    label: "Theme",
                    themesUrl: URL_TRAILING,
                    themes: THEMES,
                },
                `<span class="my-glyph" aria-hidden="true">T</span>`,
            ),
        );
        const { button } = partsOf(root);
        expect(button.querySelector(".my-glyph")).not.toBeNull();
        expect(button.querySelector(".theme-chooser-icon")).toBeNull();
        // The accessible name still comes from aria-label, not the glyph.
        expect(button.getAttribute("aria-label")).toBe("Theme");
    });

    test("§7.13 destroy() detaches the listeners", () => {
        const { button, list, controller } = setup();
        controller.destroy();
        key(button, "ArrowDown");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("autoInit wires every root on the page", () => {
        const html1 = renderMacro({
            label: "Theme A",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            name: "a",
        });
        const html2 = renderMacro({
            label: "Theme B",
            themesUrl: URL_TRAILING,
            themes: ["light", "dark"],
            name: "b",
        });
        document.body.innerHTML = html1 + html2;
        const controllers = autoInit();
        expect(controllers.length).toBe(2);
        expect(getManagedLink("a")).not.toBeNull();
        expect(getManagedLink("b")).not.toBeNull();
        // Distinct names give distinct id namespaces, so the two listboxes
        // do not collide.
        const lists = document.querySelectorAll(".theme-chooser-list");
        expect(lists[0].id).not.toBe(lists[1].id);
    });
});
