import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { defineComponent, h, ref } from "vue";

import TextSizeSelect from "./TextSizeSelect.vue";

const SIZES = ["small", "medium", "large", "x-large"];

function flush(): Promise<void> {
    return new Promise((r) => setTimeout(r, 0));
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
    resetRoot();
});

describe("TextSizeSelect — markup contract (§7.1–§7.5)", () => {
    test("§7.1 renders a native <select> root", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES },
            attachTo: document.body,
        });
        const select = wrapper.find("select.text-size-select");
        expect(select.exists()).toBe(true);
        expect(select.element.tagName).toBe("SELECT");
    });

    test("§7.2 aria-label is the supplied label", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Choose text size", sizes: SIZES },
            attachTo: document.body,
        });
        expect(wrapper.find("select").attributes("aria-label")).toBe("Choose text size");
    });

    test("§7.3 one option per size; the select carries the supplied name", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, name: "font-size" },
            attachTo: document.body,
        });
        const options = wrapper.findAll("option");
        expect(options.length).toBe(SIZES.length);
        expect(wrapper.find("select").attributes("name")).toBe("font-size");
    });

    test("§7.3 default name is text-size", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES },
            attachTo: document.body,
        });
        expect(wrapper.find("select").attributes("name")).toBe("text-size");
    });

    test("§7.4 each option carries the size slug as its value", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES },
            attachTo: document.body,
        });
        const options = wrapper.findAll("option");
        expect(options.map((o) => (o.element as HTMLOptionElement).value)).toEqual(SIZES);
    });

    test("§7.5 default labels title-case the slug per hyphen-word", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES },
            attachTo: document.body,
        });
        const text = wrapper.text();
        expect(text).toContain("Small");
        expect(text).toContain("Medium");
        expect(text).toContain("Large");
        expect(text).toContain("X Large");
    });

    test("§7.5 sizeLabels override the default label", () => {
        const wrapper = mount(TextSizeSelect, {
            props: {
                label: "Text size",
                sizes: ["small", "x-large"],
                sizeLabels: { small: "Compact", "x-large": "Huge" },
            },
            attachTo: document.body,
        });
        const text = wrapper.text();
        expect(text).toContain("Compact");
        expect(text).toContain("Huge");
    });
});

describe("TextSizeSelect — size application (§7.6–§7.10)", () => {
    test("§7.6 initial value defaults to medium when present", async () => {
        mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("medium");
    });

    test("§7.6 initial value falls back to sizes[0] when no medium", async () => {
        mount(TextSizeSelect, {
            props: { label: "Text size", sizes: ["tiny", "huge"] },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("tiny");
    });

    test("§7.6 defaultValue wins over the medium/first fallback", async () => {
        mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, defaultValue: "large" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    });

    test("§7.7 applies data-text-size to document.documentElement", async () => {
        mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, defaultValue: "x-large" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("x-large");
    });

    test("§7.7 a custom target receives data-text-size instead of <html>", async () => {
        const target = document.createElement("section");
        document.body.appendChild(target);
        mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, defaultValue: "large", target },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(target.getAttribute("data-text-size")).toBe("large");
        expect(document.documentElement.hasAttribute("data-text-size")).toBe(false);
        target.remove();
    });

    test("§7.8 selecting an option updates data-text-size and emits change", async () => {
        const Host = defineComponent({
            components: { TextSizeSelect },
            setup() {
                const size = ref("medium");
                const changes: string[] = [];
                return { size, changes };
            },
            template: `
                <TextSizeSelect
                    label="Text size"
                    :sizes="['small', 'medium', 'large', 'x-large']"
                    v-model:value="size"
                    default-value="medium"
                    @change="(v) => changes.push(v)"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        await wrapper.find("select").setValue("x-large");
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("x-large");
        expect((wrapper.vm as any).changes).toContain("x-large");
    });

    test("§7.9 persists to localStorage and reads back on a fresh mount", async () => {
        const Host = defineComponent({
            components: { TextSizeSelect },
            setup() {
                const size = ref("");
                return { size };
            },
            template: `
                <TextSizeSelect
                    label="Text size"
                    :sizes="['small', 'medium', 'large', 'x-large']"
                    v-model:value="size"
                    storage-key="lily-text-size"
                />
            `,
        });
        const wrapper = mount(Host, { attachTo: document.body });
        await flush();
        await flush();
        await wrapper.find("select").setValue("large");
        await flush();
        await flush();
        expect(localStorage.getItem("lily-text-size")).toBe("large");
        wrapper.unmount();
        resetRoot();

        mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES, storageKey: "lily-text-size" },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    });

    test("§7.10 a supplied non-empty value prop wins over storage and defaults", async () => {
        localStorage.setItem("lily-text-size", "small");
        mount(TextSizeSelect, {
            props: {
                label: "Text size",
                sizes: SIZES,
                value: "large",
                storageKey: "lily-text-size",
                defaultValue: "x-large",
            },
            attachTo: document.body,
        });
        await flush();
        await flush();
        expect(document.documentElement.getAttribute("data-text-size")).toBe("large");
    });
});

describe("TextSizeSelect — spread + custom slot (§7.12, §7.13)", () => {
    test("§7.12 extra attributes spread onto the select", () => {
        const wrapper = mount(TextSizeSelect, {
            props: { label: "Text size", sizes: SIZES },
            attrs: { "data-testid": "ts" },
            attachTo: document.body,
        });
        expect(wrapper.find("select").attributes("data-testid")).toBe("ts");
    });

    test("§7.13 default slot receives SlotArgs", () => {
        // Capture the scoped-slot args directly: jsdom does not reliably
        // render an <option> inserted into a <select> via a slot, so we
        // assert on the args the component hands the slot (the contract).
        let captured: any;
        mount(TextSizeSelect, {
            props: {
                label: "Text size",
                sizes: SIZES,
                name: "font-size",
            },
            slots: {
                default: (args: any) => {
                    captured = args;
                    return h("option", { value: "x" }, "x");
                },
            },
            attachTo: document.body,
        });
        expect(captured.sizes).toEqual(SIZES);
        expect(captured.name).toBe("font-size");
        expect(captured.labelFor("x-large")).toBe("X Large");
        expect(typeof captured.setSize).toBe("function");
    });
});
