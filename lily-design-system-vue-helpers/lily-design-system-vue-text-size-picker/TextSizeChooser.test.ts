import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

import TextSizeChooser, { sizeName } from "./TextSizeChooser.vue";

const SIZES = ["small", "medium", "large", "x-large"];
/** Index of "medium" — the default initial value, so the default active option. */
const MEDIUM = SIZES.indexOf("medium");

/** Let Vue's scheduler, the onMounted effects, and any nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(TextSizeChooser, {
        props: { label: "Text size", sizes: SIZES, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function parts(wrapper: VueWrapper<any>) {
    return {
        button: wrapper.find("button.text-size-chooser-button"),
        list: wrapper.find("ul.text-size-chooser-list"),
        options: wrapper.findAll("li.text-size-chooser-option"),
    };
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-text-size");
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

describe("TextSizeChooser — pure helpers", () => {
    test("sizeName title-cases each hyphen-separated word", () => {
        expect(sizeName("x-large")).toBe("X Large");
        expect(sizeName("medium")).toBe("Medium");
        expect(sizeName("extra-extra-large")).toBe("Extra Extra Large");
    });

    test("sizeName leaves an already-capitalised word alone", () => {
        expect(sizeName("Large")).toBe("Large");
    });
});

/** Open the listbox and click the option for `slug`. */
async function pick(
    wrapper: VueWrapper<any>,
    slug: string,
    sizes: string[] = SIZES,
): Promise<void> {
    const { button, options } = parts(wrapper);
    await button.trigger("click");
    await options[sizes.indexOf(slug)].trigger("click");
}

describe("TextSizeChooser — markup contract (§4.2, §7.1–§7.5)", () => {
    test("§7.1 renders a button that controls a listbox", () => {
        const wrapper = build();
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
        expect(wrapper.classes()).toContain("text-size-chooser");
        expect(wrapper.classes()).toContain("my-hook");
    });

    test("§7.1 the button renders the letter-A glyph, hidden from assistive tech", () => {
        const wrapper = build();
        const icon = wrapper.find(".text-size-chooser-icon");
        // U+0041 LATIN CAPITAL LETTER A — a real glyph in every font stack,
        // unlike U+1F5DB DECREASE FONT SIZE SYMBOL.
        expect(icon.text()).toBe("A");
        expect(icon.attributes("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        const wrapper = build({ label: "Choose text size" });
        const { button, list } = parts(wrapper);
        expect(button.attributes("aria-label")).toBe("Choose text size");
        expect(list.attributes("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the hidden input carries the supplied name", async () => {
        const wrapper = build({ name: "font-size" });
        await flush();
        expect(parts(wrapper).options.length).toBe(SIZES.length);
        const hidden = wrapper.find('input[type="hidden"]').element as HTMLInputElement;
        expect(hidden.name).toBe("font-size");
        expect(hidden.value).toBe("medium");
    });

    test("§7.3 the hidden input defaults to name=text-size", async () => {
        const wrapper = build();
        await flush();
        const hidden = wrapper.find('input[type="hidden"]').element as HTMLInputElement;
        expect(hidden.name).toBe("text-size");
    });

    test("§7.4 the listbox is hidden until the button is activated", async () => {
        const wrapper = build();
        const { button, list } = parts(wrapper);
        expect(list.element.hasAttribute("hidden")).toBe(true);
        await button.trigger("click");
        await flush();
        expect(list.element.hasAttribute("hidden")).toBe(false);
        expect(button.attributes("aria-expanded")).toBe("true");
    });

    test("§7.4 the active size is the aria-selected option", async () => {
        const wrapper = build();
        await flush();
        await parts(wrapper).button.trigger("click");
        await flush();
        const selected = wrapper.findAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].text().trim()).toBe("Medium");
    });

    test("§7.5 default labels title-case the slug per hyphen-word", () => {
        const wrapper = build();
        const text = wrapper.text();
        expect(text).toContain("Small");
        expect(text).toContain("Medium");
        expect(text).toContain("Large");
        expect(text).toContain("X Large");
    });

    test("§7.5 sizeLabels override the default title-case label", () => {
        const wrapper = build({
            sizes: ["small", "x-large"],
            sizeLabels: { small: "Compact", "x-large": "Huge" },
        });
        const text = wrapper.text();
        expect(text).toContain("Compact");
        expect(text).toContain("Huge");
    });
});

describe("TextSizeChooser — keyboard contract (APG listbox)", () => {
    async function openWith(key: string, props: Record<string, unknown> = {}) {
        const wrapper = build(props);
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

    test("§7.14 opening starts on the selected option", async () => {
        const { el } = await openWith("ArrowDown");
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[MEDIUM].id);
    });

    test("§7.14 ArrowUp opens with the last option active", async () => {
        const { el } = await openWith("ArrowUp");
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[SIZES.length - 1].id,
        );
    });

    test("§7.14 opening moves focus to the listbox", async () => {
        const { el } = await openWith("ArrowDown");
        expect(document.activeElement).toBe(el);
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        const { list, el } = await openWith("ArrowDown");
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[MEDIUM].id);
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[MEDIUM + 1].id,
        );
        // Clamp at the top: three ArrowUps from index 2 cannot pass index 0.
        await list.trigger("keydown", { key: "ArrowUp" });
        await list.trigger("keydown", { key: "ArrowUp" });
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.15 ArrowDown clamps at the last option", async () => {
        const { list, el } = await openWith("ArrowUp");
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[SIZES.length - 1].id,
        );
    });

    test("§7.15 the active option carries data-active", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        const active = el.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(el.children[MEDIUM + 1].id);
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "End" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[SIZES.length - 1].id,
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
        expect(document.documentElement.dataset.textSize).toBe("large");
    });

    test("§7.16 Space selects the active option", async () => {
        const { list } = await openWith("ArrowUp");
        await list.trigger("keydown", { key: " " });
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
    });

    test("§7.16 Enter returns focus to the button", async () => {
        const { button, list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button.element);
    });

    test("§7.16 Escape closes without changing the size", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.textSize).toBe("medium");
    });

    test("§7.16 Escape returns focus to the button", async () => {
        const { button, list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(document.activeElement).toBe(button.element);
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
        await list.trigger("keydown", { key: "x" });
        // "X Large" is the last entry in SIZES.
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[SIZES.length - 1].id,
        );
    });

    test("§7.17 typeahead wraps around to find an earlier match", async () => {
        const { list, el } = await openWith("ArrowUp");
        // Active is the last option; "Small" is index 0, so the search wraps.
        await list.trigger("keydown", { key: "s" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.17 modified keys do not trigger typeahead", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "x", ctrlKey: true });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[MEDIUM].id);
    });

    test("§7.17 clicking an option selects and applies it", async () => {
        const wrapper = build();
        await flush();
        await pick(wrapper, "x-large");
        await flush();
        expect(document.documentElement.dataset.textSize).toBe("x-large");
    });

    test("§7.17 clicking outside the root closes the listbox", async () => {
        const wrapper = build();
        await flush();
        const { button, list } = parts(wrapper);
        await button.trigger("click");
        await flush();
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(false);
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await flush();
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(true);
    });

    test("§7.17 clicking the button again closes the listbox", async () => {
        const wrapper = build();
        await flush();
        const { button, list } = parts(wrapper);
        await button.trigger("click");
        await flush();
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(false);
        await button.trigger("click");
        await flush();
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(true);
    });
});

describe("TextSizeChooser — size application (§5, §7.6–§7.10)", () => {
    test("§7.6 initial value defaults to medium when present", async () => {
        build();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("medium");
    });

    test("§7.6 initial value falls back to sizes[0] when no medium", async () => {
        build({ sizes: ["tiny", "huge"] });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("tiny");
    });

    test("§7.6 defaultValue wins over the medium/first fallback", async () => {
        build({ defaultValue: "large" });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    });

    test("§7.7 applies data-text-size to document.documentElement", async () => {
        build({ defaultValue: "x-large" });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("x-large");
    });

    test("§7.7 a custom target receives data-text-size instead of <html>", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        build({ defaultValue: "large", target });
        await flush();
        expect(target.getAttribute("data-text-size")).toBe("large");
        expect(document.documentElement.hasAttribute("data-text-size")).toBe(false);
        target.remove();
    });

    test("§7.8 selecting an option updates data-text-size and emits change", async () => {
        const Host = defineComponent({
            components: { TextSizeChooser },
            setup() {
                const size = ref("medium");
                const changes: string[] = [];
                return { size, changes };
            },
            template: `
                <TextSizeChooser
                    label="Text size"
                    :sizes="['small', 'medium', 'large', 'x-large']"
                    v-model:value="size"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        wrappers.push(wrapper);
        await flush();
        await wrapper.find("button.text-size-chooser-button").trigger("click");
        await wrapper.findAll("li.text-size-chooser-option")[3].trigger("click");
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("x-large");
        expect((wrapper.vm as any).changes).toContain("x-large");
        expect((wrapper.vm as any).size).toBe("x-large");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const wrapper = build({ storageKey: "lily-text-size" });
        await flush();
        await pick(wrapper, "large");
        await flush();
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        wrapper.unmount();
        resetRoot();

        build({ storageKey: "lily-text-size" });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    });

    test("§7.10 a supplied non-empty value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-text-size", "small");
        build({
            value: "large",
            storageKey: "lily-text-size",
            defaultValue: "x-large",
        });
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    });

    test("§7.10 the hidden input mirrors the resolved value", async () => {
        const wrapper = build({ defaultValue: "x-large" });
        await flush();
        const hidden = wrapper.find('input[type="hidden"]').element as HTMLInputElement;
        expect(hidden.value).toBe("x-large");
    });
});

describe("TextSizeChooser — spread + custom slot (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the root div", () => {
        const wrapper = build({}, { attrs: { "data-testid": "ts" } });
        expect(wrapper.element.tagName).toBe("DIV");
        expect(wrapper.attributes("data-testid")).toBe("ts");
    });

    test("§7.13 the default slot replaces the button glyph and receives SlotArgs", async () => {
        let captured: any;
        const wrapper = build(
            { value: "large" },
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
        // The custom glyph replaces the default "A" inside the button.
        expect(wrapper.find("button.text-size-chooser-button").text()).toContain(
            "custom glyph",
        );
        expect(wrapper.find(".text-size-chooser-icon").exists()).toBe(false);
        expect(captured.open).toBe(false);
        expect(captured.value).toBe("large");
        expect(captured.labelFor("x-large")).toBe("X Large");
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
        await wrapper.find("button.text-size-chooser-button").trigger("click");
        await flush();
        expect(seen[0]).toBe(false);
        expect(seen[seen.length - 1]).toBe(true);
    });

    test("§7.13 labelFor in SlotArgs respects sizeLabels overrides", async () => {
        let captured: any;
        build(
            { sizeLabels: { "x-large": "Huge" } },
            {
                slots: {
                    default: (args: any) => {
                        captured = args;
                        return "glyph";
                    },
                },
            },
        );
        await flush();
        expect(captured.labelFor("x-large")).toBe("Huge");
        expect(captured.labelFor("small")).toBe("Small");
    });
});
