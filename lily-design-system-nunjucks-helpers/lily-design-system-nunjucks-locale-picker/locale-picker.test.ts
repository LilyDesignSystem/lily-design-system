// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    bcp47LocaleTag,
    initLocalePicker,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-picker.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, {
    autoescape: true,
    throwOnUndefined: false,
    trimBlocks: true,
    lstripBlocks: true,
});

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

function renderMacro(opts: Record<string, unknown>): string {
    const src =
        `{% from "./locale-picker.njk" import localePicker %}` +
        `{{ localePicker(opts) }}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-locale-picker-root]",
    ) as HTMLElement;
}

function resetRoot(): void {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}

beforeEach(() => {
    resetRoot();
    document.body.innerHTML = "";
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    resetRoot();
});

describe("LocalePicker — macro markup contract (§7.1)", () => {
    test("§7.1 macro renders a <fieldset> with role=radiogroup", () => {
        const html = renderMacro({ label: "Language", locales: LOCALES });
        const root = mountIntoBody(html);
        expect(root.tagName).toBe("FIELDSET");
        expect(root.getAttribute("role")).toBe("radiogroup");
    });

    test("§7.2 aria-label is the supplied label", () => {
        const html = renderMacro({ label: "Choose language", locales: LOCALES });
        const root = mountIntoBody(html);
        expect(root.getAttribute("aria-label")).toBe("Choose language");
    });

    test("§7.3 one radio per locale, sharing the supplied name", () => {
        const html = renderMacro({
            label: "Language",
            locales: LOCALES,
            name: "lang",
        });
        const root = mountIntoBody(html);
        const radios = Array.from(
            root.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        );
        expect(radios.length).toBe(LOCALES.length);
        expect(radios.every((r) => r.name === "lang")).toBe(true);
    });

    test("§7.4 each radio carries the locale code as its value", () => {
        const html = renderMacro({ label: "Language", locales: LOCALES });
        const root = mountIntoBody(html);
        const values = Array.from(
            root.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        ).map((r) => r.value);
        expect(values).toEqual(LOCALES);
    });

    test("§7.5 each option <label> carries lang in BCP 47 hyphen form", () => {
        const html = renderMacro({
            label: "Language",
            locales: ["en", "en_US", "zh_Hant_TW"],
        });
        const root = mountIntoBody(html);
        const labels = Array.from(
            root.querySelectorAll<HTMLElement>(".locale-picker-option"),
        );
        expect(labels[0].getAttribute("lang")).toBe("en");
        expect(labels[1].getAttribute("lang")).toBe("en-US");
        expect(labels[2].getAttribute("lang")).toBe("zh-Hant-TW");
    });

    test("§7.6 localeLabels override the option text; missing entries fall back to code", () => {
        const html = renderMacro({
            label: "Language",
            locales: ["en", "fr", "xx"],
            localeLabels: { en: "English", fr: "Français" },
        });
        const root = mountIntoBody(html);
        const text = root.textContent || "";
        expect(text).toMatch(/English/);
        expect(text).toMatch(/Français/);
        expect(text).toMatch(/xx/);
    });
});

describe("LocalePicker — pure helpers (§7.7–§7.12)", () => {
    test("§7.7 bcp47LocaleTag converts en_US to en-US", () => {
        expect(bcp47LocaleTag("en_US")).toBe("en-US");
    });

    test("§7.8 bcp47LocaleTag converts zh_Hant_TW to zh-Hant-TW", () => {
        expect(bcp47LocaleTag("zh_Hant_TW")).toBe("zh-Hant-TW");
    });

    test("§7.9 bcp47LocaleTag leaves en untouched", () => {
        expect(bcp47LocaleTag("en")).toBe("en");
    });

    test("§7.10 isRtlLocale returns true for ar, he_IL, and uz_Arab_AF", () => {
        expect(isRtlLocale("ar")).toBe(true);
        expect(isRtlLocale("he_IL")).toBe(true);
        expect(isRtlLocale("uz_Arab_AF")).toBe(true);
    });

    test("§7.11 isRtlLocale returns false for en and fr_CA", () => {
        expect(isRtlLocale("en")).toBe(false);
        expect(isRtlLocale("fr_CA")).toBe(false);
    });

    test("§7.12 localeName resolves en_US via the built-in table", () => {
        expect(localeName("en_US")).toBe("English (United States)");
    });
});

describe("LocalePicker — client.js lifecycle (§7.13–§7.17)", () => {
    test("§7.13 init sets target.lang to the BCP 47 form of the resolved locale", () => {
        const html = renderMacro({
            label: "Language",
            locales: LOCALES,
            defaultValue: "en_US",
        });
        const root = mountIntoBody(html);
        initLocalePicker(root);
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 init sets dir=rtl for an RTL initial locale", () => {
        const html = renderMacro({
            label: "Language",
            locales: ["ar", "en"],
            defaultValue: "ar",
        });
        const root = mountIntoBody(html);
        initLocalePicker(root);
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.15 when applyDir=false, dir is never written", () => {
        const html = renderMacro({
            label: "Language",
            locales: ["ar", "en"],
            defaultValue: "ar",
            applyDir: false,
        });
        const root = mountIntoBody(html);
        initLocalePicker(root);
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 a radio change updates lang, dir, and fires onChange with consumer-form code", () => {
        const onChange = vi.fn();
        const html = renderMacro({
            label: "Language",
            locales: LOCALES,
            defaultValue: "en",
        });
        const root = mountIntoBody(html);
        initLocalePicker(root, { onChange });
        const radios = Array.from(
            root.querySelectorAll<HTMLInputElement>('input[type="radio"]'),
        );
        const enUS = radios.find((r) => r.value === "en_US")!;
        enUS.checked = true;
        enUS.dispatchEvent(new Event("change", { bubbles: true }));
        expect(document.documentElement.lang).toBe("en-US");
        expect(onChange).toHaveBeenLastCalledWith("en_US");

        const ar = radios.find((r) => r.value === "ar")!;
        ar.checked = true;
        ar.dispatchEvent(new Event("change", { bubbles: true }));
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenLastCalledWith("ar");
    });

    test("§7.17 a custom target receives lang and dir", () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        const html = renderMacro({
            label: "Language",
            locales: ["ar", "en"],
            defaultValue: "ar",
        });
        const root = mountIntoBody(html);
        initLocalePicker(root, { target });
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
        expect(document.documentElement.hasAttribute("lang")).toBe(false);
        target.remove();
    });
});

describe("LocalePicker — initial-value resolution (§7.18–§7.21)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh init", () => {
        const html = renderMacro({
            label: "Language",
            locales: LOCALES,
            storageKey: "lily-locale",
        });
        const root = mountIntoBody(html);
        const ctrl = initLocalePicker(root);
        ctrl.setLocale("fr");
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        ctrl.destroy();
        resetRoot();

        const html2 = renderMacro({
            label: "Language",
            locales: LOCALES,
            storageKey: "lily-locale",
        });
        const root2 = mountIntoBody(html2);
        initLocalePicker(root2);
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value (rendered checked) wins over storage and defaults", () => {
        localStorage.setItem("lily-locale", "ar");
        const html = renderMacro({
            label: "Language",
            locales: LOCALES,
            value: "en",
            storageKey: "lily-locale",
            defaultValue: "fr",
        });
        const root = mountIntoBody(html);
        initLocalePicker(root);
        expect(document.documentElement.lang).toBe("en");
    });

    test("§7.20 navigator detection resolves exact match", () => {
        const original = Object.getOwnPropertyDescriptor(
            window.navigator,
            "languages",
        );
        Object.defineProperty(window.navigator, "languages", {
            configurable: true,
            get: () => ["fr-CA", "fr"],
        });
        const html = renderMacro({
            label: "Language",
            locales: ["en", "fr_CA", "fr"],
            detectFromNavigator: true,
        });
        const root = mountIntoBody(html);
        initLocalePicker(root);
        expect(document.documentElement.lang).toBe("fr-CA");
        if (original)
            Object.defineProperty(window.navigator, "languages", original);
    });

    test("§7.21 navigator detection falls back to language-only match", () => {
        const original = Object.getOwnPropertyDescriptor(
            window.navigator,
            "languages",
        );
        Object.defineProperty(window.navigator, "languages", {
            configurable: true,
            get: () => ["fr-CA"],
        });
        const html = renderMacro({
            label: "Language",
            locales: ["en", "fr"],
            detectFromNavigator: true,
        });
        const root = mountIntoBody(html);
        initLocalePicker(root);
        expect(document.documentElement.lang).toBe("fr");
        if (original)
            Object.defineProperty(window.navigator, "languages", original);
    });

    test("matchNavigatorLanguage exact match wins", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe(
            "fr_CA",
        );
    });

    test("matchNavigatorLanguage returns empty when no match", () => {
        expect(matchNavigatorLanguage(["xx-YY"], ["en", "fr"])).toBe("");
    });
});

describe("LocalePicker — spread + autoInit (§7.22–§7.23)", () => {
    test("§7.22 extra attributes spread onto the <fieldset> root", () => {
        const html = renderMacro({
            label: "Language",
            locales: LOCALES,
            attributes: { "data-testid": "lp" },
        });
        const root = mountIntoBody(html);
        expect(root.getAttribute("data-testid")).toBe("lp");
    });

    test("§7.23 autoInit wires every root on the page", () => {
        const html1 = renderMacro({
            label: "A",
            locales: ["en", "fr"],
            name: "a",
            defaultValue: "fr",
        });
        const html2 = renderMacro({
            label: "B",
            locales: ["en", "ar"],
            name: "b",
            defaultValue: "ar",
        });
        document.body.innerHTML = html1 + html2;
        const controllers = autoInit();
        expect(controllers.length).toBe(2);
        // Last init wins for the shared documentElement; both should have run.
        expect(document.documentElement.lang).toBe("ar");
    });
});
