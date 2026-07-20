// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    initThemeSelect,
    normaliseThemesUrl,
    themeHref,
} from "./theme-select.client.js";

// ---------------------------------------------------------------------
// Nunjucks env that can resolve `./theme-select.njk` from this dir.
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
        `{% from "./theme-select.njk" import themeSelect %}` +
        `{{ themeSelect(opts) }}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-theme-select-root]",
    ) as HTMLElement;
}

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-select="${name}"]`,
    );
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-select]")
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

describe("ThemeSelect — macro markup contract (§7.1–§7.6)", () => {
    test("§7.1 macro renders a native <select> root", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        expect(root.tagName).toBe("SELECT");
        expect(root.classList.contains("theme-select")).toBe(true);
    });

    test("§7.2 aria-label is the supplied label", () => {
        const html = renderMacro({
            label: "Choose theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        expect(root.getAttribute("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one option per theme; the select carries the supplied name", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            name: "appearance",
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        const options = Array.from(
            root.querySelectorAll<HTMLOptionElement>("option"),
        );
        // One placeholder option plus one option per theme.
        expect(options.length).toBe(4);
        expect(root.name).toBe("appearance");
    });

    test("§7.4 each option carries the slug as its value, after the empty placeholder", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        const values = Array.from(
            root.querySelectorAll<HTMLOptionElement>("option"),
        ).map((o) => o.value);
        expect(values).toEqual(["", ...THEMES]);
    });

    test("§7.14 the placeholder option renders the label and stays displayed", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        initThemeSelect(root);
        const placeholder = root.querySelector(
            ".theme-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder).not.toBeNull();
        expect(placeholder.textContent?.trim()).toBe("Theme");
        expect(placeholder.value).toBe("");
        // It is the first child of the <select>.
        expect(root.options[0]).toBe(placeholder);
        // The closed control shows the placeholder, not the active theme.
        expect(root.value).toBe("");
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.15 the placeholder param overrides the label as placeholder text", () => {
        const html = renderMacro({
            label: "Choose a theme",
            placeholder: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        const placeholder = root.querySelector(
            ".theme-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder.textContent?.trim()).toBe("Theme");
        expect(root.getAttribute("aria-label")).toBe("Choose a theme");
    });

    test("§7.16 choosing a theme applies it and snaps the select back to the placeholder", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        initThemeSelect(root);
        root.value = "abyss";
        root.dispatchEvent(new Event("change", { bubbles: true }));
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(root.value).toBe("");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: ["light", "dark"],
        });
        const root = mountIntoBody(html);
        const text = root.textContent || "";
        expect(text).toMatch(/Light/);
        expect(text).toMatch(/Dark/);
        expect(text).not.toMatch(/default/i);
    });

    test("§7.6 themeLabels override the default title-case label", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: ["light", "dark"],
            themeLabels: { light: "Bright", dark: "Midnight" },
        });
        const root = mountIntoBody(html);
        const text = root.textContent || "";
        expect(text).toMatch(/Bright/);
        expect(text).toMatch(/Midnight/);
    });
});

describe("ThemeSelect — pure helpers (§7.12)", () => {
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
});

describe("ThemeSelect — client.js lifecycle (§7.7–§7.11, §7.13)", () => {
    test("§7.7 initThemeSelect injects a managed <link> with the resolved href", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        initThemeSelect(root);
        const link = getManagedLink();
        expect(link).not.toBeNull();
        expect(link!.rel).toBe("stylesheet");
        expect(link!.getAttribute("href")).toBe("/assets/themes/light.css");
    });

    test("§7.8 initial apply sets data-theme on documentElement", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        initThemeSelect(root);
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.9 an option change updates href, data-theme, and fires onChange", () => {
        const onChange = vi.fn();
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        initThemeSelect(root, { onChange });
        root.value = "abyss";
        root.dispatchEvent(new Event("change", { bubbles: true }));
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(getManagedLink()!.getAttribute("href")).toBe(
            "/assets/themes/abyss.css",
        );
        expect(onChange).toHaveBeenCalledWith("abyss");
    });

    test("§7.10 persists to localStorage and reads back on a fresh init", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            storageKey: "lily-theme",
        });
        const root = mountIntoBody(html);
        const ctrl = initThemeSelect(root);
        ctrl.setTheme("dark");
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        ctrl.destroy();
        document.documentElement.removeAttribute("data-theme");
        document.head
            .querySelectorAll("link[data-lily-theme-select]")
            .forEach((n) => n.remove());

        const html2 = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            storageKey: "lily-theme",
        });
        const root2 = mountIntoBody(html2);
        initThemeSelect(root2);
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.11 themesUrl without trailing slash still yields one slash", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_NO_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        initThemeSelect(root);
        expect(getManagedLink()!.getAttribute("href")).toBe(
            "/assets/themes/light.css",
        );
    });

    test("§7.13 extra attributes spread onto the <select> root", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            attributes: { "data-testid": "tp" },
        });
        const root = mountIntoBody(html);
        expect(root.getAttribute("data-testid")).toBe("tp");
    });

    test("§7.17 opts.value never renders `selected` on a real option — the placeholder is the only selected option (no pre-hydration flash)", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            value: "abyss",
        });
        const root = mountIntoBody(html) as HTMLSelectElement;
        const selected = Array.from(root.options).filter(
            (o) => o.defaultSelected,
        );
        expect(selected.length).toBe(1);
        expect(selected[0].classList.contains("theme-select-placeholder")).toBe(
            true,
        );
        // The closed control reads the placeholder from byte zero.
        expect(root.value).toBe("");
    });

    test("§7.18 opts.value is carried on data-lily-theme-select-value and resolves the initial theme", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
            value: "abyss",
            defaultValue: "dark",
        });
        const root = mountIntoBody(html);
        expect(root.getAttribute("data-lily-theme-select-value")).toBe("abyss");
        initThemeSelect(root);
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });

    test("§7.19 the value data attribute is omitted entirely when opts.value is unset", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        expect(root.hasAttribute("data-lily-theme-select-value")).toBe(false);
    });

    test("autoInit wires every select on the page", () => {
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
    });
});
