import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { nextTick } from "vue";

import ThemePicker from "./ThemePicker.vue";

// Order of themes (spec/theme-picker, 2026-11-21): alphabetical by the name shown, in the page's language.

const labels = {
    "ibm-carbon": "IBM Carbon",
    "adobe-spectrum": "Adobe Spectrum",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    light: "Light",
    dark: "Dark",
};
const themes = Object.keys(labels);
const base = { label: "Theme", themesUrl: "/assets/themes/", themes, themeLabels: labels };

const wrappers: VueWrapper<any>[] = [];
function build(props: Record<string, unknown>) {
    const wrapper = mount(ThemePicker, { props: { ...base, ...props }, attachTo: document.body });
    wrappers.push(wrapper);
    return wrapper;
}
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}
const names = (w: VueWrapper<any>) => w.findAll("li.theme-picker-option").map((o) => o.text());

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    localStorage.clear();
});
afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
});

describe("ThemePicker: order of themes", () => {
    test("lists the themes alphabetically by the name shown, in one list", async () => {
        const w = build({});
        await flush();
        expect(names(w)).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("'Follow this device' is first, then the sorted themes", async () => {
        const w = build({ systemLabel: "Follow this device" });
        await flush();
        expect(names(w)).toEqual([
            "Follow this device",
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });

    test("sortThemes false keeps the order of `themes`", async () => {
        const w = build({ sortThemes: false });
        await flush();
        expect(names(w)).toEqual([
            "IBM Carbon",
            "Adobe Spectrum",
            "NHS England (patients)",
            "Light",
            "Dark",
        ]);
    });

    test("a title-cased slug is the name when there is no label", async () => {
        const w = build({ themes: ["zeta-one", "alpha-two", "mid"], themeLabels: {} });
        await flush();
        expect(names(w)).toEqual(["Alpha Two", "Mid", "Zeta One"]);
    });

    test("uses the page's language, and sorts again when it changes", async () => {
        document.documentElement.setAttribute("lang", "en");
        const w = build({ themes: ["a", "z"], themeLabels: { a: "Äpple", z: "Zebra" } });
        await flush();
        expect(names(w)).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(w)).toEqual(["Zebra", "Äpple"]);
    });

    test("the native select variant is sorted the same way", async () => {
        const w = build({ variant: "select" });
        await flush();
        const options = w.findAll("option").map((o) => o.text());
        expect(options).toEqual([
            "Adobe Spectrum",
            "Dark",
            "IBM Carbon",
            "Light",
            "NHS England (patients)",
        ]);
    });
});
