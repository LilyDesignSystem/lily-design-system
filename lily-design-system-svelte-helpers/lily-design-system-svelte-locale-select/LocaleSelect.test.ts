import { render, screen, fireEvent } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleSelect.svelte";

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

describe("LocaleSelect — pure helpers (§7.2)", () => {
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

describe("LocaleSelect — markup contract (§4.3, §7.1)", () => {
    test("§7.1 renders a <select> with role=combobox", () => {
        render(LocaleSelect, { props: { label: "Language", locales: LOCALES } });
        const select = screen.getByRole("combobox");
        expect(select.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", () => {
        render(LocaleSelect, {
            props: { label: "Choose language", locales: LOCALES },
        });
        expect(screen.getByLabelText("Choose language")).toBeTruthy();
    });

    test("§7.3 one option per locale; the select carries the supplied name", () => {
        render(LocaleSelect, {
            props: { label: "Language", locales: LOCALES, name: "lang" },
        });
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        // One placeholder option plus one option per locale.
        expect(options.length).toBe(LOCALES.length + 1);
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        expect(select.name).toBe("lang");
    });

    test("§7.4 each option carries the locale code as its value, after the empty placeholder", () => {
        render(LocaleSelect, { props: { label: "Language", locales: LOCALES } });
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options.map((o) => o.value)).toEqual(["", ...LOCALES]);
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
        render(LocaleSelect, {
            props: { label: "Language", locales: ["en", "en_US", "zh_Hant_TW"] },
        });
        // Skip index 0: the placeholder is not a locale and carries no lang.
        const opts = document.querySelectorAll<HTMLElement>(".locale-select-option");
        expect(opts[1].getAttribute("lang")).toBe("en");
        expect(opts[2].getAttribute("lang")).toBe("en-US");
        expect(opts[3].getAttribute("lang")).toBe("zh-Hant-TW");
    });

    test("§7.4 the placeholder option renders the label and stays displayed", async () => {
        render(LocaleSelect, { props: { label: "Locale", locales: LOCALES } });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        const placeholder = select.querySelector(
            ".locale-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder.textContent?.trim()).toBe("Locale");
        expect(placeholder.value).toBe("");
        // The closed control shows the placeholder, not the active locale.
        expect(select.value).toBe("");
        expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    test("§7.4 the placeholder prop overrides the label as placeholder text", () => {
        render(LocaleSelect, {
            props: { label: "Choose a locale", placeholder: "Locale", locales: LOCALES },
        });
        const placeholder = document.querySelector(
            ".locale-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder.textContent?.trim()).toBe("Locale");
        expect(screen.getByLabelText("Choose a locale")).toBeTruthy();
    });

    test("§7.4 choosing a locale applies it and snaps the select back to the placeholder", async () => {
        render(LocaleSelect, { props: { label: "Locale", locales: LOCALES } });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        select.value = LOCALES[1];
        select.dispatchEvent(new Event("change", { bubbles: true }));
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe(
            LOCALES[1].replace(/_/g, "-"),
        );
        expect(select.value).toBe("");
    });

    test("§7.6 visible option text uses localeLabels override when supplied", () => {
        render(LocaleSelect, {
            props: {
                label: "Language",
                locales: ["en", "fr"],
                localeLabels: { en: "English", fr: "Français" },
            },
        });
        expect(screen.getByText("English")).toBeTruthy();
        expect(screen.getByText("Français")).toBeTruthy();
    });

    test("§7.6 falls back to defaultLocaleLabels when localeLabels missing", () => {
        render(LocaleSelect, {
            props: { label: "Language", locales: ["en_US"] },
        });
        expect(screen.getByText("English (United States)")).toBeTruthy();
    });
});

describe("LocaleSelect — locale application (§5.5, §7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        render(LocaleSelect, {
            props: { label: "Language", locales: LOCALES, defaultValue: "en_US" },
        });
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        render(LocaleSelect, {
            props: { label: "Language", locales: ["ar", "en"], defaultValue: "ar" },
        });
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        render(LocaleSelect, {
            props: { label: "Language", locales: ["en", "ar"], defaultValue: "en" },
        });
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when applyDir=false, dir is never written", async () => {
        render(LocaleSelect, {
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
        render(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                defaultValue: "en",
                onChange,
            },
        });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "ar" } });
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect(onChange).toHaveBeenCalledWith("ar");
    });

    test("§7.16 onChange receives the consumer-form code (not BCP 47)", async () => {
        const onChange = vi.fn();
        render(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                defaultValue: "en",
                onChange,
            },
        });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "en_US" } });
        await flush();
        expect(onChange).toHaveBeenLastCalledWith("en_US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        render(LocaleSelect, {
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

describe("LocaleSelect — initial-value resolution (§5.2, §5.3, §7.4)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
        const { unmount } = render(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                storageKey: "lily-locale",
            },
        });
        await flush();
        const select = screen.getByRole("combobox") as HTMLSelectElement;
        await fireEvent.change(select, { target: { value: "fr" } });
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        unmount();
        resetRoot();

        render(LocaleSelect, {
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
        render(LocaleSelect, {
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
        render(LocaleSelect, {
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
        render(LocaleSelect, {
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

describe("LocaleSelect — spread + custom children (§4.1, §7.5)", () => {
    test("§7.22 extra attributes spread onto the <select>", () => {
        render(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                "data-testid": "lp",
            },
        });
        expect(screen.getByTestId("lp")).toBeTruthy();
    });

    test("§7.23 children snippet receives ChildArgs", () => {
        const customSnippet = (($anchor: Comment, args: any) => {
            const node = document.createElement("option");
            const a = args();
            node.setAttribute("data-testid", "custom");
            node.setAttribute("data-name", a.name);
            node.setAttribute("data-tag-en-us", a.tagFor("en_US"));
            node.setAttribute("data-rtl-ar", String(a.isRtl("ar")));
            node.textContent = a.locales.join(",");
            $anchor.before(node);
        }) as any;

        render(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                name: "lang",
                children: customSnippet,
            },
        });
        const custom = screen.getByTestId("custom");
        expect(custom.textContent).toBe("en,en_US,fr,fr_CA,ar");
        expect(custom.getAttribute("data-name")).toBe("lang");
        expect(custom.getAttribute("data-tag-en-us")).toBe("en-US");
        expect(custom.getAttribute("data-rtl-ar")).toBe("true");
    });
});
