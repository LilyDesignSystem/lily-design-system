import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { h } from "vue";

import MarkdownEditor, { nextMarkdownEditorId } from "./MarkdownEditor.vue";

const labels = {
    heading: "Heading",
    bold: "Bold",
    italic: "Italic",
    strikethrough: "Strikethrough",
    code: "Code",
    link: "Link",
    quote: "Quote",
    bulletList: "Bulleted list",
    numberedList: "Numbered list",
};

const wrappers: VueWrapper<any>[] = [];
afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
});

function setup(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(MarkdownEditor, {
        props: { label: "Message", toolbarLabel: "Formatting", labels, modelValue: "hello world", ...props },
        attachTo: document.body,
        ...options,
    });
    wrappers.push(wrapper);
    const textarea = wrapper.find("textarea").element as HTMLTextAreaElement;
    const button = (name: string) => wrapper.find(`button[aria-label="${name}"]`);
    return { wrapper, textarea, button };
}

function select(textarea: HTMLTextAreaElement, start: number, end: number) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
}

describe("structure", () => {
    it("renders a toolbar and a textarea under the base classes", () => {
        const { wrapper, textarea } = setup();
        expect(wrapper.find("div.markdown-editor").exists()).toBe(true);
        const bar = wrapper.find('[role="toolbar"]');
        expect(bar.attributes("aria-label")).toBe("Formatting");
        expect(bar.classes()).toContain("markdown-editor-toolbar");
        expect(textarea.className).toContain("markdown-editor-textarea");
        expect(textarea.getAttribute("aria-label")).toBe("Message");
    });

    it("renders one named button per labelled tool, in order", () => {
        const { wrapper } = setup();
        expect(wrapper.findAll("button").map((b) => b.attributes("aria-label"))).toEqual(Object.values(labels));
    });

    it("omits a tool that has no label", () => {
        const { wrapper } = setup({ labels: { bold: "Bold" } });
        expect(wrapper.findAll("button").length).toBe(1);
    });

    it("honours the tools prop for subset and order", () => {
        const { wrapper } = setup({ tools: ["link", "bold"] });
        expect(wrapper.findAll("button").map((b) => b.attributes("data-tool"))).toEqual(["link", "bold"]);
    });

    it("every button is type=button so it never submits a form", () => {
        const { wrapper } = setup();
        for (const b of wrapper.findAll("button")) expect(b.attributes("type")).toBe("button");
    });

    it("icons are decorative", () => {
        const { wrapper } = setup();
        for (const svg of wrapper.findAll("svg")) expect(svg.attributes("aria-hidden")).toBe("true");
    });

    it("the toolbar controls the textarea", () => {
        const { wrapper, textarea } = setup();
        expect(wrapper.find('[role="toolbar"]').attributes("aria-controls")).toBe(textarea.id);
    });

    it("passes name, rows, placeholder, required through to the textarea", () => {
        const { textarea } = setup({ name: "body", rows: 6, placeholder: "Type", required: true });
        expect(textarea.name).toBe("body");
        expect(textarea.rows).toBe(6);
        expect(textarea.placeholder).toBe("Type");
        expect(textarea.required).toBe(true);
    });

    it("merges the class and passes attributes onto the root", () => {
        const { wrapper } = setup({}, { attrs: { class: "mine", "data-x": "1" } });
        const root = wrapper.find(".markdown-editor");
        expect(root.attributes("class")).toBe("markdown-editor mine");
        expect(root.attributes("data-x")).toBe("1");
    });

    it("ships no English of its own: no tool labels, no placeholder text", () => {
        const { wrapper } = setup({ labels: {} });
        expect(wrapper.findAll("button").length).toBe(0);
        expect(wrapper.find("textarea").attributes("placeholder")).toBeUndefined();
    });

    it("ids are unique per editor", () => {
        expect(nextMarkdownEditorId()).not.toBe(nextMarkdownEditorId());
    });
});

describe("tools", () => {
    it("bold wraps the selection, updates the textarea and emits update:modelValue and change", async () => {
        const { wrapper, textarea, button } = setup();
        select(textarea, 0, 5);
        await button("Bold").trigger("click");
        expect(textarea.value).toBe("**hello** world");
        expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["**hello** world"]);
        expect(wrapper.emitted("change")!.at(-1)).toEqual(["**hello** world"]);
    });

    it("keeps the selection on the formatted text, ready for the next tool", async () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        await button("Bold").trigger("click");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    it("pressing the same tool again takes the formatting off", async () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        await button("Bold").trigger("click");
        await button("Bold").trigger("click");
        expect(textarea.value).toBe("hello world");
    });

    it("list tools prefix the selected lines", async () => {
        const { textarea, button } = setup({ modelValue: "a\nb" });
        select(textarea, 0, 3);
        await button("Numbered list").trigger("click");
        expect(textarea.value).toBe("1. a\n2. b");
    });

    it("link selects the address placeholder", async () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        await button("Link").trigger("click");
        expect(textarea.value).toBe("[hello](https://) world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    it("the heading level is a prop", async () => {
        const { textarea, button } = setup({ headingLevel: 3 });
        select(textarea, 0, 0);
        await button("Heading").trigger("click");
        expect(textarea.value).toBe("### hello world");
    });

    it("typing updates the value and emits", async () => {
        const { wrapper } = setup({ modelValue: "" });
        const ta = wrapper.find("textarea");
        await ta.setValue("ab");
        expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["ab"]);
        expect(wrapper.emitted("change")!.at(-1)).toEqual(["ab"]);
    });

    it("moves focus back to the textarea after a tool runs", async () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        await button("Italic").trigger("click");
        expect(document.activeElement).toBe(textarea);
    });

    it("a new modelValue from the parent is shown", async () => {
        const { wrapper, textarea } = setup();
        await wrapper.setProps({ modelValue: "changed" });
        expect(textarea.value).toBe("changed");
    });
});

describe("shortcuts", () => {
    it("Ctrl+B bolds", async () => {
        const { wrapper, textarea } = setup();
        select(textarea, 0, 5);
        await wrapper.find("textarea").trigger("keydown", { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("**hello** world");
    });

    it("Cmd+I italicises", async () => {
        const { wrapper, textarea } = setup();
        select(textarea, 0, 5);
        await wrapper.find("textarea").trigger("keydown", { key: "i", metaKey: true });
        expect(textarea.value).toBe("*hello* world");
    });

    it("a shortcut for a tool that is not shown does nothing", async () => {
        const { wrapper, textarea } = setup({ tools: ["code"] });
        select(textarea, 0, 5);
        await wrapper.find("textarea").trigger("keydown", { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("hello world");
    });

    it("plain letters are untouched", async () => {
        const { wrapper, textarea } = setup();
        select(textarea, 0, 5);
        await wrapper.find("textarea").trigger("keydown", { key: "b" });
        expect(textarea.value).toBe("hello world");
    });
});

describe("toolbar keyboard", () => {
    it("only one button is in the tab order (roving tabindex)", () => {
        const { wrapper } = setup();
        const tabbable = wrapper.findAll("button").filter((b) => b.attributes("tabindex") === "0");
        expect(tabbable.length).toBe(1);
        expect(tabbable[0].attributes("data-tool")).toBe("heading");
    });

    it("arrows move focus and the tab stop, clamping at the ends", async () => {
        const { wrapper } = setup();
        const buttons = wrapper.findAll("button");
        (buttons[0].element as HTMLElement).focus();
        await buttons[0].trigger("keydown", { key: "ArrowRight" });
        expect(document.activeElement).toBe(buttons[1].element);
        expect(buttons[1].attributes("tabindex")).toBe("0");
        expect(buttons[0].attributes("tabindex")).toBe("-1");
        await buttons[1].trigger("keydown", { key: "ArrowLeft" });
        await buttons[0].trigger("keydown", { key: "ArrowLeft" });
        expect(document.activeElement).toBe(buttons[0].element);
    });

    it("Home and End jump to the ends", async () => {
        const { wrapper } = setup();
        const buttons = wrapper.findAll("button");
        (buttons[2].element as HTMLElement).focus();
        await buttons[2].trigger("keydown", { key: "End" });
        expect(document.activeElement).toBe(buttons[buttons.length - 1].element);
        await buttons[buttons.length - 1].trigger("keydown", { key: "Home" });
        expect(document.activeElement).toBe(buttons[0].element);
    });
});

describe("disabled and readonly", () => {
    it("disabled disables the textarea and every button", () => {
        const { wrapper, textarea } = setup({ disabled: true });
        expect(textarea.disabled).toBe(true);
        for (const b of wrapper.findAll("button")) expect((b.element as HTMLButtonElement).disabled).toBe(true);
    });

    it("readonly keeps the text unchangeable by a tool", async () => {
        const { textarea, button } = setup({ readonly: true });
        select(textarea, 0, 5);
        await button("Bold").trigger("click");
        expect(textarea.value).toBe("hello world");
    });
});

describe("icon slot", () => {
    it("draws a default path per tool", () => {
        const { wrapper } = setup();
        expect(wrapper.findAll("svg path").length).toBe(9);
    });

    it("the icon slot replaces them", () => {
        const { wrapper } = setup({}, { slots: { icon: (p: { tool: string }) => h("span", { "data-icon": p.tool }, "x") } });
        expect(wrapper.findAll("svg").length).toBe(0);
        expect(wrapper.findAll("[data-icon]").length).toBe(9);
    });
});
