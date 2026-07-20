import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

import ThemeSelect, {
    matchSystemTheme,
    normaliseThemesUrl,
    themeHref,
    themeName,
} from "./ThemeSelect.vue";

const THEMES = ["light", "dark", "abyss"];
const URL_TRAILING = "/assets/themes/";
const URL_NO_TRAILING = "/assets/themes";

function getManagedLink(name = "theme"): HTMLLinkElement | null {
    return document.head.querySelector<HTMLLinkElement>(
        `link[data-lily-theme-select="${name}"]`,
    );
}

/** Let Vue's scheduler, the onMounted effects, and any nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown>, options: Record<string, unknown> = {}) {
    const wrapper = mount(ThemeSelect, {
        props: { label: "Theme", themesUrl: URL_TRAILING, themes: THEMES, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function parts(wrapper: VueWrapper<any>) {
    return {
        button: wrapper.find("button.theme-select-button"),
        list: wrapper.find("ul.theme-select-list"),
        options: wrapper.findAll("li.theme-select-option"),
    };
}

/**
 * jsdom ships no `matchMedia`, so `matchSystemTheme` sees an undefined
 * function and bails out. Install a minimal stub for the tests that need
 * a colour-scheme preference; `afterEach` removes it again so the
 * "matchMedia is unavailable" case still exercises the real gap.
 */
function stubMatchMedia(prefersDark: boolean): void {
    Object.defineProperty(window, "matchMedia", {
        configurable: true,
        writable: true,
        value: (query: string) => ({
            matches: query.includes("prefers-color-scheme: dark")
                ? prefersDark
                : !prefersDark,
            media: query,
            addEventListener() {},
            removeEventListener() {},
        }),
    });
}

function clearMatchMedia(): void {
    delete (window as any).matchMedia;
}

beforeEach(() => {
    clearMatchMedia();
    document.documentElement.removeAttribute("data-theme");
    document.head
        .querySelectorAll("link[data-lily-theme-select]")
        .forEach((n) => n.remove());
    try {
        localStorage.clear();
    } catch {
        /* ignore */
    }
});

afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
    document.body.innerHTML = "";
    document.documentElement.removeAttribute("data-theme");
    clearMatchMedia();
});

describe("ThemeSelect — pure helpers", () => {
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

    test("themeName title-cases each hyphen-separated word", () => {
        expect(themeName("high-contrast")).toBe("High Contrast");
        expect(themeName("light")).toBe("Light");
        expect(
            themeName("united-kingdom-national-health-service-england-for-patients"),
        ).toBe("United Kingdom National Health Service England For Patients");
    });

    test("matchSystemTheme resolves dark when the OS prefers dark", () => {
        stubMatchMedia(true);
        expect(matchSystemTheme(THEMES)).toBe("dark");
    });

    test("matchSystemTheme resolves light when the OS does not prefer dark", () => {
        stubMatchMedia(false);
        expect(matchSystemTheme(THEMES)).toBe("light");
    });

    test("matchSystemTheme returns '' when the resolved slug is absent", () => {
        stubMatchMedia(true);
        expect(matchSystemTheme(["abyss", "light"])).toBe("");
        stubMatchMedia(false);
        expect(matchSystemTheme(["abyss", "dark"])).toBe("");
    });

    test("matchSystemTheme returns '' when matchMedia is unavailable (SSR)", () => {
        // jsdom does not implement matchMedia; the guard must hold.
        expect(window.matchMedia).toBeUndefined();
        expect(matchSystemTheme(THEMES)).toBe("");
    });
});

/** Open the listbox and click the option for `slug`. */
async function pick(
    wrapper: VueWrapper<any>,
    slug: string,
    themes: string[] = THEMES,
): Promise<void> {
    const { button, options } = parts(wrapper);
    await button.trigger("click");
    await options[themes.indexOf(slug)].trigger("click");
}

describe("ThemeSelect — markup contract (§4.2, §7.1–§7.5)", () => {
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
        expect(wrapper.classes()).toContain("theme-select");
        expect(wrapper.classes()).toContain("my-hook");
    });

    test("§7.1 the button renders the half-circle glyph, hidden from assistive tech", () => {
        const wrapper = build({});
        const icon = wrapper.find(".theme-select-icon");
        // U+25D1 CIRCLE WITH RIGHT HALF BLACK, decimal &#9681;
        expect(icon.text()).toBe("◑");
        expect(icon.attributes("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        const wrapper = build({ label: "Choose theme" });
        const { button, list } = parts(wrapper);
        expect(button.attributes("aria-label")).toBe("Choose theme");
        expect(list.attributes("aria-label")).toBe("Choose theme");
    });

    test("§7.3 one option per theme; the hidden input carries the supplied name", async () => {
        const wrapper = build({ name: "appearance" });
        await flush();
        expect(parts(wrapper).options.length).toBe(THEMES.length);
        const hidden = wrapper.find('input[type="hidden"]')
            .element as HTMLInputElement;
        expect(hidden.name).toBe("appearance");
        expect(hidden.value).toBe("light");
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

    test("§7.4 the active theme is the aria-selected option", async () => {
        const wrapper = build({});
        await flush();
        await parts(wrapper).button.trigger("click");
        await flush();
        const selected = wrapper.findAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].text().trim()).toBe("Light");
    });

    test("§7.5 default labels title-case the slug (no 'default' string)", () => {
        const wrapper = build({ themes: ["light", "dark"] });
        expect(wrapper.text()).toContain("Light");
        expect(wrapper.text()).toContain("Dark");
        expect(wrapper.text().toLowerCase()).not.toContain("default");
    });

    test("§7.5 themeLabels override the default title-case label", () => {
        const wrapper = build({
            themes: ["light", "dark"],
            themeLabels: { light: "Bright", dark: "Midnight" },
        });
        expect(wrapper.text()).toContain("Bright");
        expect(wrapper.text()).toContain("Midnight");
    });
});

describe("ThemeSelect — keyboard contract (APG listbox)", () => {
    async function openWith(key: string) {
        const wrapper = build({});
        await flush();
        const { button, list } = parts(wrapper);
        await button.trigger("keydown", { key });
        await flush();
        return { wrapper, button, list, el: list.element as HTMLElement };
    }

    test("§7.14 ArrowDown, Enter and Space all open the listbox", async () => {
        for (const key of ["ArrowDown", "Enter", " "]) {
            const { el } = await openWith(key);
            expect(el.hasAttribute("hidden")).toBe(false);
            while (wrappers.length) wrappers.pop()!.unmount();
        }
    });

    test("§7.14 ArrowUp opens with the last option active", async () => {
        const { el } = await openWith("ArrowUp");
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[THEMES.length - 1].id,
        );
    });

    test("§7.14 opening moves focus to the listbox", async () => {
        const { el } = await openWith("ArrowDown");
        expect(document.activeElement).toBe(el);
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        const { list, el } = await openWith("ArrowDown");
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[1].id);
        await list.trigger("keydown", { key: "ArrowUp" });
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.15 the active option carries data-active", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        const active = el.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(el.children[1].id);
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "End" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[THEMES.length - 1].id,
        );
        await list.trigger("keydown", { key: "Home" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.16 Enter selects the active option, applies it, and closes", async () => {
        const { button, list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.16 Enter returns focus to the button", async () => {
        const { button, list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button.element);
    });

    test("§7.16 Escape closes without changing the theme", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.16 Tab closes without stealing focus back to the button", async () => {
        const { button, list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Tab" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(document.activeElement).not.toBe(button.element);
    });

    test("§7.16 aria-activedescendant is dropped once the listbox closes", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("§7.17 typeahead moves the active descendant by label prefix", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "a" });
        // "Abyss" is index 2 in THEMES.
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[2].id);
    });

    test("§7.17 clicking an option selects and applies it", async () => {
        const wrapper = build({});
        await flush();
        await pick(wrapper, "abyss");
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });

    test("§7.17 clicking outside the root closes the listbox", async () => {
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

describe("ThemeSelect — dynamic loading (§5, §7.6–§7.11)", () => {
    test("§7.6 default initial value is 'light' when present in themes", async () => {
        build({});
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.6 default initial value falls back to themes[0] when 'light' is absent", async () => {
        build({ themes: ["dark", "abyss"] });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.7 injects a managed <link> with the resolved href", async () => {
        build({});
        await flush();
        const link = getManagedLink();
        expect(link).not.toBeNull();
        expect(link!.rel).toBe("stylesheet");
        expect(link!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });

    test("§7.8 selecting an option updates href, data-theme, and emits change", async () => {
        const Host = defineComponent({
            components: { ThemeSelect },
            setup() {
                const theme = ref("");
                const changes: string[] = [];
                return { theme, changes };
            },
            template: `
                <ThemeSelect
                    label="Theme"
                    :themes-url="'${URL_TRAILING}'"
                    :themes="['light', 'dark', 'abyss']"
                    v-model:value="theme"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        wrappers.push(wrapper);
        await flush();
        await wrapper.find("button.theme-select-button").trigger("click");
        await wrapper.findAll("li.theme-select-option")[2].trigger("click");
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
        expect(getManagedLink()!.href.endsWith("/assets/themes/abyss.css")).toBe(true);
        expect((wrapper.vm as any).changes).toContain("abyss");
        expect((wrapper.vm as any).theme).toBe("abyss");
    });

    test("§7.9 persists to localStorage and reads back on fresh mount", async () => {
        const wrapper = build({ storageKey: "lily-theme" });
        await flush();
        await pick(wrapper, "dark");
        await flush();
        expect(localStorage.getItem("lily-theme")).toBe("dark");
        wrapper.unmount();

        document.documentElement.removeAttribute("data-theme");
        document.head
            .querySelectorAll("link[data-lily-theme-select]")
            .forEach((n) => n.remove());

        build({ storageKey: "lily-theme" });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("§7.10 a supplied value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-theme", "abyss");
        build({ value: "light", storageKey: "lily-theme" });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("§7.11 missing trailing slash on themesUrl still yields one slash", async () => {
        build({ themesUrl: URL_NO_TRAILING });
        await flush();
        expect(getManagedLink()!.href.endsWith("/assets/themes/light.css")).toBe(true);
    });

    test("§7.11 the managed <link> is discriminated by name", async () => {
        build({ name: "editor-theme" });
        await flush();
        expect(getManagedLink("editor-theme")).not.toBeNull();
        expect(getManagedLink("theme")).toBeNull();
    });
});

describe("ThemeSelect — system-preference detection (detectFromSystem)", () => {
    test("detectFromSystem resolves the initial theme from prefers-color-scheme", async () => {
        stubMatchMedia(true);
        build({ detectFromSystem: true });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("dark");
    });

    test("detectFromSystem resolves light when the OS does not prefer dark", async () => {
        stubMatchMedia(false);
        build({ detectFromSystem: true });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("detection is off unless opted in", async () => {
        stubMatchMedia(true);
        build({});
        await flush();
        // Without the prop the default resolution wins: "light" is present.
        expect(document.documentElement.dataset.theme).toBe("light");
    });

    test("storage still beats detection", async () => {
        stubMatchMedia(true);
        localStorage.setItem("lily-theme", "abyss");
        build({ detectFromSystem: true, storageKey: "lily-theme" });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });

    test("an explicit value still beats detection", async () => {
        stubMatchMedia(true);
        build({ detectFromSystem: true, value: "abyss" });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("abyss");
    });

    test("detection falls through to defaultValue when the slug is unsupported", async () => {
        stubMatchMedia(true);
        build({ detectFromSystem: true, themes: ["abyss", "solarized"], defaultValue: "solarized" });
        await flush();
        expect(document.documentElement.dataset.theme).toBe("solarized");
    });
});

describe("ThemeSelect — spread + custom slot (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the root div", () => {
        const wrapper = build({}, { attrs: { "data-testid": "tp" } });
        expect(wrapper.element.tagName).toBe("DIV");
        expect(wrapper.attributes("data-testid")).toBe("tp");
    });

    test("§7.13 the default slot replaces the button glyph and receives SlotArgs", async () => {
        let captured: any;
        const wrapper = build(
            { value: "dark" },
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
        // The custom glyph replaces the default half-circle inside the button.
        expect(wrapper.find("button.theme-select-button").text()).toContain(
            "custom glyph",
        );
        expect(wrapper.find(".theme-select-icon").exists()).toBe(false);
        expect(captured.open).toBe(false);
        expect(captured.value).toBe("dark");
        expect(captured.labelFor("light")).toBe("Light");
    });

    test("§7.13 the slot's open flag tracks the listbox state", async () => {
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
        await wrapper.find("button.theme-select-button").trigger("click");
        await flush();
        expect(seen[0]).toBe(false);
        expect(seen[seen.length - 1]).toBe(true);
    });
});
