import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import OrgEditor, { nextOrgEditorId } from "./OrgEditor.svelte";
import { TOOL_IDS, TOOL_GROUPS } from "./org-format.js";

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

function setup(props: Record<string, unknown> = {}) {
    const utils = render(OrgEditor, {
        props: { label: "Notes", toolbarLabel: "Formatting", labels, value: "hello world", today: "2026-10-24", ...props },
    });
    const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    return { ...utils, textarea };
}

function select(textarea: HTMLTextAreaElement, start: number, end: number) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
}

const click = (name: string) => userEvent.click(screen.getByRole("button", { name }));

describe("structure", () => {
    it("renders a toolbar and a textarea under the base classes", () => {
        const { container, textarea } = setup();
        expect(container.querySelector("div.org-editor")).toBeTruthy();
        expect(screen.getByRole("toolbar", { name: "Formatting" }).className).toContain("org-editor-toolbar");
        expect(textarea.className).toContain("org-editor-textarea");
        expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("renders one named button per labelled tool, in the default order", () => {
        setup();
        expect(screen.getAllByRole("button").map((b) => b.getAttribute("data-tool"))).toEqual([...TOOL_IDS]);
        expect(screen.getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual(TOOL_IDS.map((t) => labels[t]));
    });

    it("every button carries its group, for the consumer's separators", () => {
        setup();
        for (const b of screen.getAllByRole("button")) expect(b.getAttribute("data-group")).toBe(TOOL_GROUPS[b.getAttribute("data-tool") as keyof typeof TOOL_GROUPS]);
    });

    it("omits a tool that has no label", () => {
        setup({ labels: { todo: "Task" } });
        expect(screen.getAllByRole("button").length).toBe(1);
    });

    it("honours the tools prop for subset and order", () => {
        setup({ tools: ["contact", "todo"] });
        expect(screen.getAllByRole("button").map((b) => b.getAttribute("data-tool"))).toEqual(["contact", "todo"]);
    });

    it("every button is type=button", () => {
        setup();
        for (const b of screen.getAllByRole("button")) expect(b.getAttribute("type")).toBe("button");
    });

    it("icons are decorative and draw one path each", () => {
        const { container } = setup();
        for (const svg of container.querySelectorAll("svg")) expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(container.querySelectorAll("svg path").length).toBe(TOOL_IDS.length);
    });

    it("the toolbar controls the textarea", () => {
        const { textarea } = setup();
        expect(screen.getByRole("toolbar").getAttribute("aria-controls")).toBe(textarea.id);
    });

    it("passes name, rows, placeholder, required through to the textarea", () => {
        const { textarea } = setup({ name: "body", rows: 6, placeholder: "Type", required: true });
        expect(textarea.name).toBe("body");
        expect(textarea.rows).toBe(6);
        expect(textarea.placeholder).toBe("Type");
        expect(textarea.required).toBe(true);
    });

    it("spreads rest props and the class onto the root", () => {
        const { container } = setup({ class: "mine", "data-x": "1" });
        const root = container.querySelector(".org-editor")!;
        expect(root.getAttribute("class")).toBe("org-editor mine");
        expect(root.getAttribute("data-x")).toBe("1");
    });

    it("ships no English of its own: no labels, no buttons, no placeholder", () => {
        const { container } = setup({ labels: {} });
        expect(container.querySelectorAll("button").length).toBe(0);
        expect(container.querySelector("textarea")!.getAttribute("placeholder")).toBeNull();
    });

    it("ids are unique per editor", () => {
        expect(nextOrgEditorId()).not.toBe(nextOrgEditorId());
    });
});

describe("text tools", () => {
    it("bold wraps the selection in org's single asterisks and calls onchange", async () => {
        const onchange = vi.fn();
        const { textarea } = setup({ onchange });
        select(textarea, 0, 5);
        await click("Bold");
        expect(textarea.value).toBe("*hello* world");
        expect(onchange).toHaveBeenLastCalledWith("*hello* world");
    });

    it("italic, underline, strikethrough, code and verbatim use org's markers", async () => {
        for (const [name, out] of [["Italic", "/hello/ world"], ["Underline", "_hello_ world"], ["Strikethrough", "+hello+ world"], ["Code", "~hello~ world"], ["Verbatim", "=hello= world"]] as const) {
            const { textarea, unmount } = setup();
            select(textarea, 0, 5);
            await click(name);
            expect(textarea.value).toBe(out);
            unmount();
        }
    });

    it("keeps the selection on the formatted text and pressing again takes it off", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await click("Bold");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
        await click("Bold");
        expect(textarea.value).toBe("hello world");
    });

    it("link writes an org link and selects the address", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await click("Link");
        expect(textarea.value).toBe("[[https://][hello]] world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    it("moves focus back to the textarea after a tool runs", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await click("Italic");
        expect(document.activeElement).toBe(textarea);
    });
});

describe("structure and task tools", () => {
    it("heading uses the headingLevel prop", async () => {
        const { textarea } = setup({ headingLevel: 2 });
        select(textarea, 0, 0);
        await click("Heading");
        expect(textarea.value).toBe("** hello world");
    });

    it("demote and promote move a heading", async () => {
        const { textarea } = setup({ value: "* a" });
        select(textarea, 0, 3);
        await click("Demote");
        expect(textarea.value).toBe("** a");
        await click("Promote");
        expect(textarea.value).toBe("* a");
    });

    it("task cycles a heading through TODO and DONE", async () => {
        const { textarea } = setup({ value: "* Ship" });
        select(textarea, 0, 0);
        await click("Task");
        expect(textarea.value).toBe("* TODO Ship");
        await click("Task");
        expect(textarea.value).toBe("* DONE Ship");
        await click("Task");
        expect(textarea.value).toBe("* Ship");
    });

    it("the keywords are a prop", async () => {
        const { textarea } = setup({ value: "* Ship", todoKeywords: ["NEXT", "DONE"] });
        select(textarea, 0, 0);
        await click("Task");
        expect(textarea.value).toBe("* NEXT Ship");
    });

    it("priority cycles A, B, C", async () => {
        const { textarea } = setup({ value: "* Ship" });
        select(textarea, 0, 0);
        await click("Priority");
        expect(textarea.value).toBe("* [#A] Ship");
    });

    it("scheduled writes a planning line with the date selected, and again removes it", async () => {
        const { textarea } = setup({ value: "* Ship\nbody" });
        select(textarea, 0, 0);
        await click("Scheduled");
        expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
        await click("Scheduled");
        expect(textarea.value).toBe("* Ship\nbody");
    });

    it("deadline writes DEADLINE", async () => {
        const { textarea } = setup({ value: "* Ship" });
        select(textarea, 0, 0);
        await click("Deadline");
        expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
    });

    it("with no `today` the date is the local date, not a fixed one", async () => {
        const { textarea } = setup({ value: "x", today: undefined });
        select(textarea, 0, 0);
        await click("Timestamp");
        expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
    });

    it("timestamp inserts at the caret", async () => {
        const { textarea } = setup({ value: "due " });
        select(textarea, 4, 4);
        await click("Timestamp");
        expect(textarea.value).toBe("due <2026-10-24 Sat>");
    });

    it("list and checkbox tools act on the selected lines", async () => {
        const { textarea } = setup({ value: "a\nb" });
        select(textarea, 0, 3);
        await click("Bulleted list");
        expect(textarea.value).toBe("- a\n- b");
        await click("Checkbox");
        expect(textarea.value).toBe("- [ ] a\n- [ ] b");
        await click("Checkbox");
        expect(textarea.value).toBe("- [X] a\n- [X] b");
    });

    it("quote and source block wrap the lines in org blocks", async () => {
        const { textarea } = setup({ value: "x" });
        select(textarea, 0, 1);
        await click("Quote");
        expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
    });
});

describe("data tools", () => {
    it("property adds a drawer with the key under the heading, and the key is a prop", async () => {
        const { textarea } = setup({ value: "* Ship", propertyKey: "CUSTOM_ID" });
        select(textarea, 0, 0);
        await click("Property");
        expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
        expect(textarea.selectionStart).toBe(textarea.value.indexOf("\n:END:"));
    });

    it("drawer wraps the selected lines, and the name is a prop", async () => {
        const { textarea } = setup({ value: "note", drawerName: "NOTES" });
        select(textarea, 0, 4);
        await click("Drawer");
        expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
    });

    it("contact makes an org-contacts entry from the selected name", async () => {
        const { textarea } = setup({ value: "Ada Lovelace" });
        select(textarea, 0, 12);
        await click("Contact");
        expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
    });

    it("the contact properties are a prop", async () => {
        const { textarea } = setup({ value: "Ada", contactProperties: ["NICKNAME"] });
        select(textarea, 0, 3);
        await click("Contact");
        expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
    });

    it("a tool that has nothing to do (planning with no heading) leaves the text and keeps focus", async () => {
        const onchange = vi.fn();
        const { textarea } = setup({ value: "plain", onchange });
        select(textarea, 0, 0);
        await click("Scheduled");
        expect(textarea.value).toBe("plain");
        expect(onchange).not.toHaveBeenCalled();
        expect(document.activeElement).toBe(textarea);
    });
});

describe("typing and shortcuts", () => {
    it("typing updates the bound value and calls onchange", async () => {
        const onchange = vi.fn();
        const { textarea } = setup({ value: "", onchange });
        await userEvent.type(textarea, "ab");
        expect(onchange).toHaveBeenLastCalledWith("ab");
    });

    it("Ctrl+B bolds, Ctrl+I italicises, Cmd+U underlines", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("*hello* world");
        select(textarea, 1, 6);
        await fireEvent.keyDown(textarea, { key: "i", ctrlKey: true });
        expect(textarea.value).toBe("*/hello/* world");
        select(textarea, 0, 3);
        await fireEvent.keyDown(textarea, { key: "u", metaKey: true });
        expect(textarea.value).toContain("_");
    });

    it("a shortcut for a tool that is not shown does nothing", async () => {
        const { textarea } = setup({ tools: ["code"] });
        select(textarea, 0, 5);
        await fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("hello world");
    });

    it("plain letters are untouched", async () => {
        const { textarea } = setup();
        expect(await fireEvent.keyDown(textarea, { key: "b" })).toBe(true);
    });
});

describe("toolbar keyboard", () => {
    it("only one button is in the tab order (roving tabindex)", () => {
        setup();
        const tabbable = screen.getAllByRole("button").filter((b) => b.getAttribute("tabindex") === "0");
        expect(tabbable.length).toBe(1);
        expect(tabbable[0].getAttribute("data-tool")).toBe("heading");
    });

    it("arrows move focus and the tab stop, clamping at the ends", async () => {
        setup();
        const buttons = screen.getAllByRole("button");
        buttons[0].focus();
        await userEvent.keyboard("{ArrowRight}");
        expect(document.activeElement).toBe(buttons[1]);
        expect(buttons[1].getAttribute("tabindex")).toBe("0");
        expect(buttons[0].getAttribute("tabindex")).toBe("-1");
        await userEvent.keyboard("{ArrowLeft}{ArrowLeft}");
        expect(document.activeElement).toBe(buttons[0]);
    });

    it("Home and End jump to the ends", async () => {
        setup();
        const buttons = screen.getAllByRole("button");
        buttons[2].focus();
        await userEvent.keyboard("{End}");
        expect(document.activeElement).toBe(buttons[buttons.length - 1]);
        await userEvent.keyboard("{Home}");
        expect(document.activeElement).toBe(buttons[0]);
    });
});

describe("disabled and readonly", () => {
    it("disabled disables the textarea and every button", () => {
        const { textarea } = setup({ disabled: true });
        expect(textarea.disabled).toBe(true);
        for (const b of screen.getAllByRole("button")) expect((b as HTMLButtonElement).disabled).toBe(true);
    });

    it("readonly keeps the text unchangeable by a tool", async () => {
        const { textarea } = setup({ readonly: true });
        select(textarea, 0, 5);
        await click("Bold");
        expect(textarea.value).toBe("hello world");
    });
});
