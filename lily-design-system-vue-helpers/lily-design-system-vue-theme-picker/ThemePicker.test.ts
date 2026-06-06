import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defineComponent, h, ref } from "vue";

import ThemePicker, { normaliseThemesUrl, themeHref } from "./ThemePicker.vue";

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-picker="${name}"]`,
    );
}

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
}

beforeEach(() => {
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-picker]")
        .forEach((n) => n.remove());
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
});

describe("ThemePicker — pure helpers", () => {
    test("normaliseThemesUrl keeps a trailing slash", () => {
        expect(normaliseThemesUrl("/a/")).toBe("/a/");
    });

    test("normaliseThemesUrl appends a missing trailing slash", () => {
        expect(normaliseThemesUrl("/a")).toBe("/a/");
    });

    test("themeHref builds the href", () => {
        expect(themeHref("/a", "light", ".css")).toBe("/a/light.css");
        expect(themeHref("/a/", "light", ".css")).toBe("/a/light.css");
    });
});

describe("ThemePicker — markup contract (§4.4, §7.1–§7.5)", () => {
    test("§7.1 renders a fieldset with role=radiogroup", () => {
        const wrapper = mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
            attachTo: document.body,
        });
        const group = wrapper.find('[role="radiogroup"]');
        expect(group.exists()).toBe(true);
        expect(group.element.tagName).toBe("FIELDSET");
    });

    test("§7.2 aria-label is the supplied label", () => {
        const wrapper = mount(ThemePicker, {
            props: { label: "Choose theme", themesUrl: URL_TRAILING, themes: THEMES },
            attachTo: document.body,
        });
        expect(wrapper.find("fieldset").attributes("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one radio per theme, sharing the supplied name", () => {
        const wrapper = mount(ThemePicker, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                name: "appearance",
            },
            attachTo: document.body,
        });
        const radios = wrapper.findAll('input[type="radio"]');
        expect(radios.length).toBe(3);
        expect(radios.every((r) => (r.element as HTMLInputElement).name === "appearance")).toBe(true);
    });

    test("§7.4 each radio carries the slug as its value", () => {
        const wrapper = mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
            attachTo: document.body,
        });
        const radios = wrapper.findAll('input[type="radio"]');
        expect(radios.map((r) => (r.element as HTMLInputElement).value)).toEqual(THEMES);
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const wrapper = mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: ["light", "dark"] },
            attachTo: document.body,
        });
        expect(wrapper.text()).toContain("Light");
        expect(wrapper.text()).toContain("Dark");
        expect(wrapper.text().toLowerCase()).not.toContain("default");
    });

    test("§7.5 themeLabels override the default title-case label", () => {
        const wrapper = mount(ThemePicker, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: ["light", "dark"],
                themeLabels: { light: "Bright", dark: "Midnight" },
            },
            attachTo: document.body,
        });
        expect(wrapper.text()).toContain("Bright");
        expect(wrapper.text()).toContain("Midnight");
    });
});

describe("ThemePicker — dynamic loading (§5, §7.6–§7.11)", () => {
    test("§7.6 default initial value is 'light' when present in themes", async () => {
        mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
        mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: ["dark", "abyss"] },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.7 injects a managed <link> with the resolved href", async () => {
        mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
            attachTo: document.body,
        });
        await flush();
        await flush();
        const link = getManagedLink();
        expect(link).not.toBeNull();
        expect(link!.rel).toBe("stylesheet");
        expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });

    test("§7.8 selecting a radio updates href, data-theme, and emits change", async () => {
        // Use a host so the v-model:value binding round-trips.
        const Host = defineComponent({
            components: { ThemePicker },
            setup() {
                const theme = ref("");
                const changes: string[] = [];
                return { theme, changes };
            },
            template: `
                <ThemePicker
                    label="Theme"
                    :themes-url="'${URL_TRAILING}'"
                    :themes="['light', 'dark', 'abyss']"
                    v-model:value="theme"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        const radios = wrapper.findAll('input[type="radio"]');
        await radios[2].setValue();
        await flush();
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
        expect((wrapper.vm as any).changes).toContain("abyss");
    });

    test("§7.9 persists to localStorage and reads back on fresh mount", async () => {
        const Host = defineComponent({
            components: { ThemePicker },
            setup() {
                const theme = ref("");
                return { theme };
            },
            template: `
                <ThemePicker
                    label="Theme"
                    :themes-url="'${URL_TRAILING}'"
                    :themes="['light', 'dark', 'abyss']"
                    v-model:value="theme"
                    storage-key="lily-theme"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        const radios = wrapper.findAll('input[type="radio"]');
        await radios[1].setValue();
        await flush();
        await flush();
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        wrapper.unmount();

        document.documentElement.removeAttribute("data-theme");
        document.head
            .querySelectorAll("link[data-lily-theme-picker]")
            .forEach((n) => n.remove());

        mount(ThemePicker, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                storageKey: "lily-theme",
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.10 a supplied value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-theme", "abyss");
        mount(ThemePicker, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                value: "light",
                storageKey: "lily-theme",
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.11 missing trailing slash on themesUrl still yields one slash", async () => {
        mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_NO_TRAILING, themes: THEMES },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });
});

describe("ThemePicker — spread + custom slot (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the fieldset", () => {
        const wrapper = mount(ThemePicker, {
            props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES },
            attrs: { "data-testid": "tp" },
            attachTo: document.body,
        });
        expect(wrapper.find("fieldset").attributes("data-testid")).toBe("tp");
    });

    test("§7.13 default slot receives SlotArgs", () => {
        const wrapper = mount(ThemePicker, {
            props: {
                label: "Theme",
                themesUrl: URL_TRAILING,
                themes: THEMES,
                name: "scheme",
            },
            slots: {
                default: (args: any) =>
                    h(
                        "div",
                        {
                            "data-testid": "custom",
                            "data-name": args.name,
                        },
                        args.themes.join(","),
                    ),
            },
            attachTo: document.body,
        });
        const custom = wrapper.find('[data-testid="custom"]');
        expect(custom.text()).toBe("light,dark,abyss");
        expect(custom.attributes("data-name")).toBe("scheme");
    });
});
