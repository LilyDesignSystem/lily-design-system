// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
    autoInit,
    bcp47LocaleTag,
    GLOBE_WITH_MERIDIANS,
    initLocaleSelect,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./locale-select.client.js";

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
        `{% from "./locale-select.njk" import localeSelect %}` +
        `{{ localeSelect(opts) }}`;
    return env.renderString(src, { opts });
}

function renderMacroWithCaller(
    opts: Record<string, unknown>,
    body: string,
): string {
    const src =
        `{% from "./locale-select.njk" import localeSelect %}` +
        `{% call localeSelect(opts) %}${body}{% endcall %}`;
    return env.renderString(src, { opts });
}

function mountIntoBody(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector(
        "[data-lily-locale-select-root]",
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
        button: root.querySelector(".locale-select-button") as HTMLButtonElement,
        list: root.querySelector(".locale-select-list") as HTMLElement,
        options: Array.from(
            root.querySelectorAll<HTMLElement>(".locale-select-option"),
        ),
        input: root.querySelector(
            "[data-lily-locale-select-input]",
        ) as HTMLInputElement,
    };
}

/** Render + mount + init in one step, returning the DOM parts. */
function setup(
    opts: Record<string, unknown> = {},
    initOpts: Record<string, unknown> = {},
) {
    const root = mountIntoBody(
        renderMacro({ label: "Language", locales: LOCALES, ...opts }),
    );
    const controller = initLocaleSelect(root, initOpts);
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

describe("LocaleSelect — macro markup contract (§7.1–§7.6)", () => {
    test("§7.1 macro renders a div root containing a button that controls a listbox", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("locale-select")).toBe(true);

        const { button, list } = partsOf(root);
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(button.getAttribute("aria-controls")).toBe(list.id);
        expect(list.getAttribute("role")).toBe("listbox");
        expect(list.getAttribute("tabindex")).toBe("-1");
    });

    test("§7.1 the button renders the globe glyph, hidden from assistive tech", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        const icon = root.querySelector(".locale-select-icon") as HTMLElement;
        expect(icon.textContent).toBe(GLOBE_WITH_MERIDIANS);
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.1 the glyph carries U+FE0E so it renders monochrome, not as a colour emoji", () => {
        // Two codepoints: U+1F310 GLOBE WITH MERIDIANS, then U+FE0E
        // VARIATION SELECTOR-15 requesting the text presentation.
        expect(Array.from(GLOBE_WITH_MERIDIANS).map((c) => c.codePointAt(0))).toEqual([
            0x1f310, 0xfe0e,
        ]);

        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        const icon = root.querySelector(".locale-select-icon") as HTMLElement;
        expect(
            Array.from(icon.textContent || "").map((c) => c.codePointAt(0)),
        ).toEqual([0x1f310, 0xfe0e]);
    });

    test("§7.2 aria-label names both the button and the listbox", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Choose language", locales: LOCALES }),
        );
        const { button, list } = partsOf(root);
        expect(button.getAttribute("aria-label")).toBe("Choose language");
        expect(list.getAttribute("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the hidden input carries the supplied name", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES, name: "lang" }),
        );
        const { options, input } = partsOf(root);
        expect(options.length).toBe(LOCALES.length);
        expect(input.type).toBe("hidden");
        expect(input.name).toBe("lang");
    });

    test("§7.4 each option carries the locale code on data-value and a stable unique id", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        const { options } = partsOf(root);
        expect(options.map((o) => o.getAttribute("data-value"))).toEqual(
            LOCALES,
        );

        const ids = options.map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(ids.every((id) => id.length > 0)).toBe(true);

        // Deterministic across renders: no Math.random / Date.now.
        const again = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        expect(partsOf(again).options.map((o) => o.id)).toEqual(ids);
    });

    test("§7.4 an explicit id namespaces the listbox and its options", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Language",
                locales: LOCALES,
                id: "footer-locale",
            }),
        );
        const { list, options } = partsOf(root);
        expect(list.id).toBe("footer-locale-list");
        expect(options[0].id).toBe("footer-locale-option-0");
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form; the button and list do not", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Language",
                locales: ["en", "en_US", "zh_Hant_TW"],
            }),
        );
        const { button, list, options } = partsOf(root);
        expect(options[0].getAttribute("lang")).toBe("en");
        expect(options[1].getAttribute("lang")).toBe("en-US");
        expect(options[2].getAttribute("lang")).toBe("zh-Hant-TW");
        // Chrome, not content: no lang on the button or the listbox itself.
        expect(button.hasAttribute("lang")).toBe(false);
        expect(list.hasAttribute("lang")).toBe(false);
    });

    test("§7.6 localeLabels override the option text; missing entries fall back to code", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Language",
                locales: ["en", "fr", "xx"],
                localeLabels: { en: "English", fr: "Français" },
            }),
        );
        const text = root.textContent || "";
        expect(text).toMatch(/English/);
        expect(text).toMatch(/Français/);
        expect(text).toMatch(/xx/);
    });
});

describe("LocaleSelect — server-rendered listbox state (§7.28–§7.30)", () => {
    // These replace the retired "only the placeholder is selected"
    // regression guard: there is no placeholder and no <select> any more,
    // so the meaningful pre-hydration invariants are (a) the listbox is
    // closed and (b) exactly one option is marked selected.

    test("§7.28 the listbox renders hidden and the button collapsed, before any JS runs", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES, value: "fr" }),
        );
        const { button, list } = partsOf(root);
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(list.hasAttribute("aria-activedescendant")).toBe(false);
        expect(root.querySelector("[data-active]")).toBeNull();
    });

    test("§7.29 exactly one option is aria-selected in the server markup, and it is opts.value", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES, value: "fr" }),
        );
        const { options } = partsOf(root);
        const selected = options.filter(
            (o) => o.getAttribute("aria-selected") === "true",
        );
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("data-value")).toBe("fr");
        expect(options.every((o) => o.hasAttribute("aria-selected"))).toBe(true);
    });

    test("§7.29 with no value, the server marks 'en' selected; without 'en', the first locale", () => {
        const withEn = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        expect(
            partsOf(withEn)
                .options.find((o) => o.getAttribute("aria-selected") === "true")!
                .getAttribute("data-value"),
        ).toBe("en");

        const withoutEn = mountIntoBody(
            renderMacro({ label: "Language", locales: ["fr", "ar"] }),
        );
        expect(
            partsOf(withoutEn)
                .options.find((o) => o.getAttribute("aria-selected") === "true")!
                .getAttribute("data-value"),
        ).toBe("fr");
    });

    test("§7.30 the hidden input is pre-filled server-side so a no-JS form submit still carries a locale", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES, value: "fr_CA" }),
        );
        expect(partsOf(root).input.value).toBe("fr_CA");
    });
});

describe("LocaleSelect — keyboard contract (APG listbox, §7.31–§7.35)", () => {
    test("§7.31 ArrowDown, Enter and Space all open the listbox and focus it", () => {
        for (const k of ["ArrowDown", "Enter", " "]) {
            const { button, list } = setup();
            key(button, k);
            expect(list.hasAttribute("hidden")).toBe(false);
            expect(button.getAttribute("aria-expanded")).toBe("true");
            expect(document.activeElement).toBe(list);
        }
    });

    test("§7.31 ArrowUp opens with the last option active", () => {
        const { button, list, options } = setup();
        key(button, "ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[LOCALES.length - 1].id,
        );
    });

    test("§7.32 opening puts the active descendant on the selected locale", () => {
        // "en" resolves as the initial locale, so it is index 0.
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
        expect(options[0].hasAttribute("data-active")).toBe(true);
    });

    test("§7.32 ArrowDown / ArrowUp move the active descendant and clamp", () => {
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
            options[LOCALES.length - 1].id,
        );
    });

    test("§7.32 Home and End jump to the first and last option", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "End");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            options[LOCALES.length - 1].id,
        );
        key(list, "Home");
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    test("§7.33 Enter selects the active option, applies it, closes, and returns focus", () => {
        const onChange = vi.fn();
        const { button, list, input } = setup({}, { onChange });
        key(button, "ArrowDown");
        key(list, "ArrowDown");
        key(list, "Enter");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.lang).toBe("en-US");
        // onChange and the hidden input carry the consumer-form code.
        expect(input.value).toBe("en_US");
        expect(onChange).toHaveBeenLastCalledWith("en_US");
        expect(document.activeElement).toBe(button);
    });

    test("§7.33 Space also selects the active option", () => {
        const { button, list } = setup();
        key(button, "ArrowDown");
        key(list, "End");
        key(list, " ");
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.34 Escape closes and returns focus without changing the locale", () => {
        const onChange = vi.fn();
        const { button, list } = setup({}, { onChange });
        onChange.mockClear(); // ignore the initial apply
        key(button, "ArrowDown");
        key(list, "ArrowDown");
        key(list, "Escape");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.lang).toBe("en");
        expect(onChange).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(button);
    });

    test("§7.34 Tab closes without stealing focus back to the button", () => {
        const { button, list } = setup();
        key(button, "ArrowDown");
        expect(document.activeElement).toBe(list);
        key(list, "Tab");
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button);
    });

    test("§7.35 typeahead moves the active descendant by label prefix", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "f"); // "fr" is index 2
        expect(list.getAttribute("aria-activedescendant")).toBe(options[2].id);
    });

    test("§7.35 the typeahead buffer accumulates, then resets after 500ms", () => {
        vi.useFakeTimers();
        try {
            const { button, list, options } = setup();
            key(button, "ArrowDown");
            // "fr_" matches only "fr_CA".
            key(list, "f");
            key(list, "r");
            key(list, "_");
            expect(list.getAttribute("aria-activedescendant")).toBe(
                options[3].id,
            );
            // After the reset window, a lone "a" starts a fresh search.
            vi.advanceTimersByTime(600);
            key(list, "a");
            expect(list.getAttribute("aria-activedescendant")).toBe(
                options[4].id,
            );
        } finally {
            vi.useRealTimers();
        }
    });

    test("§7.35 modifier chords are not treated as typeahead", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "f", { metaKey: true });
        expect(list.getAttribute("aria-activedescendant")).toBe(options[0].id);
    });

    test("§7.35 clicking an option selects and applies it", () => {
        const { button, list, options } = setup();
        click(button);
        click(options[4]);
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.35 clicking the button toggles the listbox shut again", () => {
        const { button, list } = setup();
        click(button);
        expect(list.hasAttribute("hidden")).toBe(false);
        click(button);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.35 clicking outside the root closes the listbox", () => {
        const { button, list } = setup();
        const outside = document.createElement("p");
        document.body.appendChild(outside);
        click(button);
        expect(list.hasAttribute("hidden")).toBe(false);
        click(outside);
        expect(list.hasAttribute("hidden")).toBe(true);
        outside.remove();
    });

    test("§7.35 focus leaving the root closes the listbox", () => {
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

    test("§7.35 aria-selected follows the applied locale, not merely the active option", () => {
        const { button, list, options } = setup();
        key(button, "ArrowDown");
        key(list, "ArrowDown"); // active = en_US, but not chosen yet
        expect(options[0].getAttribute("aria-selected")).toBe("true");
        expect(options[1].getAttribute("aria-selected")).toBe("false");
        key(list, "Enter");
        expect(options[0].getAttribute("aria-selected")).toBe("false");
        expect(options[1].getAttribute("aria-selected")).toBe("true");
    });
});

describe("LocaleSelect — pure helpers (§7.7–§7.12)", () => {
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

describe("LocaleSelect — client.js lifecycle (§7.13–§7.17)", () => {
    test("§7.13 init sets target.lang to the BCP 47 form of the resolved locale", () => {
        setup({ defaultValue: "en_US" });
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 init sets dir=rtl for an RTL initial locale", () => {
        setup({ locales: ["ar", "en"], defaultValue: "ar" });
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.15 when applyDir=false, dir is never written", () => {
        setup({ locales: ["ar", "en"], defaultValue: "ar", applyDir: false });
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 choosing an option updates lang, dir, and fires onChange with consumer-form code", () => {
        const onChange = vi.fn();
        const { button, options } = setup({ defaultValue: "en" }, { onChange });

        click(button);
        click(options[1]); // en_US
        expect(document.documentElement.lang).toBe("en-US");
        expect(onChange).toHaveBeenLastCalledWith("en_US");

        click(button);
        click(options[4]); // ar
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenLastCalledWith("ar");
    });

    test("§7.17 a custom target receives lang and dir", () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        const root = mountIntoBody(
            renderMacro({
                label: "Language",
                locales: ["ar", "en"],
                defaultValue: "ar",
            }),
        );
        // mountIntoBody wiped the body, so re-attach the target.
        document.body.appendChild(target);
        initLocaleSelect(root, { target });
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
        expect(document.documentElement.hasAttribute("lang")).toBe(false);
        target.remove();
    });
});

describe("LocaleSelect — initial-value resolution (§7.18–§7.21, §7.26–§7.27)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh init", () => {
        const { controller } = setup({ storageKey: "lily-locale" });
        controller.setLocale("fr");
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        controller.destroy();
        resetRoot();

        setup({ storageKey: "lily-locale" });
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value (carried on the data attribute) wins over storage and defaults", () => {
        localStorage.setItem("lily-locale", "ar");
        const root = mountIntoBody(
            renderMacro({
                label: "Language",
                locales: LOCALES,
                value: "en",
                storageKey: "lily-locale",
                defaultValue: "fr",
            }),
        );
        expect(root.getAttribute("data-lily-locale-select-value")).toBe("en");
        initLocaleSelect(root);
        expect(document.documentElement.lang).toBe("en");
    });

    test("§7.26 the value data attribute is the sole channel for opts.value", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES, value: "fr" }),
        );
        expect(root.getAttribute("data-lily-locale-select-value")).toBe("fr");
        initLocaleSelect(root);
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.27 the value data attribute is omitted entirely when opts.value is unset", () => {
        const root = mountIntoBody(
            renderMacro({ label: "Language", locales: LOCALES }),
        );
        expect(root.hasAttribute("data-lily-locale-select-value")).toBe(false);
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
        setup({ locales: ["en", "fr_CA", "fr"], detectFromNavigator: true });
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
        setup({ locales: ["en", "fr"], detectFromNavigator: true });
        expect(document.documentElement.lang).toBe("fr");
        if (original)
            Object.defineProperty(window.navigator, "languages", original);
    });

    test("matchNavigatorLanguage exact match wins", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe("fr_CA");
    });

    test("matchNavigatorLanguage returns empty when no match", () => {
        expect(matchNavigatorLanguage(["xx-YY"], ["en", "fr"])).toBe("");
    });
});

describe("LocaleSelect — spread, caller, autoInit (§7.22–§7.25)", () => {
    test("§7.22 extra attributes spread onto the root div", () => {
        const root = mountIntoBody(
            renderMacro({
                label: "Language",
                locales: LOCALES,
                attributes: { "data-testid": "lp" },
            }),
        );
        expect(root.getAttribute("data-testid")).toBe("lp");
    });

    test("§7.24 a call block replaces the glyph inside the button", () => {
        const root = mountIntoBody(
            renderMacroWithCaller(
                { label: "Language", locales: LOCALES },
                `<span class="my-glyph" aria-hidden="true">L</span>`,
            ),
        );
        const { button } = partsOf(root);
        expect(button.querySelector(".my-glyph")).not.toBeNull();
        expect(button.querySelector(".locale-select-icon")).toBeNull();
        expect(button.getAttribute("aria-label")).toBe("Language");
    });

    test("§7.25 destroy() detaches the listeners", () => {
        const { button, list, controller } = setup();
        controller.destroy();
        key(button, "ArrowDown");
        expect(list.hasAttribute("hidden")).toBe(true);
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
        // Distinct names give distinct id namespaces.
        const lists = document.querySelectorAll(".locale-select-list");
        expect(lists[0].id).not.toBe(lists[1].id);
    });
});
