import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lilyOrgEditor, { createOrgEditor, TOOL_IDS, TOOL_GROUPS } from "./index.js";
import type { OrgEditorOptions } from "./index.js";

const SNIPPET = readFileSync("snippet.html", "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const settle = async () => { await tick(); await tick(); };

const LABELS = {
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

const options = (extra: Partial<OrgEditorOptions> = {}): OrgEditorOptions => ({
    value: "hello world",
    label: "Notes",
    toolbarLabel: "Formatting",
    labels: LABELS,
    today: "2026-10-24",
    ...extra,
});

beforeAll(() => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyOrgEditor);
    Alpine.start();
});

afterEach(async () => {
    document.body.innerHTML = "";
    await tick();
});

async function mount(extra: Partial<OrgEditorOptions> = {}) {
    (window as unknown as { orgEditorOptions: OrgEditorOptions }).orgEditorOptions = options(extra);
    document.body.innerHTML = SNIPPET;
    await settle();
    const root = document.querySelector(".org-editor") as HTMLElement;
    const textarea = root.querySelector("textarea") as HTMLTextAreaElement;
    const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>("button"));
    const button = (name: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
    return { root, textarea, buttons, button };
}

const click = async (el: HTMLElement) => { el.click(); await settle(); };
const press = async (target: Element, key: string, init: KeyboardEventInit = {}) => {
    const ev = new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(ev);
    await settle();
    return ev;
};
const select = (ta: HTMLTextAreaElement, a: number, b: number) => { ta.focus(); ta.setSelectionRange(a, b); };

describe("structure", () => {
    test("renders a toolbar and a textarea under the base classes", async () => {
        const { root, textarea } = await mount();
        expect(root.classList.contains("org-editor")).toBe(true);
        const bar = root.querySelector('[role="toolbar"]')!;
        expect(bar.getAttribute("aria-label")).toBe("Formatting");
        expect(bar.className).toContain("org-editor-toolbar");
        expect(textarea.className).toContain("org-editor-textarea");
        expect(textarea.getAttribute("aria-label")).toBe("Notes");
        expect(textarea.value).toBe("hello world");
    });

    test("renders one named button per labelled tool, in the default order", async () => {
        const { buttons } = await mount();
        expect(buttons().map((b) => b.dataset.tool)).toEqual([...TOOL_IDS]);
        expect(buttons().map((b) => b.getAttribute("aria-label"))).toEqual(TOOL_IDS.map((t) => (LABELS as Record<string, string>)[t]));
    });

    test("every button carries its group", async () => {
        for (const b of (await mount()).buttons()) expect(b.dataset.group).toBe(TOOL_GROUPS[b.dataset.tool as keyof typeof TOOL_GROUPS]);
    });

    test("omits a tool that has no label", async () => {
        expect((await mount({ labels: { todo: "Task" } })).buttons().length).toBe(1);
    });

    test("honours tools for subset and order", async () => {
        expect((await mount({ tools: ["contact", "todo"] })).buttons().map((b) => b.dataset.tool)).toEqual(["contact", "todo"]);
    });

    test("every button is type=button", async () => {
        for (const b of (await mount()).buttons()) expect(b.getAttribute("type")).toBe("button");
    });

    test("icons are decorative and draw one path each", async () => {
        const { root } = await mount();
        for (const svg of Array.from(root.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(root.querySelectorAll("svg path").length).toBe(TOOL_IDS.length);
    });

    test("the toolbar controls the textarea", async () => {
        const { root, textarea } = await mount();
        expect(root.querySelector('[role="toolbar"]')!.getAttribute("aria-controls")).toBe(textarea.id);
        expect(textarea.id).toMatch(/^org-editor-\d+$/);
    });

    test("passes name, rows, placeholder, required through to the textarea", async () => {
        const { textarea } = await mount({ name: "body", rows: 6, placeholder: "Type", required: true });
        expect(textarea.name).toBe("body");
        expect(textarea.rows).toBe(6);
        expect(textarea.placeholder).toBe("Type");
        expect(textarea.required).toBe(true);
    });

    test("ships no English of its own: no labels, no buttons", async () => {
        const { buttons, textarea } = await mount({ labels: {} });
        expect(buttons().length).toBe(0);
        expect(textarea.getAttribute("placeholder")).toBeNull();
    });

    test("ids are unique per editor", () => {
        expect(createOrgEditor().id).not.toBe(createOrgEditor().id);
    });
});

describe("tools", () => {
    test("bold wraps the selection in org's single asterisks", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Bold"));
        expect(textarea.value).toBe("*hello* world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    test("italic uses slashes", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Italic"));
        expect(textarea.value).toBe("/hello/ world");
    });

    test("underline uses underscores", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Underline"));
        expect(textarea.value).toBe("_hello_ world");
    });

    test("strikethrough uses plus signs", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Strikethrough"));
        expect(textarea.value).toBe("+hello+ world");
    });

    test("code uses tildes", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Code"));
        expect(textarea.value).toBe("~hello~ world");
    });

    test("verbatim uses equals signs", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Verbatim"));
        expect(textarea.value).toBe("=hello= world");
    });

    test("pressing a text tool again takes it off", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Bold"));
        await click(button("Bold"));
        expect(textarea.value).toBe("hello world");
    });

    test("link writes an org link and selects the address", async () => {
        const { textarea, button } = await mount({ value: "hello world" });
        select(textarea, 0, 5);
        await click(button("Link"));
        expect(textarea.value).toBe("[[https://][hello]] world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    test("heading uses the headingLevel", async () => {
        const { textarea, button } = await mount({ value: "hello world", headingLevel: 2 });
        select(textarea, 0, 0);
        await click(button("Heading"));
        expect(textarea.value).toBe("** hello world");
    });

    test("demote adds a star", async () => {
        const { textarea, button } = await mount({ value: "* a" });
        select(textarea, 0, 3);
        await click(button("Demote"));
        expect(textarea.value).toBe("** a");
    });

    test("demote then promote returns to the start", async () => {
        const { textarea, button } = await mount({ value: "* a" });
        select(textarea, 0, 3);
        await click(button("Demote"));
        await click(button("Promote"));
        expect(textarea.value).toBe("* a");
    });

    test("task makes TODO", async () => {
        const { textarea, button } = await mount({ value: "* Ship" });
        select(textarea, 0, 0);
        await click(button("Task"));
        expect(textarea.value).toBe("* TODO Ship");
    });

    test("task again makes DONE", async () => {
        const { textarea, button } = await mount({ value: "* Ship" });
        select(textarea, 0, 0);
        await click(button("Task"));
        await click(button("Task"));
        expect(textarea.value).toBe("* DONE Ship");
    });

    test("task a third time clears it", async () => {
        const { textarea, button } = await mount({ value: "* Ship" });
        select(textarea, 0, 0);
        await click(button("Task"));
        await click(button("Task"));
        await click(button("Task"));
        expect(textarea.value).toBe("* Ship");
    });

    test("the keywords are an option", async () => {
        const { textarea, button } = await mount({ value: "* Ship", todoKeywords: ["NEXT", "DONE"] });
        select(textarea, 0, 0);
        await click(button("Task"));
        expect(textarea.value).toBe("* NEXT Ship");
    });

    test("priority writes [#A]", async () => {
        const { textarea, button } = await mount({ value: "* Ship" });
        select(textarea, 0, 0);
        await click(button("Priority"));
        expect(textarea.value).toBe("* [#A] Ship");
    });

    test("scheduled writes a planning line and selects the date", async () => {
        const { textarea, button } = await mount({ value: "* Ship\nbody" });
        select(textarea, 0, 0);
        await click(button("Scheduled"));
        expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
    });

    test("scheduled again removes it", async () => {
        const { textarea, button } = await mount({ value: "* Ship\nbody" });
        select(textarea, 0, 0);
        await click(button("Scheduled"));
        await click(button("Scheduled"));
        expect(textarea.value).toBe("* Ship\nbody");
    });

    test("deadline writes DEADLINE", async () => {
        const { textarea, button } = await mount({ value: "* Ship" });
        select(textarea, 0, 0);
        await click(button("Deadline"));
        expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
    });

    test("timestamp inserts at the caret", async () => {
        const { textarea, button } = await mount({ value: "due " });
        select(textarea, 4, 4);
        await click(button("Timestamp"));
        expect(textarea.value).toBe("due <2026-10-24 Sat>");
    });

    test("bullet list prefixes the lines", async () => {
        const { textarea, button } = await mount({ value: "a\nb" });
        select(textarea, 0, 3);
        await click(button("Bulleted list"));
        expect(textarea.value).toBe("- a\n- b");
    });

    test("checkbox cycles open then done", async () => {
        const { textarea, button } = await mount({ value: "a\nb" });
        select(textarea, 0, 3);
        await click(button("Bulleted list"));
        await click(button("Checkbox"));
        await click(button("Checkbox"));
        expect(textarea.value).toBe("- [X] a\n- [X] b");
    });

    test("numbered list counts from 1", async () => {
        const { textarea, button } = await mount({ value: "a\nb" });
        select(textarea, 0, 3);
        await click(button("Numbered list"));
        expect(textarea.value).toBe("1. a\n2. b");
    });

    test("quote wraps the lines in an org block", async () => {
        const { textarea, button } = await mount({ value: "x" });
        select(textarea, 0, 1);
        await click(button("Quote"));
        expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("x");
    });

    test("source block wraps the lines", async () => {
        const { textarea, button } = await mount({ value: "x = 1" });
        select(textarea, 0, 5);
        await click(button("Source block"));
        expect(textarea.value).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
    });

    test("property adds a drawer with the key, and the key is an option", async () => {
        const { textarea, button } = await mount({ value: "* Ship", propertyKey: "CUSTOM_ID" });
        select(textarea, 0, 0);
        await click(button("Property"));
        expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
    });

    test("drawer wraps the lines, and the name is an option", async () => {
        const { textarea, button } = await mount({ value: "note", drawerName: "NOTES" });
        select(textarea, 0, 4);
        await click(button("Drawer"));
        expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
    });

    test("contact makes an org-contacts entry from the selected name", async () => {
        const { textarea, button } = await mount({ value: "Ada Lovelace" });
        select(textarea, 0, 12);
        await click(button("Contact"));
        expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
    });

    test("the contact properties are an option", async () => {
        const { textarea, button } = await mount({ value: "Ada", contactProperties: ["NICKNAME"] });
        select(textarea, 0, 3);
        await click(button("Contact"));
        expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
    });

    test("a tool with nothing to do leaves the text alone", async () => {
        const { textarea, button } = await mount({ value: "plain" });
        select(textarea, 0, 0);
        await click(button("Scheduled"));
        expect(textarea.value).toBe("plain");
    });

    test("a tool that changed the text dispatches lily:valuechange; one with nothing to do does not", async () => {
        const { root, textarea, button } = await mount({ value: "plain" });
        const changed = vi.fn();
        root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
        select(textarea, 0, 0);
        await click(button("Scheduled"));
        expect(changed).not.toHaveBeenCalled();
        await click(button("Bold"));
        expect(changed).toHaveBeenLastCalledWith("**plain");
        expect((Alpine.$data(root) as { value: string }).value).toBe("**plain");
    });

    test("with no `today` the date is the local date", async () => {
        const { textarea, button } = await mount({ value: "x", today: undefined });
        select(textarea, 0, 0);
        await click(button("Timestamp"));
        expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
    });

    test("moves focus back to the textarea after a tool runs", async () => {
        const { textarea, button } = await mount();
        select(textarea, 0, 5);
        await click(button("Italic"));
        expect(document.activeElement).toBe(textarea);
    });

    test("typing updates the value and dispatches", async () => {
        const { root, textarea } = await mount({ value: "" });
        const changed = vi.fn();
        root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
        textarea.value = "ab";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        await settle();
        expect(changed).toHaveBeenLastCalledWith("ab");
    });
});

describe("shortcuts", () => {
    test("Ctrl+B bolds, Cmd+U underlines", async () => {
        const { textarea } = await mount();
        select(textarea, 0, 5);
        await press(textarea, "b", { ctrlKey: true });
        expect(textarea.value).toBe("*hello* world");
        select(textarea, 1, 6);
        await press(textarea, "u", { metaKey: true });
        expect(textarea.value).toBe("*_hello_* world");
    });

    test("a shortcut for a tool that is not shown does nothing", async () => {
        const { textarea } = await mount({ tools: ["code"] });
        select(textarea, 0, 5);
        await press(textarea, "b", { ctrlKey: true });
        expect(textarea.value).toBe("hello world");
    });

    test("plain letters are untouched", async () => {
        const { textarea } = await mount();
        expect((await press(textarea, "b")).defaultPrevented).toBe(false);
    });
});

describe("toolbar keyboard", () => {
    test("only one button is in the tab order (roving tabindex)", async () => {
        const tabbable = (await mount()).buttons().filter((b) => b.getAttribute("tabindex") === "0");
        expect(tabbable.length).toBe(1);
        expect(tabbable[0].dataset.tool).toBe("heading");
    });

    test("arrows move focus and the tab stop, clamping at the ends", async () => {
        const { buttons } = await mount();
        const b = buttons();
        b[0].focus();
        await press(b[0], "ArrowRight");
        expect(document.activeElement).toBe(b[1]);
        expect(b[1].getAttribute("tabindex")).toBe("0");
        expect(b[0].getAttribute("tabindex")).toBe("-1");
        await press(b[1], "ArrowLeft");
        await press(b[0], "ArrowLeft");
        expect(document.activeElement).toBe(b[0]);
    });

    test("Home and End jump to the ends", async () => {
        const { buttons } = await mount();
        const b = buttons();
        b[2].focus();
        await press(b[2], "End");
        expect(document.activeElement).toBe(b[b.length - 1]);
        await press(b[b.length - 1], "Home");
        expect(document.activeElement).toBe(b[0]);
    });
});

describe("disabled and readonly", () => {
    test("disabled disables the textarea and every button", async () => {
        const { textarea, buttons } = await mount({ disabled: true });
        expect(textarea.disabled).toBe(true);
        for (const b of buttons()) expect(b.disabled).toBe(true);
    });

    test("readonly keeps the text unchangeable by a tool", async () => {
        const { textarea, button } = await mount({ readonly: true });
        select(textarea, 0, 5);
        await click(button("Bold"));
        expect(textarea.value).toBe("hello world");
    });
});
