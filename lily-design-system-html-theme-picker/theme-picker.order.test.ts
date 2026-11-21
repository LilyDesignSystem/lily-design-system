import { afterEach, beforeEach, describe, expect, test } from "vitest";

import { ThemePicker } from "./theme-picker.js";

// Order of themes (spec/theme-picker, 2026-11-21): alphabetical by the name shown, in the page's language.

if (typeof customElements !== "undefined" && !customElements.get("theme-picker")) {
    customElements.define("theme-picker", ThemePicker);
}

const labels = {
    "ibm-carbon": "IBM Carbon",
    "adobe-spectrum": "Adobe Spectrum",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    light: "Light",
    dark: "Dark",
};
const base = {
    label: "Theme",
    "themes-url": "/assets/themes/",
    themes: Object.keys(labels).join(","),
    "theme-labels": JSON.stringify(labels),
};

function mount(attrs: Record<string, string> = {}): ThemePicker {
    const el = document.createElement("theme-picker") as ThemePicker;
    for (const [k, v] of Object.entries({ ...base, ...attrs })) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}
const names = (el: Element, selector = "li.theme-picker-option") =>
    [...el.querySelectorAll(selector)].map((o) => o.textContent?.trim());
const flush = () => new Promise<void>((r) => setTimeout(r, 0));

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    document.body.replaceChildren();
    localStorage.clear();
});
afterEach(() => document.body.replaceChildren());

describe("<theme-picker>: order of themes", () => {
    test("lists the themes alphabetically by the name shown, in one list", () => {
        expect(names(mount())).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("'Follow this device' is first, then the sorted themes", () => {
        expect(names(mount({ "system-label": "Follow this device" }))).toEqual([
            "Follow this device",
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test('sort-themes="false" keeps the order of `themes`', () => {
        expect(names(mount({ "sort-themes": "false" }))).toEqual([
            "IBM Carbon",
            "Adobe Spectrum",
            "NHS England (patients)",
            "Light",
            "Dark",
        ]);
    });

    test("the sortThemes property reads and writes the attribute, and re-renders", () => {
        const el = mount();
        expect(el.sortThemes).toBe(true);
        el.sortThemes = false;
        expect(el.getAttribute("sort-themes")).toBe("false");
        expect(el.sortThemes).toBe(false);
        expect(names(el)[0]).toBe("IBM Carbon");
        el.sortThemes = true;
        expect(el.getAttribute("sort-themes")).toBe("true");
        expect(names(el)[0]).toBe("Adobe Spectrum");
    });

    test("a title-cased slug is the name when there is no label", () => {
        expect(names(mount({ themes: "zeta-one,alpha-two,mid", "theme-labels": "{}" }))).toEqual([
            "Alpha Two",
            "Mid",
            "Zeta One",
        ]);
    });

    test("uses the page's language, and sorts again when it changes", async () => {
        document.documentElement.setAttribute("lang", "en");
        const el = mount({
            themes: "a,z",
            "theme-labels": JSON.stringify({ a: "Äpple", z: "Zebra" }),
        });
        expect(names(el)).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(el)).toEqual(["Zebra", "Äpple"]);
    });

    test("stops watching the language when it is removed", async () => {
        document.documentElement.setAttribute("lang", "en");
        const el = mount({
            themes: "a,z",
            "theme-labels": JSON.stringify({ a: "Äpple", z: "Zebra" }),
        });
        el.remove();
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(el)).toEqual(["Äpple", "Zebra"]);
    });

    test("the native select variant is sorted the same way", () => {
        expect(names(mount({ variant: "select" }), "option.theme-picker-option")).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });
});
