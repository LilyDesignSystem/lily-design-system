import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defineComponent, nextTick, ref } from "vue";

import MotionPicker, { motionName, prefersReducedMotion } from "./MotionPicker.vue";

const MOTIONS = ["no-preference", "reduce"];
/** Index of "no-preference" — the default initial value when the OS reports none. */
const NO_PREFERENCE = MOTIONS.indexOf("no-preference");

/** Let Vue's scheduler, the onMounted effects, and any nextTick chains settle. */
async function flush(): Promise<void> {
    await nextTick();
    await new Promise((r) => setTimeout(r, 0));
    await nextTick();
}

/** Set (or clear) window.matchMedia's answer to (prefers-reduced-motion: reduce). */
function mockReducedMotion(matches: boolean): void {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
}

const wrappers: VueWrapper<any>[] = [];

function build(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(MotionPicker, {
        props: { label: "Motion", motions: MOTIONS, ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    return wrapper;
}

function parts(wrapper: VueWrapper<any>) {
    return {
        button: wrapper.find("button.motion-picker-button"),
        list: wrapper.find("ul.motion-picker-list"),
        options: wrapper.findAll("li.motion-picker-option"),
    };
}

function resetRoot(): void {
    document.documentElement.removeAttribute("data-motion");
}

beforeEach(() => {
    resetRoot();
    mockReducedMotion(false);
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
    vi.restoreAllMocks();
});

describe("MotionPicker — pure helpers", () => {
    test("motionName title-cases each hyphen-separated word", () => {
        expect(motionName("no-preference")).toBe("No Preference");
        expect(motionName("reduce")).toBe("Reduce");
    });

    test("motionName leaves an already-capitalised word alone", () => {
        expect(motionName("Reduce")).toBe("Reduce");
    });

    test("prefersReducedMotion reads (prefers-reduced-motion: reduce)", () => {
        mockReducedMotion(true);
        expect(prefersReducedMotion()).toBe(true);
        mockReducedMotion(false);
        expect(prefersReducedMotion()).toBe(false);
    });
});

/** Open the listbox and click the option for `slug`. */
async function pick(
    wrapper: VueWrapper<any>,
    slug: string,
    motions: string[] = MOTIONS,
): Promise<void> {
    const { button, options } = parts(wrapper);
    await button.trigger("click");
    await options[motions.indexOf(slug)].trigger("click");
}

describe("MotionPicker — markup contract (§4.2, §7.1–§7.5)", () => {
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
        expect(wrapper.classes()).toContain("motion-picker");
        expect(wrapper.classes()).toContain("my-hook");
    });

    test("§7.1 the button renders the pause glyph, hidden from assistive tech", () => {
        const wrapper = build();
        const icon = wrapper.find(".motion-picker-icon");
        // U+23F8 PAUSE SIGN + U+FE0E (text presentation).
        expect(icon.text()).toBe("\u23F8\uFE0E");
        expect(icon.attributes("aria-hidden")).toBe("true");
    });

    test("§7.2 aria-label names the button and the listbox", () => {
        const wrapper = build({ label: "Choose motion" });
        const { button, list } = parts(wrapper);
        expect(button.attributes("aria-label")).toBe("Choose motion");
        expect(list.attributes("aria-label")).toBe("Choose motion");
    });

    test("§7.3 one option per motion; the hidden input carries the supplied name", async () => {
        const wrapper = build({ name: "reduced-motion" });
        await flush();
        expect(parts(wrapper).options.length).toBe(MOTIONS.length);
        const hidden = wrapper.find('input[type="hidden"]').element as HTMLInputElement;
        expect(hidden.name).toBe("reduced-motion");
        expect(hidden.value).toBe("no-preference");
    });

    test("§7.3 the hidden input defaults to name=motion", async () => {
        const wrapper = build();
        await flush();
        const hidden = wrapper.find('input[type="hidden"]').element as HTMLInputElement;
        expect(hidden.name).toBe("motion");
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

    test("§7.4 the active motion is the aria-selected option", async () => {
        const wrapper = build();
        await flush();
        await parts(wrapper).button.trigger("click");
        await flush();
        const selected = wrapper.findAll('[role="option"][aria-selected="true"]');
        expect(selected.length).toBe(1);
        expect(selected[0].text().trim()).toBe("No Preference");
    });

    test("§7.5 default labels title-case the slug per hyphen-word", () => {
        const wrapper = build();
        const text = wrapper.text();
        expect(text).toContain("No Preference");
        expect(text).toContain("Reduce");
    });

    test("§7.5 motionLabels override the default title-case label", () => {
        const wrapper = build({
            motionLabels: { "no-preference": "Full motion", reduce: "Reduced motion" },
        });
        const text = wrapper.text();
        expect(text).toContain("Full motion");
        expect(text).toContain("Reduced motion");
    });
});

describe("MotionPicker — keyboard contract (APG listbox)", () => {
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
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[NO_PREFERENCE].id);
    });

    test("§7.14 ArrowUp opens with the last option active", async () => {
        const { el } = await openWith("ArrowUp");
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[MOTIONS.length - 1].id,
        );
    });

    test("§7.14 opening moves focus to the listbox", async () => {
        const { el } = await openWith("ArrowDown");
        expect(document.activeElement).toBe(el);
    });

    test("§7.15 ArrowDown / ArrowUp move the active descendant and clamp", async () => {
        const { list, el } = await openWith("ArrowDown");
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[NO_PREFERENCE].id);
        await list.trigger("keydown", { key: "ArrowDown" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[NO_PREFERENCE + 1].id,
        );
        // Clamp at the top: two ArrowUps from index 1 cannot pass index 0.
        await list.trigger("keydown", { key: "ArrowUp" });
        await list.trigger("keydown", { key: "ArrowUp" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.15 the active option carries data-active", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "ArrowDown" });
        const active = el.querySelectorAll("[data-active]");
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(el.children[NO_PREFERENCE + 1].id);
    });

    test("§7.15 Home and End jump to the first and last option", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "End" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[MOTIONS.length - 1].id,
        );
        await list.trigger("keydown", { key: "Home" });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[0].id);
    });

    test("§7.16 Enter selects the active option, applies it, and closes", async () => {
        const { button, list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "End" });
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
        expect(document.documentElement.dataset.motion).toBe("reduce");
    });

    test("§7.16 Enter returns focus to the button", async () => {
        const { button, list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Enter" });
        await flush();
        expect(document.activeElement).toBe(button.element);
    });

    test("§7.16 Escape closes without changing the motion", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "End" });
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("hidden")).toBe(true);
        expect(document.documentElement.dataset.motion).toBe("no-preference");
    });

    test("§7.16 Escape returns focus to the button", async () => {
        const { button, list } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(document.activeElement).toBe(button.element);
    });

    test("§7.16 aria-activedescendant is dropped once the listbox closes", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "Escape" });
        await flush();
        expect(el.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("§7.17 typeahead moves the active descendant by label prefix", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "r" });
        expect(el.getAttribute("aria-activedescendant")).toBe(
            el.children[MOTIONS.length - 1].id,
        );
    });

    test("§7.17 modified keys do not trigger typeahead", async () => {
        const { list, el } = await openWith("ArrowDown");
        await list.trigger("keydown", { key: "r", ctrlKey: true });
        expect(el.getAttribute("aria-activedescendant")).toBe(el.children[NO_PREFERENCE].id);
    });

    test("§7.17 clicking an option selects it, applies it, and closes the listbox", async () => {
        const wrapper = build();
        await flush();
        await pick(wrapper, "reduce");
        await flush();
        expect(document.documentElement.dataset.motion).toBe("reduce");
        const { button, list } = parts(wrapper);
        expect((list.element as HTMLElement).hasAttribute("hidden")).toBe(true);
        expect(button.attributes("aria-expanded")).toBe("false");
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

describe("MotionPicker — motion application (§5, §7.6–§7.10)", () => {
    test("§7.6 initial value is 'no-preference' when the OS reports no preference", async () => {
        mockReducedMotion(false);
        build();
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("no-preference");
    });

    test("§7.6 initial value is 'reduce' when the OS reports prefers-reduced-motion", async () => {
        mockReducedMotion(true);
        build();
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("reduce");
    });

    test("§7.6 falls back to motions[0] when neither OS slug is offered", async () => {
        mockReducedMotion(true);
        build({ motions: ["standard", "minimal"] });
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("standard");
    });

    test("§7.6 defaultValue wins over the OS-preference fallback", async () => {
        mockReducedMotion(true);
        build({ defaultValue: "no-preference" });
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("no-preference");
    });

    test("§7.7 applies data-motion to document.documentElement", async () => {
        build({ defaultValue: "reduce" });
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("reduce");
    });

    test("§7.7 a custom target receives data-motion instead of <html>", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        build({ defaultValue: "reduce", target });
        await flush();
        expect(target.getAttribute("data-motion")).toBe("reduce");
        expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
        target.remove();
    });

    test("§7.8 selecting an option updates data-motion and emits change", async () => {
        const Host = defineComponent({
            components: { MotionPicker },
            setup() {
                const motion = ref("no-preference");
                const changes: string[] = [];
                return { motion, changes };
            },
            template: `
                <MotionPicker
                    label="Motion"
                    :motions="['no-preference', 'reduce']"
                    v-model:value="motion"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        wrappers.push(wrapper);
        await flush();
        await wrapper.find("button.motion-picker-button").trigger("click");
        await wrapper.findAll("li.motion-picker-option")[1].trigger("click");
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("reduce");
        expect((wrapper.vm as any).changes).toContain("reduce");
        expect((wrapper.vm as any).motion).toBe("reduce");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const wrapper = build({ storageKey: "lily-motion" });
        await flush();
        await pick(wrapper, "reduce");
        await flush();
        expect(localStorage.getItem("lily-motion")).toBe("reduce");
        wrapper.unmount();
        resetRoot();

        build({ storageKey: "lily-motion" });
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("reduce");
    });

    test("§7.10 a supplied non-empty value prop wins over storage, OS preference, and defaults", async () => {
        mockReducedMotion(true);
        localStorage.setItem("lily-motion", "reduce");
        build({
            value: "no-preference",
            storageKey: "lily-motion",
        });
        await flush();
        expect(document.documentElement.getAttribute("data-motion")).toBe("no-preference");
    });

    test("§7.10 the hidden input mirrors the resolved value", async () => {
        const wrapper = build({ defaultValue: "reduce" });
        await flush();
        const hidden = wrapper.find('input[type="hidden"]').element as HTMLInputElement;
        expect(hidden.value).toBe("reduce");
    });
});

describe("MotionPicker — spread + custom slot (§7.12–§7.13)", () => {
    test("§7.12 extra attributes spread onto the root div", () => {
        const wrapper = build({}, { attrs: { "data-testid": "mp" } });
        expect(wrapper.element.tagName).toBe("DIV");
        expect(wrapper.attributes("data-testid")).toBe("mp");
    });

    test("§7.13 the default slot replaces the button glyph and receives SlotArgs", async () => {
        let captured: any;
        const wrapper = build(
            { value: "reduce" },
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
        expect(wrapper.find("button.motion-picker-button").text()).toContain(
            "custom glyph",
        );
        expect(wrapper.find(".motion-picker-icon").exists()).toBe(false);
        expect(captured.open).toBe(false);
        expect(captured.value).toBe("reduce");
        expect(captured.labelFor("reduce")).toBe("Reduce");
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
        await wrapper.find("button.motion-picker-button").trigger("click");
        await flush();
        expect(seen[0]).toBe(false);
        expect(seen[seen.length - 1]).toBe(true);
    });

    test("§7.13 labelFor in SlotArgs respects motionLabels overrides", async () => {
        let captured: any;
        build(
            { motionLabels: { reduce: "Less motion" } },
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
        expect(captured.labelFor("reduce")).toBe("Less motion");
        expect(captured.labelFor("no-preference")).toBe("No Preference");
    });
});

describe("MotionPicker — accessibility hardening (§7.19–§7.22)", () => {
    async function openPicker(
        motions: string[] = MOTIONS,
        extra: Record<string, unknown> = {},
    ) {
        const wrapper = build({ motions, ...extra });
        await flush();
        const { button, list } = parts(wrapper);
        await button.trigger("click");
        await flush();
        return { button, list, el: list.element as HTMLElement };
    }

    const active = (el: HTMLElement) =>
        el.querySelector("[data-active]")?.textContent?.trim();

    test("§7.19 Tab from the open list puts focus on the button before closing", async () => {
        const { button, list, el } = await openPicker();
        expect(document.activeElement).toBe(el);
        await list.trigger("keydown", { key: "Tab" });
        await flush();
        expect(document.activeElement).toBe(button.element);
        expect(el.hasAttribute("hidden")).toBe(true);
    });

    test("§7.20 a repeated typeahead character cycles through its matches", async () => {
        const { list, el } = await openPicker(["r1", "r2", "r3", "m"], {
            motionLabels: { r1: "Reduce a lot", r2: "Reduce more", r3: "Reduce most", m: "Minimal" },
            defaultValue: "m",
        });
        await list.trigger("keydown", { key: "r" });
        expect(active(el)).toBe("Reduce a lot");
        await list.trigger("keydown", { key: "r" });
        expect(active(el)).toBe("Reduce more");
        await list.trigger("keydown", { key: "r" });
        expect(active(el)).toBe("Reduce most");
    });

    test("§7.21 PageUp and PageDown move the cursor by ten, clamped", async () => {
        const many = Array.from(
            { length: 25 },
            (_, i) => `s${String(i).padStart(2, "0")}`,
        );
        const { list, el } = await openPicker(many);
        await list.trigger("keydown", { key: "PageDown" });
        expect(active(el)).toBe("S10");
        await list.trigger("keydown", { key: "PageDown" });
        expect(active(el)).toBe("S20");
        await list.trigger("keydown", { key: "PageDown" });
        expect(active(el)).toBe("S24");
        await list.trigger("keydown", { key: "PageUp" });
        expect(active(el)).toBe("S14");
    });

    test("§7.22 an empty list opens without aria-activedescendant", async () => {
        const { el } = await openPicker([]);
        expect(el.hasAttribute("hidden")).toBe(false);
        expect(el.getAttribute("aria-activedescendant")).toBeNull();
    });
});
