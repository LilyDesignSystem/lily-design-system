import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
    ThemePicker,
    normalizeThemesUrl,
    themeHref,
} from "./theme-picker.js";

// Ensure the custom element is registered exactly once for the suite.
if (typeof customElements !== "undefined" && !customElements.get("theme-picker")) {
    customElements.define("theme-picker", ThemePicker);
}

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-picker="${name}"]`,
    );
}

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function mount(attrs: Record<string, string>): ThemePicker {
    const el = document.createElement("theme-picker") as ThemePicker;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-picker]")
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

describe("<theme-picker> — pure helpers", () => {
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
});

describe("<theme-picker> — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a <fieldset> with role=radiogroup", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        const fs = document.body.querySelector("fieldset")!;
        expect(fs.tagName).toBe("FIELDSET");
        expect(fs.getAttribute("role")).toBe("radiogroup");
    });

    test("§7.2 aria-label on the fieldset is the supplied label", async () => {
        mount({ label: "Choose theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        const fs = document.body.querySelector("fieldset")!;
        expect(fs.getAttribute("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one radio per theme, sharing the supplied name", async () => {
        mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            name: "appearance",
        });
        await flush();
        const radios = document.body.querySelectorAll<HTMLInputElement>("input[type='radio']");
        expect(radios.length).toBe(3);
        expect([...radios].every((r) => r.name === "appearance")).toBe(true);
    });

    test("§7.4 each radio carries the slug as its value", async () => {
        mount({ label: "Theme", "themes-url": URL_TRAILING, themes: THEMES.join(",") });
        await flush();
        const radios = document.body.querySelectorAll<HTMLInputElement>("input[type='radio']");
        expect([...radios].map((r) => r.value)).toEqual(THEMES);
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
});

describe("<theme-picker> — dynamic loading (§7.6–§7.11)", () => {
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

    test("§7.8 selecting a radio updates href, data-theme, and fires themechange", async () => {
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
        const radios = document.body.querySelectorAll<HTMLInputElement>("input[type='radio']");
        radios[2].click(); // abyss
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
        expect(onChange).toHaveBeenCalledWith("abyss");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const first = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: THEMES.join(","),
            "storage-key": "lily-theme",
        });
        await flush();
        const radios = document.body.querySelectorAll<HTMLInputElement>("input[type='radio']");
        radios[1].click(); // dark
        await flush();
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        first.remove();

        document.documentElement.removeAttribute("data-theme");
        document.head
            .querySelectorAll("link[data-lily-theme-picker]")
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

describe("<theme-picker> — element shape + property API (§7.12–§7.13)", () => {
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
        expect(el.querySelectorAll("input[type='radio']").length).toBe(2);
    });

    test("§7.13 setting el.themes as an array mirrors the CSV attribute", async () => {
        const el = mount({
            label: "Theme",
            "themes-url": URL_TRAILING,
            themes: "light,dark",
        }) as ThemePicker;
        await flush();
        el.themes = ["light", "dark", "abyss"];
        await flush();
        expect(el.getAttribute("themes")).toBe("light,dark,abyss");
        expect(el.querySelectorAll("input[type='radio']").length).toBe(3);
        // Also accepts themeLabels as a property.
        el.themeLabels = { abyss: "Abyssal" };
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("Abyssal");
    });
});
