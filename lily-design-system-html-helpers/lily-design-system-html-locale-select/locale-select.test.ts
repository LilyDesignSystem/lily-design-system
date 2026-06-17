import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-select.js";

// Ensure the custom element is registered exactly once.
if (typeof customElements !== "undefined" && !customElements.get("locale-select")) {
    customElements.define("locale-select", LocaleSelect);
}

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}

function mount(attrs: Record<string, string>): LocaleSelect {
    const el = document.createElement("locale-select") as LocaleSelect;
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.body.appendChild(el);
    return el;
}

function chooseOption(select: HTMLSelectElement, value: string): void {
    select.value = value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
}

beforeEach(() => {
    resetRoot();
    document.body.replaceChildren();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    resetRoot();
    document.body.replaceChildren();
});

describe("<locale-select> — pure helpers (§7.2)", () => {
    test("§7.7 bcp47LocaleTag converts en_US to en-US", () => {
        expect(bcp47LocaleTag("en_US")).toBe("en-US");
    });

    test("§7.8 bcp47LocaleTag converts zh_Hant_TW to zh-Hant-TW", () => {
        expect(bcp47LocaleTag("zh_Hant_TW")).toBe("zh-Hant-TW");
    });

    test("§7.9 bcp47LocaleTag leaves en untouched", () => {
        expect(bcp47LocaleTag("en")).toBe("en");
    });

    test("§7.10 RTL detection for ar, he_IL, and Arabic-script Uzbek", () => {
        expect(isRtlLocale("ar")).toBe(true);
        expect(isRtlLocale("he_IL")).toBe(true);
        expect(isRtlLocale("uz_Arab_AF")).toBe(true);
    });

    test("§7.11 LTR detection for en and fr_CA", () => {
        expect(isRtlLocale("en")).toBe(false);
        expect(isRtlLocale("fr_CA")).toBe(false);
    });

    test("§7.12 localeName resolves en_US via the built-in table", () => {
        expect(localeName("en_US")).toBe("English (United States)");
    });

    test("matchNavigatorLanguage exact match wins", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe("fr_CA");
    });

    test("matchNavigatorLanguage language-only fallback", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr"])).toBe("fr");
    });
});

describe("<locale-select> — markup contract (§7.1)", () => {
    test("§7.1 renders a native <select> root", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        const select = document.body.querySelector("select.locale-select")!;
        expect(select.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", async () => {
        mount({ label: "Choose language", locales: LOCALES.join(",") });
        await flush();
        const select = document.body.querySelector("select.locale-select")!;
        expect(select.getAttribute("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the select carries the supplied name", async () => {
        mount({ label: "Language", locales: LOCALES.join(","), name: "lang" });
        await flush();
        const options = document.body.querySelectorAll<HTMLOptionElement>("option");
        expect(options.length).toBe(LOCALES.length);
        const select = document.body.querySelector<HTMLSelectElement>("select.locale-select")!;
        expect(select.name).toBe("lang");
    });

    test("§7.4 each option carries the locale code as its value", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        const options = document.body.querySelectorAll<HTMLOptionElement>("option");
        expect([...options].map((o) => o.value)).toEqual(LOCALES);
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", async () => {
        mount({ label: "Language", locales: "en,en_US,zh_Hant_TW" });
        await flush();
        const labels = document.body.querySelectorAll<HTMLElement>(".locale-select-option");
        expect(labels[0].getAttribute("lang")).toBe("en");
        expect(labels[1].getAttribute("lang")).toBe("en-US");
        expect(labels[2].getAttribute("lang")).toBe("zh-Hant-TW");
    });

    test("§7.6 default rendering uses localeLabels override when supplied", async () => {
        mount({
            label: "Language",
            locales: "en,fr",
            "locale-labels": JSON.stringify({ en: "English", fr: "Français" }),
        });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("English");
        expect(text).toContain("Français");
    });

    test("§7.6 falls back to defaultLocaleLabels when locale-labels missing", async () => {
        mount({ label: "Language", locales: "en_US" });
        await flush();
        const text = document.body.textContent ?? "";
        expect(text).toContain("English (United States)");
    });
});

describe("<locale-select> — locale application (§7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        mount({
            label: "Language",
            locales: LOCALES.join(","),
            "default-value": "en_US",
        });
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        mount({
            label: "Language",
            locales: "ar,en",
            "default-value": "ar",
        });
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        mount({
            label: "Language",
            locales: "en,ar",
            "default-value": "en",
        });
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when apply-dir=false, dir is never written", async () => {
        mount({
            label: "Language",
            locales: "ar,en",
            "default-value": "ar",
            "apply-dir": "false",
        });
        await flush();
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 selecting a different option updates lang, dir, and fires localechange (consumer form)", async () => {
        const onChange = vi.fn();
        const el = mount({
            label: "Language",
            locales: LOCALES.join(","),
            "default-value": "en",
        });
        el.addEventListener("localechange", (e) => {
            onChange((e as CustomEvent<{ locale: string }>).detail.locale);
        });
        await flush();
        const select = document.body.querySelector<HTMLSelectElement>("select.locale-select")!;
        chooseOption(select, "en_US"); // consumer form
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
        expect(onChange).toHaveBeenLastCalledWith("en_US");

        chooseOption(select, "ar");
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenLastCalledWith("ar");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        const el = document.createElement("locale-select") as LocaleSelect;
        el.setAttribute("label", "Language");
        el.setAttribute("locales", "ar,en");
        el.setAttribute("default-value", "ar");
        el.target = target;
        document.body.appendChild(el);
        await flush();
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
        // Document root must remain untouched.
        expect(document.documentElement.hasAttribute("lang")).toBe(false);
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        target.remove();
    });
});

describe("<locale-select> — initial-value resolution (§7.4)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
        const first = mount({
            label: "Language",
            locales: LOCALES.join(","),
            "storage-key": "lily-locale",
        });
        await flush();
        const select = document.body.querySelector<HTMLSelectElement>("select.locale-select")!;
        chooseOption(select, "fr");
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        first.remove();
        resetRoot();

        mount({
            label: "Language",
            locales: LOCALES.join(","),
            "storage-key": "lily-locale",
        });
        await flush();
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value attribute wins over storage and defaults", async () => {
        localStorage.setItem("lily-locale", "ar");
        mount({
            label: "Language",
            locales: LOCALES.join(","),
            value: "en",
            "storage-key": "lily-locale",
            "default-value": "fr",
        });
        await flush();
        expect(document.documentElement.lang).toBe("en");
    });

    test("§7.20 navigator detection resolves exact match", async () => {
        const original = Object.getOwnPropertyDescriptor(
            window.navigator,
            "languages",
        );
        Object.defineProperty(window.navigator, "languages", {
            configurable: true,
            get: () => ["fr-CA", "fr"],
        });
        mount({
            label: "Language",
            locales: "en,fr_CA,fr",
            "detect-from-navigator": "",
        });
        await flush();
        expect(document.documentElement.lang).toBe("fr-CA");
        if (original) Object.defineProperty(window.navigator, "languages", original);
    });

    test("§7.21 navigator detection falls back to language-only match", async () => {
        const original = Object.getOwnPropertyDescriptor(
            window.navigator,
            "languages",
        );
        Object.defineProperty(window.navigator, "languages", {
            configurable: true,
            get: () => ["fr-CA"],
        });
        mount({
            label: "Language",
            locales: "en,fr",
            "detect-from-navigator": "",
        });
        await flush();
        expect(document.documentElement.lang).toBe("fr");
        if (original) Object.defineProperty(window.navigator, "languages", original);
    });
});

describe("<locale-select> — property API (§7.5)", () => {
    test("§7.22 setting el.locales as an array mirrors the CSV attribute", async () => {
        const el = mount({ label: "Language", locales: "en,fr" }) as LocaleSelect;
        await flush();
        el.locales = ["en", "fr", "ar"];
        await flush();
        expect(el.getAttribute("locales")).toBe("en,fr,ar");
        expect(el.querySelectorAll("option").length).toBe(3);
    });

    test("§7.23 setting el.localeLabels as an object mirrors the JSON attribute", async () => {
        const el = mount({ label: "Language", locales: "en,fr" }) as LocaleSelect;
        await flush();
        el.localeLabels = { en: "English", fr: "Français" };
        await flush();
        expect(el.getAttribute("locale-labels")).toBe(
            JSON.stringify({ en: "English", fr: "Français" }),
        );
        const text = document.body.textContent ?? "";
        expect(text).toContain("Français");
    });
});
