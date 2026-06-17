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
        expect(options.length).toBe(3);
        expect(root.name).toBe("appearance");
    });

    test("§7.4 each option carries the slug as its value", () => {
        const html = renderMacro({
            label: "Theme",
            themesUrl: URL_TRAILING,
            themes: THEMES,
        });
        const root = mountIntoBody(html);
        const values = Array.from(
            root.querySelectorAll<HTMLOptionElement>("option"),
        ).map((o) => o.value);
        expect(values).toEqual(THEMES);
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
