// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { initThemePicker } from "./theme-picker.client.js";

// Order of themes (spec/theme-picker, 2026-11-21): alphabetical by the name shown, in the page's language. The macro sorts
// with Nunjucks' plain sort; the client sorts again with Intl.Collator and when <html lang> changes.

const env = nunjucks.configure(path.dirname(fileURLToPath(import.meta.url)), {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});
const render = (opts: Record<string, unknown>) =>
    env.renderString(`{% from "./theme-picker.njk" import themePicker %}{{ themePicker(opts) }}`, {
        opts,
    });
const mount = (opts: Record<string, unknown>): HTMLElement => {
    document.body.innerHTML = render(opts);
    return document.body.querySelector("[data-lily-theme-picker-root]") as HTMLElement;
};

const labels = {
    "ibm-carbon": "IBM Carbon",
    "adobe-spectrum": "Adobe Spectrum",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    light: "Light",
    dark: "Dark",
};
const base = {
    label: "Theme",
    themesUrl: "/assets/themes/",
    themes: Object.keys(labels),
    themeLabels: labels,
};
const names = (root: Element, selector = ".theme-picker-option") =>
    [...root.querySelectorAll(selector)].map((o) => o.textContent?.trim());
const flush = () => new Promise<void>((r) => setTimeout(r, 0));
const key = (el: Element, k: string) =>
    el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true }));

const SORTED = ["Adobe Spectrum", "Dark", "IBM Carbon", "Light", "NHS England (patients)"];

beforeEach(() => {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("data-theme");
    document.head.querySelectorAll("link[data-lily-theme-picker]").forEach((n) => n.remove());
    document.body.innerHTML = "";
    localStorage.clear();
});
afterEach(() => {
    document.body.innerHTML = "";
});

describe("macro: order of themes", () => {
    test("lists the themes alphabetically by the name shown, in one list", () => {
        expect(names(mount(base))).toEqual(SORTED);
    });

    test("'Follow this device' is first, then the sorted themes", () => {
        expect(names(mount({ ...base, systemLabel: "Follow this device" }))).toEqual([
            "Follow this device",
            ...SORTED,
        ]);
    });

    test("sortThemes false keeps the order of `themes`, and says so to the client", () => {
        const root = mount({ ...base, sortThemes: false });
        expect(names(root)).toEqual([
            "IBM Carbon",
            "Adobe Spectrum",
            "NHS England (patients)",
            "Light",
            "Dark",
        ]);
        expect(root.getAttribute("data-lily-theme-picker-sort")).toBe("false");
        expect(mount(base).getAttribute("data-lily-theme-picker-sort")).toBe("true");
    });

    test("a title-cased slug, or a fallback label, is the name when there is no label", () => {
        const root = mount({
            label: "Theme",
            themesUrl: "/t/",
            themes: ["zeta-one", "alpha-two", "ibm-carbon"],
            fallbackLabels: { "ibm-carbon": "IBM Carbon" },
        });
        expect(names(root)).toEqual(["Alpha Two", "IBM Carbon", "Zeta One"]);
    });

    test("the native select variant is sorted the same way, with its separator after 'system'", () => {
        const root = mount({ ...base, variant: "select", systemLabel: "Follow this device" });
        expect(names(root, "option.theme-picker-option")).toEqual([
            "Follow this device",
            ...SORTED,
        ]);
        expect(root.querySelector("option + hr.theme-picker-separator")).not.toBeNull();
    });

    test("tells the client which theme the consumer gave first", () => {
        expect(mount(base).getAttribute("data-lily-theme-picker-first-theme")).toBe("ibm-carbon");
    });
});

describe("client: sorts again in the page's language", () => {
    const swedish = { a: "Äpple", z: "Zebra" };
    const swedishOpts = {
        label: "Theme",
        themesUrl: "/t/",
        themes: ["a", "z"],
        themeLabels: swedish,
    };

    test("the plain server sort puts Zebra first; Intl, in English, puts Äpple first", () => {
        const root = mount(swedishOpts);
        expect(names(root)).toEqual(["Zebra", "Äpple"]);
        document.documentElement.setAttribute("lang", "en");
        const controller = initThemePicker(root);
        expect(names(root)).toEqual(["Äpple", "Zebra"]);
        controller.destroy();
    });

    test("the option ids and the hidden input still follow the new order", () => {
        document.documentElement.setAttribute("lang", "en");
        const root = mount(swedishOpts);
        const controller = initThemePicker(root);
        const options = [...root.querySelectorAll<HTMLElement>(".theme-picker-option")];
        expect(options.map((o) => o.id)).toEqual(
            options.map((_, i) => `theme-picker-theme-option-${i}`),
        );
        expect(options.map((o) => o.getAttribute("data-value"))).toEqual(["a", "z"]);
        const button = root.querySelector(".theme-picker-button") as HTMLElement;
        const list = root.querySelector(".theme-picker-list") as HTMLElement;
        button.click();
        key(list, "Home");
        key(list, "Enter");
        expect(
            (root.querySelector("[data-lily-theme-picker-input]") as HTMLInputElement).value,
        ).toBe("a");
        controller.destroy();
    });

    test("sorts again when <html lang> changes", async () => {
        document.documentElement.setAttribute("lang", "en");
        const root = mount(swedishOpts);
        const controller = initThemePicker(root);
        expect(names(root)).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(root)).toEqual(["Zebra", "Äpple"]);
        controller.destroy();
    });

    test("waits for the list to close before moving options under the reader", async () => {
        document.documentElement.setAttribute("lang", "en");
        const root = mount(swedishOpts);
        const controller = initThemePicker(root);
        (root.querySelector(".theme-picker-button") as HTMLElement).click();
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(root)).toEqual(["Äpple", "Zebra"]);
        key(root.querySelector(".theme-picker-list") as HTMLElement, "Escape");
        expect(names(root)).toEqual(["Zebra", "Äpple"]);
        controller.destroy();
    });

    test("sortThemes false leaves the order alone, whatever the language", async () => {
        document.documentElement.setAttribute("lang", "en");
        const root = mount({ ...swedishOpts, sortThemes: false });
        const controller = initThemePicker(root);
        expect(names(root)).toEqual(["Äpple", "Zebra"]);
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(root)).toEqual(["Äpple", "Zebra"]);
        controller.destroy();
    });

    test("stops watching the language once destroyed", async () => {
        document.documentElement.setAttribute("lang", "en");
        const root = mount(swedishOpts);
        const controller = initThemePicker(root);
        controller.destroy();
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(root)).toEqual(["Äpple", "Zebra"]);
    });

    test("the native select sorts, keeps the chosen option, and keeps 'system' first with its separator", async () => {
        document.documentElement.setAttribute("lang", "en");
        const root = mount({
            ...swedishOpts,
            variant: "select",
            systemLabel: "Follow",
            value: "z",
        });
        const controller = initThemePicker(root);
        const select = root.querySelector("select") as HTMLSelectElement;
        expect(names(root, "option.theme-picker-option")).toEqual(["Follow", "Äpple", "Zebra"]);
        expect(select.value).toBe("z");
        expect(root.querySelector("option + hr.theme-picker-separator")).not.toBeNull();
        document.documentElement.setAttribute("lang", "sv");
        await flush();
        expect(names(root, "option.theme-picker-option")).toEqual(["Follow", "Zebra", "Äpple"]);
        expect(select.value).toBe("z");
        controller.destroy();
    });

    test("with no theme chosen and no 'light', the first theme the consumer gave applies, not the first listed", () => {
        const root = mount({ label: "Theme", themesUrl: "/t/", themes: ["zeta", "alpha"] });
        expect(names(root)).toEqual(["Alpha", "Zeta"]);
        const controller = initThemePicker(root);
        expect(document.documentElement.dataset.theme).toBe("zeta");
        controller.destroy();
    });
});
