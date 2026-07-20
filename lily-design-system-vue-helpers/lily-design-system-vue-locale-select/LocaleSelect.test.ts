import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

import LocaleSelect, {
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
} from "./LocaleSelect.vue";

const LOCALES = ["en", "en_US", "fr", "fr_CA", "ar"];

/** Let Vue's scheduler, the onMounted effects, and any nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

function resetRoot(): void {
    document.documentElement.removeAttribute("lang");
    document.documentElement.removeAttribute("dir");
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown>, options: Record<string, unknown> = {}) {
    const wrapper = mount(LocaleSelect, {
        props: { label: "Language", locales: LOCALES, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function parts(wrapper: VueWrapper<any>) {
    return {
        button: wrapper.find("button.locale-select-button"),
        list: wrapper.find("ul.locale-select-list"),
        options: wrapper.findAll("li.locale-select-option"),
    };
}

/** Open the listbox and click the option for `code`. */
async function pick(
    wrapper: VueWrapper<any>,
    code: string,
    locales: string[] = LOCALES,
): Promise<void> {
    const { button, options } = parts(wrapper);
    await button.trigger("click");
    await options[locales.indexOf(code)].trigger("click");
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
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
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
    test("§7.1 renders a button that controls a listbox", () => {
        const wrapper = build({});
        const { button } = parts(wrapper);
        expect(button.element.tagName).toBe("BUTTON");
        expect(button.attributes("type")).toBe("button");
        expect(button.attributes("aria-haspopup")).toBe("listbox");
        expect(button.attributes("aria-expanded")).toBe("false");
        const listId = button.attributes("aria-controls");
        expect(listId).toBeTruthy();
        expect(document.getElementById(listId!)?.getAttribute("role")).toBe("listbox");
    });

    test("§7.1 the root is a div carrying the class hook", () => {
        const wrapper = build({ class: "my-hook" });
        expect(wrapper.element.tagName).toBe("DIV");
        expect(wrapper.classes()).toContain("locale-select");
        expect(wrapper.classes()).toContain("my-hook");
    });

    test("§7.1 the button renders the globe glyph, hidden from assistive tech", () => {
        const wrapper = build({});
        const icon = wrapper.find(".locale-select-icon");
        // U+1F310 GLOBE WITH MERIDIANS + U+FE0E VARIATION SELECTOR-15.
        // VS15 forces text presentation so the globe renders monochrome,
        // matching theme-select's ◑ rather than the colour-emoji globe.
        expect(icon.text()).toBe("\u{1F310}\uFE0E");
        expect(icon.attributes("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        const wrapper = build({ label: "Choose language" });
        const { button, list } = parts(wrapper);
        expect(button.attributes("aria-label")).toBe("Choose language");
        expect(list.attributes("aria-label")).toBe("Choose language");
    });

    test("§7.3 one option per locale; the hidden input carries the supplied name", async () => {
        const wrapper = build({ name: "lang" });
        await flush();
        expect(parts(wrapper).options.length).toBe(LOCALES.length);
        const hidden = wrapper.find('input[type="hidden"]')
            .element as HTMLInputElement;
        expect(hidden.name).toBe("lang");
        expect(hidden.value).toBe("en");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        const wrapper = build({});
        const { button, list } = parts(wrapper);
        expect(list.element.hasAttribute("hidden")).toBe(true);
        await button.trigger("click");
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(false);
        expect(button.attributes("aria-expanded")).toBe("true");
    });

    test("§7.4 the active locale is the aria-selected option", async () => {
        const wrapper = build({});
        await flush();
        await parts(wrapper).button.trigger("click");
        await flush();
        const selected = wrapper.findAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].attributes("lang")).toBe("en");
    });

    test("§7.5 each option carries lang in BCP 47 hyphen form", () => {
        const wrapper = build({ locales: ["en", "en_US", "zh_Hant_TW"] });
        const opts = parts(wrapper).options;
        expect(opts[0].attributes("lang")).toBe("en");
        expect(opts[1].attributes("lang")).toBe("en-US");
        expect(opts[2].attributes("lang")).toBe("zh-Hant-TW");
    });

    test("§7.5 the button and the list carry no lang of their own", () => {
        const wrapper = build({});
        const { button, list } = parts(wrapper);
        expect(button.attributes("lang")).toBeUndefined();
        expect(list.attributes("lang")).toBeUndefined();
    });

    test("§7.6 visible option text uses localeLabels override when supplied", () => {
        const wrapper = build({
            locales: ["en", "fr"],
            localeLabels: { en: "English", fr: "Français" },
        });
        expect(wrapper.text()).toContain("English");
        expect(wrapper.text()).toContain("Français");
    });

    test("§7.6 falls back to defaultLocaleLabels when localeLabels missing", () => {
        const wrapper = build({ locales: ["en_US"] });
        expect(wrapper.text()).toContain("English (United States)");
    });
});

describe("LocaleSelect — keyboard contract (APG listbox, §7.6)", () => {
    async function openWith(key: string) {
        const wrapper = build({});
        await flush();
        const { button, list } = parts(wrapper);
        await button.trigger("keydown", { key });
        await flush();
        return { wrapper, button, list, el: list.element as HTMLElement };
    }

    test("§7.24 ArrowDown, Enter and Space all open the listbox", async () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            const { el } = await openWith(key);
            expect(el.hasAttribute("hidden")).toBe(false);
            while (wrappers.length) wrappers.pop()!.unmount();
        }
    });

    test("§7.24 ArrowUp opens with the last option active", async () => {
        const { el } = await openWith("ArrowUp");
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[LOCALES.length - 1].id,
        );
    });

    test("§7.24 opening moves focus to the listbox", async () => {
        const { el } = await openWith("ArrowDown");
        expect(document.activeElement).toBe(el);
    });

    test("§7.25 opening puts the active descendant on the selected locale", async () => {
        const { el } = await openWith("ArrowDown");
        // "en" resolves as the initial locale, so it is index 0.
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.25 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[1].id);
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
        // Clamps at the top rather than wrapping.
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.25 ArrowDown clamps at the bottom rather than wrapping", async () => {
        const { list, el } = await openWith("ArrowUp");
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[LOCALES.length - 1].id,
        );
    });

    test("§7.25 the active option carries data-active", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        const active = el.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(el.children[1].id);
    });

    test("§7.25 Home and End jump to the first and last option", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "End" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[LOCALES.length - 1].id,
        );
        await list.trigger("keydown", { key: "Home" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.26 Enter selects the active option, applies it, and closes", async () => {
        const { button, list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(document.documentElement.getAttribute("lang")).toBe("en-US");
    });

    test("§7.26 Space selects the active option too", async () => {
        const { list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        await list.trigger("keydown", { key: " " });
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe("en-US");
    });

    test("§7.26 Enter returns focus to the button", async () => {
        const { button, list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button.element);
    });

    test("§7.26 Escape closes without changing the locale", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.getAttribute("lang")).toBe("en");
    });

    test("§7.26 Tab closes without stealing focus back to the button", async () => {
        const { button, list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Tab" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button.element);
    });

    test("§7.26 aria-activedescendant is dropped once the listbox closes", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("§7.27 typeahead moves the active descendant by label prefix", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "F" });
        // "French" is index 2 in LOCALES.
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[2].id);
    });

    test("§7.27 clicking an option selects and applies it", async () => {
        const wrapper = build({});
        await flush();
        await pick(wrapper, "ar");
        await flush();
        expect(document.documentElement.getAttribute("lang")).toBe("ar");
        expect(document.documentElement.getAttribute("dir")).toBe("rtl");
    });

    test("§7.27 clicking outside the root closes the listbox", async () => {
        const wrapper = build({});
        await flush();
        const { button, list } = parts(wrapper);
        await button.trigger("click");
        await flush();
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(false);
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(true);
    });
});

describe("LocaleSelect — locale application (§5.5, §7.3)", () => {
    test("§7.13 sets target.lang to the BCP 47 form of the resolved initial locale", async () => {
        build({ defaultValue: "en_US" });
        await flush();
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.14 sets dir=rtl for an RTL initial locale", async () => {
        build({ locales: ["ar", "en"], defaultValue: "ar" });
        await flush();
        expect(document.documentElement.dir).toBe("rtl");
    });

    test("§7.14 sets dir=ltr for an LTR initial locale", async () => {
        build({ locales: ["en", "ar"], defaultValue: "en" });
        await flush();
        expect(document.documentElement.dir).toBe("ltr");
    });

    test("§7.15 when applyDir=false, dir is never written", async () => {
        build({ locales: ["ar", "en"], defaultValue: "ar", applyDir: false });
        await flush();
        expect(document.documentElement.hasAttribute("dir")).toBe(false);
        expect(document.documentElement.lang).toBe("ar");
    });

    test("§7.16 selecting a different option updates lang, dir, and emits change", async () => {
        const Host = defineComponent({
            components: { LocaleSelect },
            setup() {
                const locale = ref("");
                const changes: string[] = [];
                return { locale, changes };
            },
            template: `
                <LocaleSelect
                    label="Language"
                    :locales="['en', 'en_US', 'fr', 'fr_CA', 'ar']"
                    default-value="en"
                    v-model:value="locale"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        wrappers.push(wrapper);
        await flush();
        await wrapper.find("button.locale-select-button").trigger("click");
        await wrapper.findAll("li.locale-select-option")[4].trigger("click");
        await flush();
        expect(document.documentElement.lang).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
        expect((wrapper.vm as any).changes).toContain("ar");
        expect((wrapper.vm as any).locale).toBe("ar");
    });

    test("§7.16 change receives the consumer-form code (not BCP 47)", async () => {
        const seen: string[] = [];
        const wrapper = build(
            { defaultValue: "en", onChange: (v: string) => seen.push(v) },
        );
        await flush();
        await pick(wrapper, "en_US");
        await flush();
        expect(seen[seen.length - 1]).toBe("en_US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("§7.17 a custom target receives lang and dir", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        build({ locales: ["ar", "en"], defaultValue: "ar", target });
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
        const wrapper = build({ storageKey: "lily-locale" });
        await flush();
        await pick(wrapper, "fr");
        await flush();
        expect(localStorage.getItem("lily-locale")).toBe("fr");
        wrapper.unmount();
        resetRoot();

        build({ storageKey: "lily-locale" });
        await flush();
        expect(document.documentElement.lang).toBe("fr");
    });

    test("§7.19 a supplied non-empty value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-locale", "ar");
        build({ value: "en", storageKey: "lily-locale", defaultValue: "fr" });
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
        build({ locales: ["en", "fr_CA", "fr"], detectFromNavigator: true });
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
        build({ locales: ["en", "fr"], detectFromNavigator: true });
        await flush();
        expect(document.documentElement.lang).toBe("fr");
        if (original) Object.defineProperty(window.navigator, "languages", original);
    });
});

describe("LocaleSelect — spread + custom slot (§4.1, §7.5)", () => {
    test("§7.22 extra attributes spread onto the root div", () => {
        const wrapper = build({}, { attrs: { "data-testid": "lp" } });
        expect(wrapper.element.tagName).toBe("DIV");
        expect(wrapper.attributes("data-testid")).toBe("lp");
    });

    test("§7.23 the default slot replaces the button glyph and receives SlotArgs", async () => {
        let captured: any;
        const wrapper = build(
            { value: "fr" },
            {
                slots: {
                    default: (args: any) => {
                        captured = args;
                        return "custom glyph";
                    },
                },
            },
        );
        await flush();
        // The custom glyph replaces the default globe inside the button.
        expect(wrapper.find("button.locale-select-button").text()).toContain(
            "custom glyph",
        );
        expect(wrapper.find(".locale-select-icon").exists()).toBe(false);
        expect(captured.open).toBe(false);
        expect(captured.value).toBe("fr");
        expect(captured.labelFor("en_US")).toBe("English (United States)");
    });

    test("§7.23 the slot's open flag tracks the listbox state", async () => {
        const seen: boolean[] = [];
        const wrapper = build(
            {},
            {
                slots: {
                    default: (args: any) => {
                        seen.push(args.open);
                        return "glyph";
                    },
                },
            },
        );
        await flush();
        await wrapper.find("button.locale-select-button").trigger("click");
        await flush();
        expect(seen[0]).toBe(false);
        expect(seen[seen.length - 1]).toBe(true);
    });
});
