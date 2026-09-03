import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import LocalePicker, {
    bcp47LocaleTag,
    isRtlLocale,
    localeEndonym,
    localeName,
    matchNavigatorLanguage,
} from "./LocalePicker.svelte";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

function resetRoot(): void {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}

beforeEach(() => {
    resetRoot();
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    resetRoot();
});

/** Open the listbox and click the option for `code`. */
async function pick(code: string, locales: string[] = LOCALES): Promise<void> {
    await fireEvent.click(screen.getByRole("button"));
    const opts = document.querySelectorAll(".locale-picker-option");
    await fireEvent.click(opts[locales.indexOf(code)]);
}

describe("LocalePicker — pure helpers (§7.2)", () => {
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

    test("RTL detection is case-insensitive on script subtag", () => {
        expect(isRtlLocale("uz_arab_af")).toBe(true);
        expect(isRtlLocale("UZ_ARAB_AF")).toBe(true);
    });

    test("matchNavigatorLanguage exact match wins", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr_CA"])).toBe("fr_CA");
    });

    test("matchNavigatorLanguage language-only fallback", () => {
        expect(matchNavigatorLanguage(["fr-CA"], ["en", "fr"])).toBe("fr");
    });

    test("matchNavigatorLanguage returns empty when no match", () => {
        expect(matchNavigatorLanguage(["xx-YY"], ["en", "fr"])).toBe("");
    });
});

describe("LocalePicker — markup contract (§4.3, §7.1)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        render(LocalePicker, { props: { label: "Language", locales: LOCALES } });
        const button = screen.getByRole("button");
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.getAttribute("aria-haspopup")).toBe("listbox");
        expect(button.getAttribute("aria-expanded")).toBe("false");
        const listId = button.getAttribute("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
    });

    test("§7.1 the button renders the globe glyph, hidden from assistive tech", () => {
        render(LocalePicker, { props: { label: "Language", locales: LOCALES } });
        const icon = document.querySelector(".locale-picker-icon") as HTMLElement;
        // U+1F310 GLOBE WITH MERIDIANS (decimal &#127760;) + U+FE0E
        // VARIATION SELECTOR-15, which forces monochrome text presentation
        // so the glyph matches theme-picker's ◑ rather than rendering as a
        // colour emoji.
        expect(icon.textContent).toBe("🌐︎");
        expect(icon.getAttribute("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        render(LocalePicker, {
            props: { label: "Choose language", locales: LOCALES },
        });
        expect(screen.getByRole("button", { name: "Choose language" })).toBeTruthy();
        const list = document.querySelector(".locale-picker-list") as HTMLElement;
        expect(list.getAttribute("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the hidden input carries the supplied name", async () => {
        render(LocalePicker, {
            props: { label: "Language", locales: LOCALES, name: "lang" },
        });
        await flush();
        const options = document.querySelectorAll(".locale-picker-option");
        expect(options.length).toBe(LOCALES.length);
        const hidden = document.querySelector(
            'input[type="hidden"]',
        ) as HTMLInputElement;
        expect(hidden.name).toBe("lang");
        expect(hidden.value).toBe("en");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        render(LocalePicker, { props: { label: "Language", locales: LOCALES } });
        const list = document.querySelector(".locale-picker-list") as HTMLElement;
        expect(list.hasAttribute("hidden")).toBe(true);
        await fireEvent.click(screen.getByRole("button"));
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("§7.4 the active locale is the aria-selected option", async () => {
        render(LocalePicker, { props: { label: "Language", locales: LOCALES } });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        const selected = document.querySelectorAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].getAttribute("lang")).toBe("en");
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
        render(LocalePicker, {
            props: { label: "Language", locales: ["en", "en_US", "zh_Hant_TW"] },
        });
        const opts = document.querySelectorAll<HTMLElement>(".locale-picker-option");
        expect(opts[0].getAttribute("lang")).toBe("en");
        expect(opts[1].getAttribute("lang")).toBe("en-US");
        expect(opts[2].getAttribute("lang")).toBe("zh-Hant-TW");
    });

    test("§7.6 visible option text uses localeLabels override when supplied", () => {
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: ["en", "fr"],
                localeLabels: { en: "English", fr: "Français" },
            },
        });
        expect(screen.getByText("English")).toBeTruthy();
        expect(screen.getByText("Français")).toBeTruthy();
    });

    test("§7.6 default option text is the locale's endonym, not the English exonym", () => {
        render(LocalePicker, {
            props: { label: "Language", locales: ["cy", "de"] },
        });
        // "Cymraeg", not "Welsh": the user who needs the language menu is
        // the one who cannot read the page's language, and the exonym
        // means nothing to them. The English table is now only a fallback
        // for runtimes without Intl.DisplayNames data.
        expect(screen.getByText("Cymraeg")).toBeTruthy();
        expect(screen.queryByText("Welsh")).toBeNull();
        expect(screen.getByText("Deutsch")).toBeTruthy();
        // The exported helper backs the rendered text and is
        // deterministic — no navigator dependency, so SSR and client
        // agree.
        expect(localeEndonym("cy")).toBe("Cymraeg");
        expect(localeEndonym("de")).toBe("Deutsch");
    });
});

describe("LocalePicker — keyboard contract (APG listbox, §7.6)", () => {
    async function openWith(key: string) {
        render(LocalePicker, { props: { label: "Language", locales: LOCALES } });
        await flush();
        const button = screen.getByRole("button");
        await fireEvent.keyDown(button, { key });
        await flush();
        return {
            button,
            list: document.querySelector(".locale-picker-list") as HTMLElement,
        };
    }

    test("§7.24 ArrowDown, Enter and Space all open the listbox", async () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            const { list } = await openWith(key);
            expect(list.hasAttribute("hidden")).toBe(false);
            document.body.innerHTML = "";
        }
    });

    test("§7.24 ArrowUp opens with the last option active", async () => {
        const { list } = await openWith("ArrowUp");
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[LOCALES.length - 1].id,
        );
    });

    test("§7.25 opening puts the active descendant on the selected locale", async () => {
        const { list } = await openWith("ArrowDown");
        // "en" resolves as the initial locale, so it is index 0.
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });

    test("§7.25 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[1].id);
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
        // Clamps at the top rather than wrapping.
        await fireEvent.keyDown(list, { key: "ArrowUp" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });

    test("§7.25 Home and End jump to the first and last option", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "End" });
        expect(list.getAttribute("aria-activedescendant")).toBe(
            list.children[LOCALES.length - 1].id,
        );
        await fireEvent.keyDown(list, { key: "Home" });
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[0].id);
    });

    test("§7.26 Enter selects the active option, applies it, and closes", async () => {
        const { button, list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        await fireEvent.keyDown(list, { key: "Enter" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(document.documentElement.getAttribute("lang")).toBe("en-US");
    });

    test("§7.26 Escape closes without changing the locale", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "ArrowDown" });
        await fireEvent.keyDown(list, { key: "Escape" });
        await flush();
        expect(list.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    test("§7.27 typeahead moves the active descendant by label prefix", async () => {
        const { list } = await openWith("ArrowDown");
        await fireEvent.keyDown(list, { key: "F" });
        // "French" is index 2 in LOCALES.
        expect(list.getAttribute("aria-activedescendant")).toBe(list.children[2].id);
    });

    test("§7.27 clicking an option selects it, applies it, and closes the listbox", async () => {
        render(LocalePicker, { props: { label: "Language", locales: LOCALES } });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        const opts = document.querySelectorAll(".locale-picker-option");
        await fireEvent.click(opts[4]);
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe("ar");
        expect(document.documentElement.getAttribute("dir")).toBe("rtl");
        // A pointer selection closes, exactly as Enter does (§7.26). The
        // asymmetry would be invisible to a consumer reading the DOM: a
        // stale aria-expanded over a hidden list makes every later click
        // miss the options.
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
            "false",
        );
        expect(
            document.querySelector(".locale-picker-list")!.hasAttribute("hidden"),
        ).toBe(true);
    });
});

describe("LocalePicker — locale application (§5.5, §7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        render(LocalePicker, {
            props: { label: "Language", locales: LOCALES, defaultValue: "en_US" },
        });
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        render(LocalePicker, {
            props: { label: "Language", locales: ["ar", "en"], defaultValue: "ar" },
        });
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        render(LocalePicker, {
            props: { label: "Language", locales: ["en", "ar"], defaultValue: "en" },
        });
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when applyDir=false, dir is never written", async () => {
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: ["ar", "en"],
                defaultValue: "ar",
                applyDir: false,
            },
        });
        await flush();
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 selecting a different option updates lang, dir, and fires onChange", async () => {
        const onChange = vi.fn();
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                defaultValue: "en",
                onChange,
            },
        });
        await flush();
        await pick("ar");
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenCalledWith("ar");
    });

    test("§7.16 onChange receives the consumer-form code (not BCP 47)", async () => {
        const onChange = vi.fn();
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                defaultValue: "en",
                onChange,
            },
        });
        await flush();
        await pick("en_US");
        await flush();
        expect(onChange).toHaveBeenLastCalledWith("en_US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: ["ar", "en"],
                defaultValue: "ar",
                target,
            },
        });
        await flush();
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
        // Document root must remain untouched.
        expect(document.documentElement.hasAttribute("lang")).toBe(false);
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        target.remove();
    });
});

describe("LocalePicker — initial-value resolution (§5.2, §5.3, §7.4)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                storageKey: "lily-locale",
            },
        });
        await flush();
        await pick("fr");
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        unmount();
        resetRoot();

        render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                storageKey: "lily-locale",
            },
        });
        await flush();
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-locale", "ar");
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                value: "en",
                storageKey: "lily-locale",
                defaultValue: "fr",
            },
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
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: ["en", "fr_CA", "fr"],
                detectFromNavigator: true,
            },
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
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: ["en", "fr"],
                detectFromNavigator: true,
            },
        });
        await flush();
        expect(document.documentElement.lang).toBe("fr");
        if (original) Object.defineProperty(window.navigator, "languages", original);
    });
});

describe("LocalePicker — spread + custom children (§4.1, §7.5)", () => {
    test("§7.22 extra attributes spread onto the <select>", () => {
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                "data-testid": "lp",
            },
        });
        expect(screen.getByTestId("lp")).toBeTruthy();
    });

    test("§7.23 children snippet replaces the button glyph and receives ChildArgs", async () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("span");
            const a = args();
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-open", String(a.open));
            node.setAttribute("data-value", a.value);
            node.setAttribute("data-label-en-us", a.labelFor("en_US"));
            node.textContent = "custom glyph";
            $anchor.before(node);
        }) as any;

        render(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                // Explicit value: the raw test snippet reads its args once at
                // first render, before the effect resolves an initial locale.
                value: "fr",
                children: customSnippet,
            },
        });
        await flush();
        const node = screen.getByTestId("custom");
        // The custom glyph replaces the default globe inside the button.
        expect(node.closest("button")?.className).toContain("locale-picker-button");
        expect(document.querySelector(".locale-picker-icon")).toBeNull();
        expect(node.getAttribute("data-open")).toBe("false");
        expect(node.getAttribute("data-value")).toBe("fr");
        // labelFor now resolves the endonym; assert against the exported
        // helper rather than a hardcoded string, so an ICU wording change
        // cannot break the test without a real behaviour change.
        expect(node.getAttribute("data-label-en-us")).toBe(
            localeEndonym("en_US"),
        );
    });
});

describe("LocalePicker — accessibility hardening (§7.28–§7.32)", () => {
    async function openPicker(
        locales: string[] = LOCALES,
        extra: Record<string, unknown> = {},
    ) {
        render(LocalePicker, {
            props: { label: "Language", locales, ...extra },
        });
        await flush();
        await fireEvent.click(screen.getByRole("button"));
        await flush();
        return {
            button: screen.getByRole("button"),
            list: document.querySelector(".locale-picker-list") as HTMLElement,
        };
    }

    const active = (list: HTMLElement) =>
        list.querySelector("[data-active]")?.textContent?.trim();

    test("§7.28 Tab from the open list puts focus on the button before closing", async () => {
        const { button, list } = await openPicker();
        expect(document.activeElement).toBe(list);
        await fireEvent.keyDown(list, { key: "Tab" });
        // Focus sits on the button, so the browser's default Tab proceeds
        // from the picker's own position — not from <body>, which is where
        // focus lands when the focused list is hidden first.
        expect(document.activeElement).toBe(button);
        expect(list.hasAttribute("hidden")).toBe(true);
    });

    test("§7.29 lang is claimed only when the label is the endonym", async () => {
        render(LocalePicker, {
            props: {
                label: "Language",
                locales: ["cy", "ar"],
                localeLabels: { ar: "Arabic" },
            },
        });
        const opts = document.querySelectorAll(".locale-picker-option");
        // Endonym label: the text really is Welsh, so lang="cy" is a true
        // claim and a screen reader may switch voice.
        expect(opts[0].textContent?.trim()).toBe("Cymraeg");
        expect(opts[0].getAttribute("lang")).toBe("cy");
        // Consumer label: its language is unknown, so no claim — the
        // English word "Arabic" must not be handed to an Arabic voice.
        expect(opts[1].textContent?.trim()).toBe("Arabic");
        expect(opts[1].getAttribute("lang")).toBeNull();
    });

    test("§7.30 a repeated typeahead character cycles through its matches", async () => {
        const { list } = await openPicker(["l1", "l2", "l3", "l4"], {
            localeLabels: { l1: "Dark", l2: "Dim", l3: "Dracula", l4: "Light" },
            defaultValue: "l4",
        });
        await fireEvent.keyDown(list, { key: "d" });
        expect(active(list)).toBe("Dark");
        await fireEvent.keyDown(list, { key: "d" });
        expect(active(list)).toBe("Dim");
        await fireEvent.keyDown(list, { key: "d" });
        expect(active(list)).toBe("Dracula");
    });

    test("§7.31 PageUp and PageDown move the cursor by ten, clamped", async () => {
        const many = Array.from(
            { length: 25 },
            (_, i) => `x${String(i).padStart(2, "0")}`,
        );
        const labels = Object.fromEntries(many.map((l) => [l, l.toUpperCase()]));
        const { list } = await openPicker(many, { localeLabels: labels });
        await fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("X10");
        await fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("X20");
        await fireEvent.keyDown(list, { key: "PageDown" });
        expect(active(list)).toBe("X24");
        await fireEvent.keyDown(list, { key: "PageUp" });
        expect(active(list)).toBe("X14");
    });

    test("§7.32 an empty list opens without aria-activedescendant", async () => {
        const { list } = await openPicker([]);
        expect(list.hasAttribute("hidden")).toBe(false);
        expect(list.getAttribute("aria-activedescendant")).toBeNull();
    });
});

describe("LocalePicker — idempotent apply (§7.33)", () => {
    test("§7.33 onChange fires once per changed value, not once per effect run", async () => {
        const onChange = vi.fn();
        const { rerender } = render(LocalePicker, {
            props: { label: "Language", locales: LOCALES, onChange },
        });
        await flush();
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenLastCalledWith("en");

        await pick("fr");
        await flush();
        expect(onChange).toHaveBeenCalledTimes(2);
        expect(onChange).toHaveBeenLastCalledWith("fr");

        // A prop change re-runs the apply effect. Re-applying the same
        // locale must not re-fire onChange: a consumer callback that
        // writes reactive state would re-enter the effect until Svelte
        // gives up updating the component
        // (effect_update_depth_exceeded) and the listbox freezes.
        await rerender({ storageKey: "lily-locale-later" });
        await flush();
        expect(onChange).toHaveBeenCalledTimes(2);
    });
});
