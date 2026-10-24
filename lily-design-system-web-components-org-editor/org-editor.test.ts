import { afterEach, describe, expect, test, vi } from "vitest";

import { OrgEditor, nextOrgEditorId } from "./org-editor.js";
import { TOOL_IDS, TOOL_GROUPS } from "./org-format.js";

if (!customElements.get("lily-org-editor")) customElements.define("lily-org-editor", OrgEditor);

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

afterEach(() => {
    document.body.innerHTML = "";
});

function setup(attrs: Record<string, string | true> = {}, props: { labels?: object } = {}) {
    const el = document.createElement("lily-org-editor") as OrgEditor;
    el.setAttribute("label", "Notes");
    el.setAttribute("toolbar-label", "Formatting");
    el.setAttribute("value", "hello world");
    el.setAttribute("today", "2026-10-24");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v === true ? "" : v);
    el.labels = props.labels ?? labels;
    document.body.append(el);
    const textarea = el.querySelector("textarea") as HTMLTextAreaElement;
    const buttons = () => Array.from(el.querySelectorAll<HTMLButtonElement>("button"));
    const button = (name: string) => el.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
    return { el, textarea, buttons, button };
}

function select(textarea: HTMLTextAreaElement, start: number, end: number) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
}

const key = (target: Element, init: KeyboardEventInit) => {
    const ev = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(ev);
    return ev;
};

describe("structure", () => {
    test("renders a toolbar and a textarea under the base classes", () => {
        const { el, textarea } = setup();
        expect(el.querySelector("div.org-editor")).toBeTruthy();
        const bar = el.querySelector('[role="toolbar"]')!;
        expect(bar.getAttribute("aria-label")).toBe("Formatting");
        expect(bar.className).toContain("org-editor-toolbar");
        expect(textarea.className).toContain("org-editor-textarea");
        expect(textarea.getAttribute("aria-label")).toBe("Notes");
        expect(textarea.value).toBe("hello world");
    });

    test("renders one named button per labelled tool, in the default order", () => {
        const { buttons } = setup();
        expect(buttons().map((b) => b.getAttribute("data-tool"))).toEqual([...TOOL_IDS]);
        expect(buttons().map((b) => b.getAttribute("aria-label"))).toEqual(TOOL_IDS.map((t) => (labels as Record<string, string>)[t]));
    });

    test("every button carries its group", () => {
        for (const b of setup().buttons()) expect(b.getAttribute("data-group")).toBe(TOOL_GROUPS[b.getAttribute("data-tool") as keyof typeof TOOL_GROUPS]);
    });

    test("omits a tool that has no label", () => {
        expect(setup({}, { labels: { todo: "Task" } }).buttons().length).toBe(1);
    });

    test("honours the tools attribute for subset and order", () => {
        expect(setup({ tools: "contact todo" }).buttons().map((b) => b.getAttribute("data-tool"))).toEqual(["contact", "todo"]);
    });

    test("ignores an unknown tool id", () => {
        expect(setup({ tools: "todo nonsense" }).buttons().length).toBe(1);
    });

    test("labels can arrive as a JSON attribute", () => {
        const el = document.createElement("lily-org-editor") as OrgEditor;
        el.setAttribute("label", "N");
        el.setAttribute("toolbar-label", "F");
        el.setAttribute("labels", JSON.stringify({ todo: "Task" }));
        document.body.append(el);
        expect(el.querySelectorAll("button").length).toBe(1);
    });

    test("every button is type=button", () => {
        for (const b of setup().buttons()) expect(b.getAttribute("type")).toBe("button");
    });

    test("icons are decorative and draw one path each", () => {
        const { el } = setup();
        for (const svg of Array.from(el.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(el.querySelectorAll("svg path").length).toBe(TOOL_IDS.length);
    });

    test("the toolbar controls the textarea", () => {
        const { el, textarea } = setup();
        expect(el.querySelector('[role="toolbar"]')!.getAttribute("aria-controls")).toBe(textarea.id);
    });

    test("passes name, rows, placeholder, required through to the textarea", () => {
        const { textarea } = setup({ name: "body", rows: "6", placeholder: "Type", required: true });
        expect(textarea.name).toBe("body");
        expect(textarea.rows).toBe(6);
        expect(textarea.placeholder).toBe("Type");
        expect(textarea.required).toBe(true);
    });

    test("the host class goes onto the root after the base class", () => {
        expect(setup({ class: "mine" }).el.querySelector(".org-editor")!.getAttribute("class")).toBe("org-editor mine");
    });

    test("ships no English of its own: no labels, no buttons, no placeholder", () => {
        const { buttons, textarea } = setup({}, { labels: {} });
        expect(buttons().length).toBe(0);
        expect(textarea.getAttribute("placeholder")).toBeNull();
    });

    test("ids are unique per editor", () => {
        expect(nextOrgEditorId()).not.toBe(nextOrgEditorId());
    });

    test("the textarea submits with an enclosing form under its name", () => {
        const form = document.createElement("form");
        const el = document.createElement("lily-org-editor") as OrgEditor;
        el.setAttribute("label", "N");
        el.setAttribute("name", "notes");
        el.setAttribute("value", "* hi");
        form.append(el);
        document.body.append(form);
        expect(new FormData(form).get("notes")).toBe("* hi");
    });

    test("the value property reads and writes the text", () => {
        const { el, textarea } = setup();
        el.value = "changed";
        expect(textarea.value).toBe("changed");
        expect(el.value).toBe("changed");
    });
});

describe("tools", () => {
    test("bold wraps the selection in org's single asterisks", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Bold").click();
        expect(textarea.value).toBe("*hello* world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    test("italic uses slashes", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Italic").click();
        expect(textarea.value).toBe("/hello/ world");
    });

    test("underline uses underscores", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Underline").click();
        expect(textarea.value).toBe("_hello_ world");
    });

    test("strikethrough uses plus signs", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Strikethrough").click();
        expect(textarea.value).toBe("+hello+ world");
    });

    test("code uses tildes", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Code").click();
        expect(textarea.value).toBe("~hello~ world");
    });

    test("verbatim uses equals signs", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Verbatim").click();
        expect(textarea.value).toBe("=hello= world");
    });

    test("pressing a text tool again takes it off", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Bold").click();
        button("Bold").click();
        expect(textarea.value).toBe("hello world");
    });

    test("link writes an org link and selects the address", () => {
        const { textarea, button } = setup({ value: "hello world", ...{} });
        select(textarea, 0, 5);
        button("Link").click();
        expect(textarea.value).toBe("[[https://][hello]] world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    test("heading uses the headingLevel", () => {
        const { textarea, button } = setup({ value: "hello world", ...{"heading-level": "2"} });
        select(textarea, 0, 0);
        button("Heading").click();
        expect(textarea.value).toBe("** hello world");
    });

    test("demote adds a star", () => {
        const { textarea, button } = setup({ value: "* a", ...{} });
        select(textarea, 0, 3);
        button("Demote").click();
        expect(textarea.value).toBe("** a");
    });

    test("demote then promote returns to the start", () => {
        const { textarea, button } = setup({ value: "* a", ...{} });
        select(textarea, 0, 3);
        button("Demote").click();
        button("Promote").click();
        expect(textarea.value).toBe("* a");
    });

    test("task makes TODO", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{} });
        select(textarea, 0, 0);
        button("Task").click();
        expect(textarea.value).toBe("* TODO Ship");
    });

    test("task again makes DONE", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{} });
        select(textarea, 0, 0);
        button("Task").click();
        button("Task").click();
        expect(textarea.value).toBe("* DONE Ship");
    });

    test("task a third time clears it", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{} });
        select(textarea, 0, 0);
        button("Task").click();
        button("Task").click();
        button("Task").click();
        expect(textarea.value).toBe("* Ship");
    });

    test("the keywords are an option", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{"todo-keywords": "NEXT DONE"} });
        select(textarea, 0, 0);
        button("Task").click();
        expect(textarea.value).toBe("* NEXT Ship");
    });

    test("priority writes [#A]", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{} });
        select(textarea, 0, 0);
        button("Priority").click();
        expect(textarea.value).toBe("* [#A] Ship");
    });

    test("scheduled writes a planning line and selects the date", () => {
        const { textarea, button } = setup({ value: "* Ship\nbody", ...{} });
        select(textarea, 0, 0);
        button("Scheduled").click();
        expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
    });

    test("scheduled again removes it", () => {
        const { textarea, button } = setup({ value: "* Ship\nbody", ...{} });
        select(textarea, 0, 0);
        button("Scheduled").click();
        button("Scheduled").click();
        expect(textarea.value).toBe("* Ship\nbody");
    });

    test("deadline writes DEADLINE", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{} });
        select(textarea, 0, 0);
        button("Deadline").click();
        expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
    });

    test("timestamp inserts at the caret", () => {
        const { textarea, button } = setup({ value: "due ", ...{} });
        select(textarea, 4, 4);
        button("Timestamp").click();
        expect(textarea.value).toBe("due <2026-10-24 Sat>");
    });

    test("bullet list prefixes the lines", () => {
        const { textarea, button } = setup({ value: "a\nb", ...{} });
        select(textarea, 0, 3);
        button("Bulleted list").click();
        expect(textarea.value).toBe("- a\n- b");
    });

    test("checkbox cycles open then done", () => {
        const { textarea, button } = setup({ value: "a\nb", ...{} });
        select(textarea, 0, 3);
        button("Bulleted list").click();
        button("Checkbox").click();
        button("Checkbox").click();
        expect(textarea.value).toBe("- [X] a\n- [X] b");
    });

    test("numbered list counts from 1", () => {
        const { textarea, button } = setup({ value: "a\nb", ...{} });
        select(textarea, 0, 3);
        button("Numbered list").click();
        expect(textarea.value).toBe("1. a\n2. b");
    });

    test("quote wraps the lines in an org block", () => {
        const { textarea, button } = setup({ value: "x", ...{} });
        select(textarea, 0, 1);
        button("Quote").click();
        expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("x");
    });

    test("source block wraps the lines", () => {
        const { textarea, button } = setup({ value: "x = 1", ...{} });
        select(textarea, 0, 5);
        button("Source block").click();
        expect(textarea.value).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
    });

    test("property adds a drawer with the key, and the key is an option", () => {
        const { textarea, button } = setup({ value: "* Ship", ...{"property-key": "CUSTOM_ID"} });
        select(textarea, 0, 0);
        button("Property").click();
        expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
    });

    test("drawer wraps the lines, and the name is an option", () => {
        const { textarea, button } = setup({ value: "note", ...{"drawer-name": "NOTES"} });
        select(textarea, 0, 4);
        button("Drawer").click();
        expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
    });

    test("contact makes an org-contacts entry from the selected name", () => {
        const { textarea, button } = setup({ value: "Ada Lovelace", ...{} });
        select(textarea, 0, 12);
        button("Contact").click();
        expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
    });

    test("the contact properties are an option", () => {
        const { textarea, button } = setup({ value: "Ada", ...{"contact-properties": "NICKNAME"} });
        select(textarea, 0, 3);
        button("Contact").click();
        expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
    });

    test("a tool with nothing to do leaves the text alone", () => {
        const { textarea, button } = setup({ value: "plain", ...{} });
        select(textarea, 0, 0);
        button("Scheduled").click();
        expect(textarea.value).toBe("plain");
    });

    test("a tool that changed the text fires valuechange; one with nothing to do does not", () => {
        const { el, textarea, button } = setup({ value: "plain" });
        const changed = vi.fn();
        el.addEventListener("valuechange", (e) => changed((e as CustomEvent).detail.value));
        select(textarea, 0, 0);
        button("Scheduled").click();
        expect(changed).not.toHaveBeenCalled();
        button("Bold").click();
        expect(changed).toHaveBeenLastCalledWith("**plain");
    });

    test("with no `today` the date is the local date", () => {
        const el = document.createElement("lily-org-editor") as OrgEditor;
        el.setAttribute("label", "N");
        el.setAttribute("toolbar-label", "F");
        el.setAttribute("value", "x");
        el.labels = labels;
        document.body.append(el);
        const textarea = el.querySelector("textarea") as HTMLTextAreaElement;
        select(textarea, 0, 0);
        el.querySelector<HTMLButtonElement>('button[aria-label="Timestamp"]')!.click();
        expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
    });

    test("moves focus back to the textarea after a tool runs", () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        button("Italic").click();
        expect(document.activeElement).toBe(textarea);
    });

    test("typing fires valuechange with the new text", () => {
        const { el, textarea } = setup({ value: "" });
        const changed = vi.fn();
        el.addEventListener("valuechange", (e) => changed((e as CustomEvent).detail.value));
        textarea.value = "ab";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        expect(changed).toHaveBeenLastCalledWith("ab");
    });
});

describe("shortcuts", () => {
    test("Ctrl+B bolds, Cmd+U underlines", () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        key(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("*hello* world");
        select(textarea, 1, 6);
        key(textarea, { key: "u", metaKey: true });
        expect(textarea.value).toBe("*_hello_* world");
    });

    test("a shortcut for a tool that is not shown does nothing", () => {
        const { textarea } = setup({ tools: "code" });
        select(textarea, 0, 5);
        key(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("hello world");
    });

    test("plain letters are untouched", () => {
        const { textarea } = setup();
        expect(key(textarea, { key: "b" }).defaultPrevented).toBe(false);
    });
});

describe("toolbar keyboard", () => {
    test("only one button is in the tab order (roving tabindex)", () => {
        const tabbable = setup().buttons().filter((b) => b.getAttribute("tabindex") === "0");
        expect(tabbable.length).toBe(1);
        expect(tabbable[0].getAttribute("data-tool")).toBe("heading");
    });

    test("arrows move focus and the tab stop, clamping at the ends", () => {
        const { buttons } = setup();
        const b = buttons();
        b[0].focus();
        key(b[0], { key: "ArrowRight" });
        expect(document.activeElement).toBe(b[1]);
        expect(b[1].getAttribute("tabindex")).toBe("0");
        expect(b[0].getAttribute("tabindex")).toBe("-1");
        key(b[1], { key: "ArrowLeft" });
        key(b[0], { key: "ArrowLeft" });
        expect(document.activeElement).toBe(b[0]);
    });

    test("Home and End jump to the ends", () => {
        const { buttons } = setup();
        const b = buttons();
        b[2].focus();
        key(b[2], { key: "End" });
        expect(document.activeElement).toBe(b[b.length - 1]);
        key(b[b.length - 1], { key: "Home" });
        expect(document.activeElement).toBe(b[0]);
    });
});

describe("disabled and readonly", () => {
    test("disabled disables the textarea and every button", () => {
        const { textarea, buttons } = setup({ disabled: true });
        expect(textarea.disabled).toBe(true);
        for (const b of buttons()) expect(b.disabled).toBe(true);
    });

    test("readonly keeps the text unchangeable by a tool", () => {
        const { textarea, button } = setup({ readonly: true });
        select(textarea, 0, 5);
        button("Bold").click();
        expect(textarea.value).toBe("hello world");
    });
});

describe("icons", () => {
    test("renderIcon can be overridden", () => {
        const { el } = setup();
        el.renderIcon = (tool) => Object.assign(document.createElement("span"), { textContent: tool });
        el.labels = labels; // re-render the toolbar with the override
        expect(el.querySelectorAll("svg").length).toBe(0);
        expect(el.querySelectorAll("button span").length).toBe(TOOL_IDS.length);
    });
});
