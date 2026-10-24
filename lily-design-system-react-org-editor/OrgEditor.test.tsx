import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import OrgEditor, { nextOrgEditorId, type Props } from "./OrgEditor";
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

function setup(props: Partial<Props> = {}) {
    const utils = render(
        <OrgEditor label="Notes" toolbarLabel="Formatting" labels={labels} defaultValue="hello world" today="2026-10-24" {...props} />,
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;
    return { ...utils, textarea };
}

function select(textarea: HTMLTextAreaElement, start: number, end: number) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
}

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
        expect(screen.getAllByRole("button").map((b) => b.getAttribute("aria-label"))).toEqual(TOOL_IDS.map((t) => (labels as Record<string, string>)[t]));
    });

    it("every button carries its group", () => {
        setup();
        for (const b of screen.getAllByRole("button")) {
            expect(b.getAttribute("data-group")).toBe(TOOL_GROUPS[b.getAttribute("data-tool") as keyof typeof TOOL_GROUPS]);
        }
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
        const { container } = setup({ className: "mine", "data-x": "1" });
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

describe("tools", () => {
    it("bold wraps the selection in org's single asterisks", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(textarea.value).toBe("*hello* world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    it("italic uses slashes", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Italic" }));
        expect(textarea.value).toBe("/hello/ world");
    });

    it("underline uses underscores", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Underline" }));
        expect(textarea.value).toBe("_hello_ world");
    });

    it("strikethrough uses plus signs", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Strikethrough" }));
        expect(textarea.value).toBe("+hello+ world");
    });

    it("code uses tildes", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Code" }));
        expect(textarea.value).toBe("~hello~ world");
    });

    it("verbatim uses equals signs", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Verbatim" }));
        expect(textarea.value).toBe("=hello= world");
    });

    it("pressing a text tool again takes it off", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(textarea.value).toBe("hello world");
    });

    it("link writes an org link and selects the address", async () => {
        const { textarea } = setup({ defaultValue: "hello world" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Link" }));
        expect(textarea.value).toBe("[[https://][hello]] world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    it("heading uses the headingLevel", async () => {
        const { textarea } = setup({ defaultValue: "hello world", headingLevel: 2 });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Heading" }));
        expect(textarea.value).toBe("** hello world");
    });

    it("demote adds a star", async () => {
        const { textarea } = setup({ defaultValue: "* a" });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Demote" }));
        expect(textarea.value).toBe("** a");
    });

    it("demote then promote returns to the start", async () => {
        const { textarea } = setup({ defaultValue: "* a" });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Demote" }));
        await userEvent.click(screen.getByRole("button", { name: "Promote" }));
        expect(textarea.value).toBe("* a");
    });

    it("task makes TODO", async () => {
        const { textarea } = setup({ defaultValue: "* Ship" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        expect(textarea.value).toBe("* TODO Ship");
    });

    it("task again makes DONE", async () => {
        const { textarea } = setup({ defaultValue: "* Ship" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        expect(textarea.value).toBe("* DONE Ship");
    });

    it("task a third time clears it", async () => {
        const { textarea } = setup({ defaultValue: "* Ship" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        expect(textarea.value).toBe("* Ship");
    });

    it("the keywords are an option", async () => {
        const { textarea } = setup({ defaultValue: "* Ship", todoKeywords: ["NEXT", "DONE"] });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Task" }));
        expect(textarea.value).toBe("* NEXT Ship");
    });

    it("priority writes [#A]", async () => {
        const { textarea } = setup({ defaultValue: "* Ship" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Priority" }));
        expect(textarea.value).toBe("* [#A] Ship");
    });

    it("scheduled writes a planning line and selects the date", async () => {
        const { textarea } = setup({ defaultValue: "* Ship\nbody" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Scheduled" }));
        expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
    });

    it("scheduled again removes it", async () => {
        const { textarea } = setup({ defaultValue: "* Ship\nbody" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Scheduled" }));
        await userEvent.click(screen.getByRole("button", { name: "Scheduled" }));
        expect(textarea.value).toBe("* Ship\nbody");
    });

    it("deadline writes DEADLINE", async () => {
        const { textarea } = setup({ defaultValue: "* Ship" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Deadline" }));
        expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
    });

    it("timestamp inserts at the caret", async () => {
        const { textarea } = setup({ defaultValue: "due " });
        select(textarea, 4, 4);
        await userEvent.click(screen.getByRole("button", { name: "Timestamp" }));
        expect(textarea.value).toBe("due <2026-10-24 Sat>");
    });

    it("bullet list prefixes the lines", async () => {
        const { textarea } = setup({ defaultValue: "a\nb" });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Bulleted list" }));
        expect(textarea.value).toBe("- a\n- b");
    });

    it("checkbox cycles open then done", async () => {
        const { textarea } = setup({ defaultValue: "a\nb" });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Bulleted list" }));
        await userEvent.click(screen.getByRole("button", { name: "Checkbox" }));
        await userEvent.click(screen.getByRole("button", { name: "Checkbox" }));
        expect(textarea.value).toBe("- [X] a\n- [X] b");
    });

    it("numbered list counts from 1", async () => {
        const { textarea } = setup({ defaultValue: "a\nb" });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Numbered list" }));
        expect(textarea.value).toBe("1. a\n2. b");
    });

    it("quote wraps the lines in an org block", async () => {
        const { textarea } = setup({ defaultValue: "x" });
        select(textarea, 0, 1);
        await userEvent.click(screen.getByRole("button", { name: "Quote" }));
        expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("x");
    });

    it("source block wraps the lines", async () => {
        const { textarea } = setup({ defaultValue: "x = 1" });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Source block" }));
        expect(textarea.value).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
    });

    it("property adds a drawer with the key, and the key is an option", async () => {
        const { textarea } = setup({ defaultValue: "* Ship", propertyKey: "CUSTOM_ID" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Property" }));
        expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
    });

    it("drawer wraps the lines, and the name is an option", async () => {
        const { textarea } = setup({ defaultValue: "note", drawerName: "NOTES" });
        select(textarea, 0, 4);
        await userEvent.click(screen.getByRole("button", { name: "Drawer" }));
        expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
    });

    it("contact makes an org-contacts entry from the selected name", async () => {
        const { textarea } = setup({ defaultValue: "Ada Lovelace" });
        select(textarea, 0, 12);
        await userEvent.click(screen.getByRole("button", { name: "Contact" }));
        expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
    });

    it("the contact properties are an option", async () => {
        const { textarea } = setup({ defaultValue: "Ada", contactProperties: ["NICKNAME"] });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Contact" }));
        expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
    });

    it("a tool with nothing to do leaves the text alone", async () => {
        const { textarea } = setup({ defaultValue: "plain" });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Scheduled" }));
        expect(textarea.value).toBe("plain");
    });

    it("a tool that changed the text calls onChange; one with nothing to do does not", async () => {
        const onChange = vi.fn();
        const { textarea } = setup({ defaultValue: "plain", onChange });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Scheduled" }));
        expect(onChange).not.toHaveBeenCalled();
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(onChange).toHaveBeenLastCalledWith("**plain");
    });

    it("with no `today` the date is the local date", async () => {
        const { textarea } = setup({ defaultValue: "x", today: undefined });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Timestamp" }));
        expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
    });

    it("moves focus back to the textarea after a tool runs", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Italic" }));
        expect(document.activeElement).toBe(textarea);
    });

    it("typing updates the value and calls onChange", async () => {
        const onChange = vi.fn();
        const { textarea } = setup({ defaultValue: "", onChange });
        await userEvent.type(textarea, "ab");
        expect(onChange).toHaveBeenLastCalledWith("ab");
    });

    it("a controlled value is what the textarea shows, and a tool reports the new one", async () => {
        const onChange = vi.fn();
        const { textarea } = setup({ value: "hello world", defaultValue: undefined, onChange });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(onChange).toHaveBeenLastCalledWith("*hello* world");
    });
});

describe("shortcuts", () => {
    it("Ctrl+B bolds, Cmd+U underlines", () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("*hello* world");
        select(textarea, 1, 6);
        fireEvent.keyDown(textarea, { key: "u", metaKey: true });
        expect(textarea.value).toBe("*_hello_* world");
    });

    it("a shortcut for a tool that is not shown does nothing", () => {
        const { textarea } = setup({ tools: ["code"] });
        select(textarea, 0, 5);
        fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("hello world");
    });

    it("plain letters are untouched", () => {
        const { textarea } = setup();
        expect(fireEvent.keyDown(textarea, { key: "b" })).toBe(true);
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

describe("disabled and readOnly", () => {
    it("disabled disables the textarea and every button", () => {
        const { textarea } = setup({ disabled: true });
        expect(textarea.disabled).toBe(true);
        for (const b of screen.getAllByRole("button")) expect((b as HTMLButtonElement).disabled).toBe(true);
    });

    it("readOnly keeps the text unchangeable by a tool", async () => {
        const { textarea } = setup({ readOnly: true });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(textarea.value).toBe("hello world");
    });
});

describe("icon", () => {
    it("the icon prop replaces the default icons", () => {
        const { container } = setup({ icon: (t) => <span data-icon={t}>x</span> });
        expect(container.querySelectorAll("svg").length).toBe(0);
        expect(container.querySelectorAll("[data-icon]").length).toBe(TOOL_IDS.length);
    });
});
