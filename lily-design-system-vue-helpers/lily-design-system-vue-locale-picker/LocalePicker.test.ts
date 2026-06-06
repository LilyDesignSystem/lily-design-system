import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

import LocalePicker, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocalePicker.vue";

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

describe("LocalePicker — markup contract (§4.4, §7.1)", () => {
    test("§7.1 renders a fieldset with role=radiogroup", () => {
        const wrapper = mount(LocalePicker, {
            props: { label: "Language", locales: LOCALES },
            attachTo: document.body,
        });
        const group = wrapper.find('[role="radiogroup"]');
        expect(group.exists()).toBe(true);
        expect(group.element.tagName).toBe("FIELDSET");
    });

    test("§7.2 aria-label is the supplied label", () => {
        const wrapper = mount(LocalePicker, {
            props: { label: "Choose language", locales: LOCALES },
            attachTo: document.body,
        });
        expect(wrapper.find("fieldset").attributes("aria-label")).toBe("Choose language");
    });

    test("§7.3 one radio per locale, sharing the supplied name", () => {
        const wrapper = mount(LocalePicker, {
            props: { label: "Language", locales: LOCALES, name: "lang" },
            attachTo: document.body,
        });
        const radios = wrapper.findAll('input[type="radio"]');
        expect(radios.length).toBe(LOCALES.length);
        expect(radios.every((r) => (r.element as HTMLInputElement).name === "lang")).toBe(true);
    });

    test("§7.4 each radio carries the locale code as its value", () => {
        const wrapper = mount(LocalePicker, {
            props: { label: "Language", locales: LOCALES },
            attachTo: document.body,
        });
        const radios = wrapper.findAll('input[type="radio"]');
        expect(radios.map((r) => (r.element as HTMLInputElement).value)).toEqual(LOCALES);
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
        const wrapper = mount(LocalePicker, {
            props: { label: "Language", locales: ["en", "en_US", "zh_Hant_TW"] },
            attachTo: document.body,
        });
        const labels = wrapper.findAll(".locale-picker-option");
        expect(labels[0].attributes("lang")).toBe("en");
        expect(labels[1].attributes("lang")).toBe("en-US");
        expect(labels[2].attributes("lang")).toBe("zh-Hant-TW");
    });

    test("§7.6 visible option text uses localeLabels override when supplied", () => {
        const wrapper = mount(LocalePicker, {
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
        const wrapper = mount(LocalePicker, {
            props: { label: "Language", locales: ["en_US"] },
            attachTo: document.body,
        });
        expect(wrapper.text()).toContain("English (United States)");
    });
});

describe("LocalePicker — locale application (§5.5, §7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        mount(LocalePicker, {
            props: { label: "Language", locales: LOCALES, defaultValue: "en_US" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        mount(LocalePicker, {
            props: { label: "Language", locales: ["ar", "en"], defaultValue: "ar" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        mount(LocalePicker, {
            props: { label: "Language", locales: ["en", "ar"], defaultValue: "en" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when applyDir=false, dir is never written", async () => {
        mount(LocalePicker, {
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

    test("§7.16 selecting a different radio updates lang, dir, and emits change", async () => {
        const Host = defineComponent({
            components: { LocalePicker },
            setup() {
                const locale = ref("en");
                const changes: string[] = [];
                return { locale, changes };
            },
            template: `
                <LocalePicker
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
        const radios = wrapper.findAll('input[type="radio"]');
        await radios[4].setValue();
        await flush();
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect((wrapper.vm as any).changes).toContain("ar");
    });

    test("§7.16 change event receives the consumer-form code (not BCP 47)", async () => {
        const Host = defineComponent({
            components: { LocalePicker },
            setup() {
                const locale = ref("en");
                const changes: string[] = [];
                return { locale, changes };
            },
            template: `
                <LocalePicker
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
        const radios = wrapper.findAll('input[type="radio"]');
        await radios[1].setValue(); // en_US
        await flush();
        await flush();
        const changes = (wrapper.vm as any).changes as string[];
        expect(changes[changes.length - 1]).toBe("en_US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        mount(LocalePicker, {
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

describe("LocalePicker — initial-value resolution (§5.2, §5.3, §7.4)", () => {
    test("§7.18 persists to localStorage and reads back on a fresh mount", async () => {
        const Host = defineComponent({
            components: { LocalePicker },
            setup() {
                const locale = ref("");
                return { locale };
            },
            template: `
                <LocalePicker
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
        const radios = wrapper.findAll('input[type="radio"]');
        await radios[2].setValue(); // fr
        await flush();
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        wrapper.unmount();
        resetRoot();

        mount(LocalePicker, {
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
        mount(LocalePicker, {
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
        mount(LocalePicker, {
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
        mount(LocalePicker, {
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

describe("LocalePicker — spread + custom slot (§4.1, §7.5)", () => {
    test("§7.22 extra attributes spread onto the fieldset", () => {
        const wrapper = mount(LocalePicker, {
            props: { label: "Language", locales: LOCALES },
            attrs: { "data-testid": "lp" },
            attachTo: document.body,
        });
        expect(wrapper.find("fieldset").attributes("data-testid")).toBe("lp");
    });

    test("§7.23 default slot receives SlotArgs", () => {
        const wrapper = mount(LocalePicker, {
            props: {
                label: "Language",
                locales: LOCALES,
                name: "lang",
            },
            slots: {
                default: (args: any) =>
                    h(
                        "div",
                        {
                            "data-testid": "custom",
                            "data-name": args.name,
                            "data-tag-en-us": args.tagFor("en_US"),
                            "data-rtl-ar": String(args.isRtl("ar")),
                        },
                        args.locales.join(","),
                    ),
            },
            attachTo: document.body,
        });
        const custom = wrapper.find('[data-testid="custom"]');
        expect(custom.text()).toBe("en,en_US,fr,fr_CA,ar");
        expect(custom.attributes("data-name")).toBe("lang");
        expect(custom.attributes("data-tag-en-us")).toBe("en-US");
        expect(custom.attributes("data-rtl-ar")).toBe("true");
    });
});
