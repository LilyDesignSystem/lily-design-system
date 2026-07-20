import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleSelect.vue";

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

describe("LocaleSelect — markup contract (§4.4, §7.1)", () => {
    test("§7.1 renders a native <select> root", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Language", locales: LOCALES },
            attachTo: document.body,
        });
        const select = wrapper.find("select.locale-select");
        expect(select.exists()).toBe(true);
        expect(select.element.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Choose language", locales: LOCALES },
            attachTo: document.body,
        });
        expect(wrapper.find("select").attributes("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the select carries the supplied name", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Language", locales: LOCALES, name: "lang" },
            attachTo: document.body,
        });
        const options = wrapper.findAll("option");
        // One placeholder option plus one option per locale.
        expect(options.length).toBe(LOCALES.length + 1);
        expect(wrapper.find("select").attributes("name")).toBe("lang");
    });

    test("§7.4 each option carries the locale code as its value, after the empty placeholder", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Language", locales: LOCALES },
            attachTo: document.body,
        });
        const options = wrapper.findAll("option");
        expect(options.map((o) => (o.element as HTMLOptionElement).value)).toEqual([
            "",
            ...LOCALES,
        ]);
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Language", locales: ["en", "en_US", "zh_Hant_TW"] },
            attachTo: document.body,
        });
        // Skip index 0: the placeholder is not a locale and carries no lang.
        const options = wrapper.findAll(".locale-select-option");
        expect(options[1].attributes("lang")).toBe("en");
        expect(options[2].attributes("lang")).toBe("en-US");
        expect(options[3].attributes("lang")).toBe("zh-Hant-TW");
    });

    test("§7.24 the placeholder option renders the label and stays displayed", async () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Locale", locales: LOCALES },
            attachTo: document.body,
        });
        await flush();
        await flush();
        const select = wrapper.find("select").element as HTMLSelectElement;
        const placeholder = select.querySelector(
            ".locale-select-placeholder",
        ) as HTMLOptionElement;
        expect(placeholder.textContent?.trim()).toBe("Locale");
        expect(placeholder.value).toBe("");
        // The closed control shows the placeholder, not the active locale.
        expect(select.value).toBe("");
        expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    test("§7.25 the placeholder prop overrides the label as placeholder text", () => {
        const wrapper = mount(LocaleSelect, {
            props: {
                label: "Choose a locale",
                placeholder: "Locale",
                locales: LOCALES,
            },
            attachTo: document.body,
        });
        const placeholder = wrapper.find(".locale-select-placeholder");
        expect(placeholder.text().trim()).toBe("Locale");
        expect(wrapper.find("select").attributes("aria-label")).toBe("Choose a locale");
    });

    test("§7.26 choosing a locale applies it and snaps the select back to the placeholder", async () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Locale", locales: LOCALES },
            attachTo: document.body,
        });
        await flush();
        await flush();
        const select = wrapper.find("select");
        await select.setValue(LOCALES[1]);
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe(
            LOCALES[1].replace(/_/g, "-"),
        );
        expect((select.element as HTMLSelectElement).value).toBe("");
    });

    test("§7.6 visible option text uses localeLabels override when supplied", () => {
        const wrapper = mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: ["en", "fr"],
                localeLabels: { en: "English", fr: "Français" },
            },
            attachTo: document.body,
        });
        expect(wrapper.text()).toContain("English");
        expect(wrapper.text()).toContain("Français");
    });

    test("§7.6 falls back to defaultLocaleLabels when localeLabels missing", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Language", locales: ["en_US"] },
            attachTo: document.body,
        });
        expect(wrapper.text()).toContain("English (United States)");
    });
});

describe("LocaleSelect — locale application (§5.5, §7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        mount(LocaleSelect, {
            props: { label: "Language", locales: LOCALES, defaultValue: "en_US" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        mount(LocaleSelect, {
            props: { label: "Language", locales: ["ar", "en"], defaultValue: "ar" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        mount(LocaleSelect, {
            props: { label: "Language", locales: ["en", "ar"], defaultValue: "en" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when applyDir=false, dir is never written", async () => {
        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: ["ar", "en"],
                defaultValue: "ar",
                applyDir: false,
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 selecting a different option updates lang, dir, and emits change", async () => {
        const Host = defineComponent({
            components: { LocaleSelect },
            setup() {
                const locale = ref("en");
                const changes: string[] = [];
                return { locale, changes };
            },
            template: `
                <LocaleSelect
                    label="Language"
                    :locales="['en', 'en_US', 'fr', 'fr_CA', 'ar']"
                    v-model:value="locale"
                    default-value="en"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        await wrapper.find("select").setValue("ar");
        await flush();
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect((wrapper.vm as any).changes).toContain("ar");
    });

    test("§7.16 change event receives the consumer-form code (not BCP 47)", async () => {
        const Host = defineComponent({
            components: { LocaleSelect },
            setup() {
                const locale = ref("en");
                const changes: string[] = [];
                return { locale, changes };
            },
            template: `
                <LocaleSelect
                    label="Language"
                    :locales="['en', 'en_US', 'fr', 'fr_CA', 'ar']"
                    v-model:value="locale"
                    default-value="en"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        await wrapper.find("select").setValue("en_US");
        await flush();
        await flush();
        const changes = (wrapper.vm as any).changes as string[];
        expect(changes[changes.length - 1]).toBe("en_US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: ["ar", "en"],
                defaultValue: "ar",
                target,
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(target.getAttribute("lang")).toBe("ar");
        expect(target.getAttribute("dir")).toBe("rtl");
        expect(document.documentElement.hasAttribute("lang")).toBe(false);
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        target.remove();
    });
});

describe("LocaleSelect — initial-value resolution (§5.2, §5.3, §7.4)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
        const Host = defineComponent({
            components: { LocaleSelect },
            setup() {
                const locale = ref("");
                return { locale };
            },
            template: `
                <LocaleSelect
                    label="Language"
                    :locales="['en', 'en_US', 'fr', 'fr_CA', 'ar']"
                    v-model:value="locale"
                    storage-key="lily-locale"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        await wrapper.find("select").setValue("fr");
        await flush();
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        wrapper.unmount();
        resetRoot();

        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                storageKey: "lily-locale",
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-locale", "ar");
        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                value: "en",
                storageKey: "lily-locale",
                defaultValue: "fr",
            },
            attachTo: document.body,
        });
        await flush();
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
        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: ["en", "fr_CA", "fr"],
                detectFromNavigator: true,
            },
            attachTo: document.body,
        });
        await flush();
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
        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: ["en", "fr"],
                detectFromNavigator: true,
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.lang).toBe("fr");
        if (original) Object.defineProperty(window.navigator, "languages", original);
    });
});

describe("LocaleSelect — spread + custom slot (§4.1, §7.5)", () => {
    test("§7.22 extra attributes spread onto the select", () => {
        const wrapper = mount(LocaleSelect, {
            props: { label: "Language", locales: LOCALES },
            attrs: { "data-testid": "lp" },
            attachTo: document.body,
        });
        expect(wrapper.find("select").attributes("data-testid")).toBe("lp");
    });

    test("§7.23 default slot receives SlotArgs", () => {
        // Capture the scoped-slot args directly: jsdom does not reliably
        // render an <option> inserted into a <select> via a slot, so we
        // assert on the args the component hands the slot (the contract).
        let captured: any;
        mount(LocaleSelect, {
            props: {
                label: "Language",
                locales: LOCALES,
                name: "lang",
            },
            slots: {
                default: (args: any) => {
                    captured = args;
                    return h("option", { value: "x" }, "x");
                },
            },
            attachTo: document.body,
        });
        expect(captured.locales).toEqual(LOCALES);
        expect(captured.name).toBe("lang");
        expect(captured.tagFor("en_US")).toBe("en-US");
        expect(captured.isRtl("ar")).toBe(true);
        expect(typeof captured.setLocale).toBe("function");
    });
});
