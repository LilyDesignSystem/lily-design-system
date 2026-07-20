import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    GLOBE_WITH_MERIDIANS,
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

function button(): HTMLButtonElement {
    return document.body.querySelector<HTMLButtonElement>(".locale-select-button")!;
}

function list(): HTMLUListElement {
    return document.body.querySelector<HTMLUListElement>(".locale-select-list")!;
}

function options(): HTMLLIElement[] {
    return [...document.body.querySelectorAll<HTMLLIElement>(".locale-select-option")];
}

function press(el: Element, key: string): void {
    el.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

function click(el: Element): void {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

/** Open the listbox and click the option for `code`. */
function pick(code: string, locales: string[] = LOCALES): void {
    click(button());
    click(options()[locales.indexOf(code)]);
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
    test("§7.1 renders a div root containing a button that controls a listbox", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        const root = document.body.querySelector("div.locale-select")!;
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

    test("§7.1 the button renders the globe glyph, hidden from assistive tech", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        const icon = document.body.querySelector<HTMLElement>(".locale-select-icon")!;
        // U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15.
        // VS15 forces the text presentation so the glyph renders
        // monochrome, matching theme-select's ◑ rather than the blue
        // colour-emoji globe.
        expect(icon.textContent).toBe("\u{1F310}\uFE0E");
        expect(GLOBE_WITH_MERIDIANS).toBe("\u{1F310}\uFE0E");
        expect(Array.from(GLOBE_WITH_MERIDIANS)).toHaveLength(2);
        expect(icon.getAttribute("aria-hidden")).toBe("true");
        expect(icon.closest("button")).toBe(button());
    });

    test("§7.2 aria-label names the button and the listbox", async () => {
        mount({ label: "Choose language", locales: LOCALES.join(",") });
        await flush();
        expect(button().getAttribute("aria-label")).toBe("Choose language");
        expect(list().getAttribute("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the hidden input carries the supplied name and value", async () => {
        mount({ label: "Language", locales: LOCALES.join(","), name: "lang" });
        await flush();
        expect(options().length).toBe(LOCALES.length);
        const hidden = document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
        expect(hidden.name).toBe("lang");
        expect(hidden.value).toBe("en");
    });

    test("§7.3 no placeholder option is rendered any more", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        expect(document.body.querySelector(".locale-select-placeholder")).toBeNull();
        expect(document.body.querySelector("select")).toBeNull();
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(list().getAttribute("tabindex")).toBe("-1");
        click(button());
        expect(list().hasAttribute("hidden")).toBe(false);
        expect(button().getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active locale is the aria-selected option", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        click(button());
        const selected = document.body.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("lang")).toBe("en");
    });

    test("§7.4 clicking an option selects it, applies it, and closes the listbox", async () => {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        pick("en_US");
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe("en-US");
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(button().getAttribute("aria-expanded")).toBe("false");
        const hidden = document.body.querySelector<HTMLInputElement>('input[type="hidden"]')!;
        expect(hidden.value).toBe("en_US");
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form; the button and list do not", async () => {
        mount({ label: "Language", locales: "en,en_US,zh_Hant_TW" });
        await flush();
        const opts = options();
        expect(opts[0].getAttribute("lang")).toBe("en");
        expect(opts[1].getAttribute("lang")).toBe("en-US");
        expect(opts[2].getAttribute("lang")).toBe("zh-Hant-TW");
        expect(button().hasAttribute("lang")).toBe(false);
        expect(list().hasAttribute("lang")).toBe(false);
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

describe("<locale-select> — keyboard contract (APG listbox, §7.24–§7.28)", () => {
    async function openWith(key: string): Promise<void> {
        mount({ label: "Language", locales: LOCALES.join(",") });
        await flush();
        press(button(), key);
    }

    test("§7.24 ArrowDown, Enter and Space all open the listbox", async () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            await openWith(key);
            expect(list().hasAttribute("hidden")).toBe(false);
            document.body.replaceChildren();
        }
    });

    test("§7.24 opening moves focus to the listbox and activates the selected option", async () => {
        await openWith("ArrowDown");
        expect(document.activeElement).toBe(list());
        // "en" is the resolved initial value, index 0.
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        expect(options()[0].hasAttribute("data-active")).toBe(true);
    });

    test("§7.24 ArrowUp opens with the last option active", async () => {
        await openWith("ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[LOCALES.length - 1].id,
        );
    });

    test("§7.25 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        await openWith("ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        // Clamp at the top.
        press(list(), "ArrowUp");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
        press(list(), "ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[1].id);
        // Clamp at the bottom.
        for (let i = 0; i < LOCALES.length + 2; i++) press(list(), "ArrowDown");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[LOCALES.length - 1].id,
        );
    });

    test("§7.25 Home and End jump to the first and last option", async () => {
        await openWith("ArrowDown");
        press(list(), "End");
        expect(list().getAttribute("aria-activedescendant")).toBe(
            options()[LOCALES.length - 1].id,
        );
        press(list(), "Home");
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("§7.26 Enter selects the active option, applies it, closes, and refocuses the button", async () => {
        await openWith("ArrowDown");
        press(list(), "ArrowDown");
        press(list(), "Enter");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(button().getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.getAttribute("lang")).toBe("en-US");
        expect(document.activeElement).toBe(button());
        expect(list().hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("§7.26 Space also selects the active option", async () => {
        await openWith("ArrowDown");
        press(list(), "End");
        press(list(), " ");
        await flush();
        // Last locale is "ar" — RTL.
        expect(document.documentElement.getAttribute("lang")).toBe("ar");
        expect(document.documentElement.getAttribute("dir")).toBe("rtl");
        expect(list().hasAttribute("hidden")).toBe(true);
    });

    test("§7.27 Escape closes without changing the locale and refocuses the button", async () => {
        await openWith("ArrowDown");
        press(list(), "ArrowDown");
        press(list(), "Escape");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.getAttribute("lang")).toBe("en");
        expect(document.activeElement).toBe(button());
    });

    test("§7.27 Tab closes without stealing focus back to the button", async () => {
        await openWith("ArrowDown");
        press(list(), "Tab");
        await flush();
        expect(list().hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button());
    });

    test("§7.28 typeahead moves the active descendant by label prefix", async () => {
        await openWith("ArrowDown");
        press(list(), "f");
        // "French" is index 2 in LOCALES.
        expect(list().getAttribute("aria-activedescendant")).toBe(options()[2].id);
    });

    test("§7.28 a click outside the root closes the listbox", async () => {
        await openWith("ArrowDown");
        expect(list().hasAttribute("hidden")).toBe(false);
        click(document.body);
        expect(list().hasAttribute("hidden")).toBe(true);
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
        pick("en_US"); // consumer form
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
        expect(onChange).toHaveBeenLastCalledWith("en_US");

        pick("ar");
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
        pick("fr");
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
        expect(el.querySelectorAll(".locale-select-option").length).toBe(3);
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

    test("§7.23 the consumer class is appended to the root class hook", async () => {
        mount({ label: "Language", locales: "en,fr", class: "my-picker" });
        await flush();
        const root = document.body.querySelector("div.locale-select")!;
        expect(root.className).toBe("locale-select my-picker");
    });

    test("§7.23 option ids are unique across instances", async () => {
        mount({ label: "A", locales: "en,fr" });
        mount({ label: "B", locales: "en,fr" });
        await flush();
        const ids = options().map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});

describe("<locale-select> — custom rendering by subclass (§7.29)", () => {
    class FlagLocaleSelect extends LocaleSelect {
        renderButtonContent(): Node {
            const span = document.createElement("span");
            span.setAttribute("data-testid", "custom");
            span.setAttribute("data-open", String(this.open));
            span.setAttribute("data-value", this.value);
            span.setAttribute("data-label-fr", this.labelFor("fr"));
            span.textContent = "custom glyph";
            return span;
        }
    }
    if (!customElements.get("flag-locale-select")) {
        customElements.define("flag-locale-select", FlagLocaleSelect);
    }

    test("§7.29 renderButtonContent replaces the glyph and keeps the aria wiring", async () => {
        const el = document.createElement("flag-locale-select") as FlagLocaleSelect;
        el.setAttribute("label", "Language");
        el.setAttribute("locales", LOCALES.join(","));
        el.setAttribute("value", "fr");
        document.body.appendChild(el);
        await flush();

        const custom = el.querySelector<HTMLElement>('[data-testid="custom"]')!;
        expect(custom.closest("button")?.className).toBe("locale-select-button");
        expect(el.querySelector(".locale-select-icon")).toBeNull();
        expect(custom.getAttribute("data-open")).toBe("false");
        expect(custom.getAttribute("data-value")).toBe("fr");
        expect(custom.getAttribute("data-label-fr")).toBe("French");

        const btn = el.querySelector<HTMLButtonElement>(".locale-select-button")!;
        expect(btn.getAttribute("aria-haspopup")).toBe("listbox");
        expect(btn.getAttribute("aria-label")).toBe("Language");
        expect(el.querySelector(`#${btn.getAttribute("aria-controls")}`)).not.toBeNull();
    });

    test("§7.29 renderButtonContent re-runs when value or open changes", async () => {
        const el = document.createElement("flag-locale-select") as FlagLocaleSelect;
        el.setAttribute("label", "Language");
        el.setAttribute("locales", LOCALES.join(","));
        document.body.appendChild(el);
        await flush();
        const read = (attr: string) =>
            el.querySelector('[data-testid="custom"]')!.getAttribute(attr);

        expect(read("data-value")).toBe("en");

        // A value change must refresh the button content, mirroring the
        // reactive `children` snippet in the other frameworks.
        el.value = "fr_CA";
        await flush();
        expect(read("data-value")).toBe("fr_CA");

        // So must opening the listbox.
        el.openList();
        expect(read("data-open")).toBe("true");
        el.closeList();
        expect(read("data-open")).toBe("false");
    });

    test("§7.29 a subclass still fires localechange through the base lifecycle", async () => {
        const el = document.createElement("flag-locale-select") as FlagLocaleSelect;
        el.setAttribute("label", "Language");
        el.setAttribute("locales", LOCALES.join(","));
        document.body.appendChild(el);
        await flush();
        let detail: { locale: string } | undefined;
        el.addEventListener("localechange", (e) => {
            detail = (e as CustomEvent<{ locale: string }>).detail;
        });
        el.value = "ar";
        expect(detail).toEqual({ locale: "ar" });
    });
});
