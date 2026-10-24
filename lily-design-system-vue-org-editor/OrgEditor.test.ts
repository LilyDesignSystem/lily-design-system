import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import { h } from "vue";

import OrgEditor, { nextOrgEditorId } from "./OrgEditor.vue";
import { TOOL_IDS, TOOL_GROUPS } from "./org-format";

const labels = {
    heading: "Heading",
    promote: "Promote",
    demote: "Demote",
    todo: "Task",
    priority: "Priority",
    scheduled: "Scheduled",
    deadline: "Deadline",
    timestamp: "Timestamp",
    bold: "Bold",
    italic: "Italic",
    underline: "Underline",
    strikethrough: "Strikethrough",
    code: "Code",
    verbatim: "Verbatim",
    link: "Link",
    bulletList: "Bulleted list",
    numberedList: "Numbered list",
    checkbox: "Checkbox",
    quote: "Quote",
    sourceBlock: "Source block",
    property: "Property",
    drawer: "Drawer",
    contact: "Contact",
};

const wrappers: VueWrapper<any>[] = [];
afterEach(() => {
    while (wrappers.length) wrappers.pop()!.unmount();
});

function setup(props: Record<string, unknown> = {}, options: Record<string, unknown> = {}) {
    const wrapper = mount(OrgEditor, {
        props: { label: "Notes", toolbarLabel: "Formatting", labels, modelValue: "hello world", today: "2026-10-24", ...props },
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
        expect(wrapper.find("div.org-editor").exists()).toBe(true);
        const bar = wrapper.find('[role="toolbar"]');
        expect(bar.attributes("aria-label")).toBe("Formatting");
        expect(bar.classes()).toContain("org-editor-toolbar");
        expect(textarea.className).toContain("org-editor-textarea");
        expect(textarea.getAttribute("aria-label")).toBe("Notes");
    });

    it("renders one named button per labelled tool, in the default order", () => {
        const { wrapper } = setup();
        expect(wrapper.findAll("button").map((b) => b.attributes("data-tool"))).toEqual([...TOOL_IDS]);
        expect(wrapper.findAll("button").map((b) => b.attributes("aria-label"))).toEqual(TOOL_IDS.map((t) => (labels as Record<string, string>)[t]));
    });

    it("every button carries its group", () => {
        for (const b of setup().wrapper.findAll("button")) expect(b.attributes("data-group")).toBe(TOOL_GROUPS[b.attributes("data-tool") as keyof typeof TOOL_GROUPS]);
    });

    it("omits a tool that has no label", () => {
        expect(setup({ labels: { todo: "Task" } }).wrapper.findAll("button").length).toBe(1);
    });

    it("honours the tools prop for subset and order", () => {
        expect(setup({ tools: ["contact", "todo"] }).wrapper.findAll("button").map((b) => b.attributes("data-tool"))).toEqual(["contact", "todo"]);
    });

    it("every button is type=button", () => {
        for (const b of setup().wrapper.findAll("button")) expect(b.attributes("type")).toBe("button");
    });

    it("icons are decorative and draw one path each", () => {
        const { wrapper } = setup();
        for (const svg of wrapper.findAll("svg")) expect(svg.attributes("aria-hidden")).toBe("true");
        expect(wrapper.findAll("svg path").length).toBe(TOOL_IDS.length);
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
        const root = wrapper.find(".org-editor");
        expect(root.attributes("class")).toBe("org-editor mine");
        expect(root.attributes("data-x")).toBe("1");
    });

    it("ships no English of its own: no labels, no buttons, no placeholder", () => {
        const { wrapper } = setup({ labels: {} });
        expect(wrapper.findAll("button").length).toBe(0);
        expect(wrapper.find("textarea").attributes("placeholder")).toBeUndefined();
    });

    it("ids are unique per editor", () => {
        expect(nextOrgEditorId()).not.toBe(nextOrgEditorId());
    });
});

describe("tools", () => {
    it("bold wraps the selection in org's single asterisks", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Bold").trigger("click");
        expect(textarea.value).toBe("*hello* world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    it("italic uses slashes", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Italic").trigger("click");
        expect(textarea.value).toBe("/hello/ world");
    });

    it("underline uses underscores", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Underline").trigger("click");
        expect(textarea.value).toBe("_hello_ world");
    });

    it("strikethrough uses plus signs", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Strikethrough").trigger("click");
        expect(textarea.value).toBe("+hello+ world");
    });

    it("code uses tildes", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Code").trigger("click");
        expect(textarea.value).toBe("~hello~ world");
    });

    it("verbatim uses equals signs", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Verbatim").trigger("click");
        expect(textarea.value).toBe("=hello= world");
    });

    it("pressing a text tool again takes it off", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Bold").trigger("click");
        await button("Bold").trigger("click");
        expect(textarea.value).toBe("hello world");
    });

    it("link writes an org link and selects the address", async () => {
        const { textarea, button } = setup({ modelValue: "hello world" });
        select(textarea, 0, 5);
        await button("Link").trigger("click");
        expect(textarea.value).toBe("[[https://][hello]] world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    it("heading uses the headingLevel", async () => {
        const { textarea, button } = setup({ modelValue: "hello world", headingLevel: 2 });
        select(textarea, 0, 0);
        await button("Heading").trigger("click");
        expect(textarea.value).toBe("** hello world");
    });

    it("demote adds a star", async () => {
        const { textarea, button } = setup({ modelValue: "* a" });
        select(textarea, 0, 3);
        await button("Demote").trigger("click");
        expect(textarea.value).toBe("** a");
    });

    it("demote then promote returns to the start", async () => {
        const { textarea, button } = setup({ modelValue: "* a" });
        select(textarea, 0, 3);
        await button("Demote").trigger("click");
        await button("Promote").trigger("click");
        expect(textarea.value).toBe("* a");
    });

    it("task makes TODO", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship" });
        select(textarea, 0, 0);
        await button("Task").trigger("click");
        expect(textarea.value).toBe("* TODO Ship");
    });

    it("task again makes DONE", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship" });
        select(textarea, 0, 0);
        await button("Task").trigger("click");
        await button("Task").trigger("click");
        expect(textarea.value).toBe("* DONE Ship");
    });

    it("task a third time clears it", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship" });
        select(textarea, 0, 0);
        await button("Task").trigger("click");
        await button("Task").trigger("click");
        await button("Task").trigger("click");
        expect(textarea.value).toBe("* Ship");
    });

    it("the keywords are an option", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship", todoKeywords: ["NEXT", "DONE"] });
        select(textarea, 0, 0);
        await button("Task").trigger("click");
        expect(textarea.value).toBe("* NEXT Ship");
    });

    it("priority writes [#A]", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship" });
        select(textarea, 0, 0);
        await button("Priority").trigger("click");
        expect(textarea.value).toBe("* [#A] Ship");
    });

    it("scheduled writes a planning line and selects the date", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship\nbody" });
        select(textarea, 0, 0);
        await button("Scheduled").trigger("click");
        expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
    });

    it("scheduled again removes it", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship\nbody" });
        select(textarea, 0, 0);
        await button("Scheduled").trigger("click");
        await button("Scheduled").trigger("click");
        expect(textarea.value).toBe("* Ship\nbody");
    });

    it("deadline writes DEADLINE", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship" });
        select(textarea, 0, 0);
        await button("Deadline").trigger("click");
        expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
    });

    it("timestamp inserts at the caret", async () => {
        const { textarea, button } = setup({ modelValue: "due " });
        select(textarea, 4, 4);
        await button("Timestamp").trigger("click");
        expect(textarea.value).toBe("due <2026-10-24 Sat>");
    });

    it("bullet list prefixes the lines", async () => {
        const { textarea, button } = setup({ modelValue: "a\nb" });
        select(textarea, 0, 3);
        await button("Bulleted list").trigger("click");
        expect(textarea.value).toBe("- a\n- b");
    });

    it("checkbox cycles open then done", async () => {
        const { textarea, button } = setup({ modelValue: "a\nb" });
        select(textarea, 0, 3);
        await button("Bulleted list").trigger("click");
        await button("Checkbox").trigger("click");
        await button("Checkbox").trigger("click");
        expect(textarea.value).toBe("- [X] a\n- [X] b");
    });

    it("numbered list counts from 1", async () => {
        const { textarea, button } = setup({ modelValue: "a\nb" });
        select(textarea, 0, 3);
        await button("Numbered list").trigger("click");
        expect(textarea.value).toBe("1. a\n2. b");
    });

    it("quote wraps the lines in an org block", async () => {
        const { textarea, button } = setup({ modelValue: "x" });
        select(textarea, 0, 1);
        await button("Quote").trigger("click");
        expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("x");
    });

    it("source block wraps the lines", async () => {
        const { textarea, button } = setup({ modelValue: "x = 1" });
        select(textarea, 0, 5);
        await button("Source block").trigger("click");
        expect(textarea.value).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
    });

    it("property adds a drawer with the key, and the key is an option", async () => {
        const { textarea, button } = setup({ modelValue: "* Ship", propertyKey: "CUSTOM_ID" });
        select(textarea, 0, 0);
        await button("Property").trigger("click");
        expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
    });

    it("drawer wraps the lines, and the name is an option", async () => {
        const { textarea, button } = setup({ modelValue: "note", drawerName: "NOTES" });
        select(textarea, 0, 4);
        await button("Drawer").trigger("click");
        expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
    });

    it("contact makes an org-contacts entry from the selected name", async () => {
        const { textarea, button } = setup({ modelValue: "Ada Lovelace" });
        select(textarea, 0, 12);
        await button("Contact").trigger("click");
        expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
    });

    it("the contact properties are an option", async () => {
        const { textarea, button } = setup({ modelValue: "Ada", contactProperties: ["NICKNAME"] });
        select(textarea, 0, 3);
        await button("Contact").trigger("click");
        expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
    });

    it("a tool with nothing to do leaves the text alone", async () => {
        const { textarea, button } = setup({ modelValue: "plain" });
        select(textarea, 0, 0);
        await button("Scheduled").trigger("click");
        expect(textarea.value).toBe("plain");
    });

    it("a tool that changed the text emits update:modelValue and change; one with nothing to do does not", async () => {
        const { wrapper, textarea, button } = setup({ modelValue: "plain" });
        select(textarea, 0, 0);
        await button("Scheduled").trigger("click");
        expect(wrapper.emitted("change")).toBeUndefined();
        await button("Bold").trigger("click");
        expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["**plain"]);
        expect(wrapper.emitted("change")!.at(-1)).toEqual(["**plain"]);
    });

    it("with no `today` the date is the local date", async () => {
        const { textarea, button } = setup({ modelValue: "x", today: undefined });
        select(textarea, 0, 0);
        await button("Timestamp").trigger("click");
        expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
    });

    it("moves focus back to the textarea after a tool runs", async () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        await button("Italic").trigger("click");
        expect(document.activeElement).toBe(textarea);
    });

    it("typing updates the value and emits", async () => {
        const { wrapper } = setup({ modelValue: "" });
        await wrapper.find("textarea").setValue("ab");
        expect(wrapper.emitted("update:modelValue")!.at(-1)).toEqual(["ab"]);
    });

    it("a new modelValue from the parent is shown", async () => {
        const { wrapper, textarea } = setup();
        await wrapper.setProps({ modelValue: "changed" });
        expect(textarea.value).toBe("changed");
    });
});

describe("shortcuts", () => {
    it("Ctrl+B bolds, Cmd+U underlines", async () => {
        const { wrapper, textarea } = setup();
        select(textarea, 0, 5);
        await wrapper.find("textarea").trigger("keydown", { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("*hello* world");
        select(textarea, 1, 6);
        await wrapper.find("textarea").trigger("keydown", { key: "u", metaKey: true });
        expect(textarea.value).toBe("*_hello_* world");
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
        const tabbable = setup().wrapper.findAll("button").filter((b) => b.attributes("tabindex") === "0");
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
    it("the icon slot replaces the default icons", () => {
        const { wrapper } = setup({}, { slots: { icon: (p: { tool: string }) => h("span", { "data-icon": p.tool }, "x") } });
        expect(wrapper.findAll("svg").length).toBe(0);
        expect(wrapper.findAll("[data-icon]").length).toBe(TOOL_IDS.length);
    });
});
