// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { autoInit, initOrgEditor, TOOL_IDS, TOOL_GROUPS } from "./org-editor.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, { autoescape: true, trimBlocks: true, lstripBlocks: true });

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

function html(opts: Record<string, unknown> = {}): string {
  return env.renderString(
    `{% from "org-editor.njk" import orgEditor %}{{ orgEditor(opts) }}`,
    { opts: { label: "Notes", toolbarLabel: "Formatting", labels, value: "hello world", today: "2026-10-24", ...opts } },
  );
}

function mount(opts: Record<string, unknown> = {}, init = true) {
  document.body.innerHTML = html(opts);
  const root = document.querySelector<HTMLElement>(".org-editor")!;
  const textarea = root.querySelector("textarea") as HTMLTextAreaElement;
  const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>("button"));
  const button = (name: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
  const dispose = init ? initOrgEditor(root) : () => {};
  return { root, textarea, buttons, button, dispose };
}

afterEach(() => {
  document.body.innerHTML = "";
});

const select = (ta: HTMLTextAreaElement, a: number, b: number) => {
  ta.focus();
  ta.setSelectionRange(a, b);
};
const key = (target: Element, init: KeyboardEventInit) => {
  const ev = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  target.dispatchEvent(ev);
  return ev;
};

describe("macro (server output)", () => {
  test("renders a toolbar and a textarea under the base classes", () => {
    const { root, textarea } = mount({}, false);
    expect(root.matches("div.org-editor")).toBe(true);
    const bar = root.querySelector('[role="toolbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Formatting");
    expect(bar.className).toContain("org-editor-toolbar");
    expect(textarea.className).toContain("org-editor-textarea");
    expect(textarea.getAttribute("aria-label")).toBe("Notes");
    expect(textarea.value).toBe("hello world");
  });

  test("renders one named button per labelled tool, in the default order", () => {
    const { buttons } = mount({}, false);
    expect(buttons().map((b) => b.dataset.tool)).toEqual([...TOOL_IDS]);
    expect(buttons().map((b) => b.getAttribute("aria-label"))).toEqual(TOOL_IDS.map((t) => (labels as Record<string, string>)[t]));
  });

  test("every button carries its group", () => {
    for (const b of mount({}, false).buttons()) expect(b.dataset.group).toBe(TOOL_GROUPS[b.dataset.tool as keyof typeof TOOL_GROUPS]);
  });

  test("omits a tool that has no label", () => {
    expect(mount({ labels: { todo: "Task" } }, false).buttons().length).toBe(1);
  });

  test("honours tools for subset and order", () => {
    expect(mount({ tools: ["contact", "todo"] }, false).buttons().map((b) => b.dataset.tool)).toEqual(["contact", "todo"]);
  });

  test("every button is type=button; exactly one holds the tab stop", () => {
    const { buttons } = mount({}, false);
    for (const b of buttons()) expect(b.getAttribute("type")).toBe("button");
    const tabbable = buttons().filter((b) => b.getAttribute("tabindex") === "0");
    expect(tabbable.length).toBe(1);
    expect(tabbable[0].dataset.tool).toBe("heading");
  });

  test("icons are decorative and draw one path each", () => {
    const { root } = mount({}, false);
    for (const svg of Array.from(root.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelectorAll("svg path").length).toBe(TOOL_IDS.length);
  });

  test("the toolbar controls the textarea", () => {
    const { root, textarea } = mount({ id: "notes-text" }, false);
    expect(textarea.id).toBe("notes-text");
    expect(root.querySelector('[role="toolbar"]')!.getAttribute("aria-controls")).toBe("notes-text");
  });

  test("passes name, rows, placeholder, required, disabled through to the textarea", () => {
    const { textarea } = mount({ name: "body", rows: 6, placeholder: "Type", required: true, disabled: true }, false);
    expect(textarea.name).toBe("body");
    expect(textarea.rows).toBe(6);
    expect(textarea.placeholder).toBe("Type");
    expect(textarea.required).toBe(true);
    expect(textarea.disabled).toBe(true);
  });

  test("escapes the value and the labels", () => {
    const { textarea, button } = mount({ value: "<script>x</script>", labels: { bold: "A & B" } }, false);
    expect(textarea.value).toBe("<script>x</script>");
    expect(button("A & B")).toBeTruthy();
    expect(document.querySelectorAll("script").length).toBe(0);
  });

  test("appends classes to the root", () => {
    expect(mount({ classes: "mine" }, false).root.getAttribute("class")).toBe("org-editor mine");
  });

  test("ships no English of its own: no labels, no buttons", () => {
    expect(mount({ labels: {} }, false).buttons().length).toBe(0);
  });

  test("submits with a form under the field name, with no JavaScript", () => {
    document.body.innerHTML = `<form>${html({ name: "notes" })}</form>`;
    expect(new FormData(document.querySelector("form")!).get("notes")).toBe("hello world");
  });
});

describe("client", () => {
  test("bold wraps the selection in org's single asterisks", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Bold").click();
    expect(textarea.value).toBe("*hello* world");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
  });

  test("italic uses slashes", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Italic").click();
    expect(textarea.value).toBe("/hello/ world");
  });

  test("underline uses underscores", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Underline").click();
    expect(textarea.value).toBe("_hello_ world");
  });

  test("strikethrough uses plus signs", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Strikethrough").click();
    expect(textarea.value).toBe("+hello+ world");
  });

  test("code uses tildes", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Code").click();
    expect(textarea.value).toBe("~hello~ world");
  });

  test("verbatim uses equals signs", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Verbatim").click();
    expect(textarea.value).toBe("=hello= world");
  });

  test("pressing a text tool again takes it off", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Bold").click();
    button("Bold").click();
    expect(textarea.value).toBe("hello world");
  });

  test("link writes an org link and selects the address", () => {
    const { textarea, button } = mount({ value: "hello world" });
    select(textarea, 0, 5);
    button("Link").click();
    expect(textarea.value).toBe("[[https://][hello]] world");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
  });

  test("heading uses the headingLevel", () => {
    const { textarea, button } = mount({ value: "hello world", headingLevel: 2 });
    select(textarea, 0, 0);
    button("Heading").click();
    expect(textarea.value).toBe("** hello world");
  });

  test("demote adds a star", () => {
    const { textarea, button } = mount({ value: "* a" });
    select(textarea, 0, 3);
    button("Demote").click();
    expect(textarea.value).toBe("** a");
  });

  test("demote then promote returns to the start", () => {
    const { textarea, button } = mount({ value: "* a" });
    select(textarea, 0, 3);
    button("Demote").click();
    button("Promote").click();
    expect(textarea.value).toBe("* a");
  });

  test("task makes TODO", () => {
    const { textarea, button } = mount({ value: "* Ship" });
    select(textarea, 0, 0);
    button("Task").click();
    expect(textarea.value).toBe("* TODO Ship");
  });

  test("task again makes DONE", () => {
    const { textarea, button } = mount({ value: "* Ship" });
    select(textarea, 0, 0);
    button("Task").click();
    button("Task").click();
    expect(textarea.value).toBe("* DONE Ship");
  });

  test("task a third time clears it", () => {
    const { textarea, button } = mount({ value: "* Ship" });
    select(textarea, 0, 0);
    button("Task").click();
    button("Task").click();
    button("Task").click();
    expect(textarea.value).toBe("* Ship");
  });

  test("the keywords are an option", () => {
    const { textarea, button } = mount({ value: "* Ship", todoKeywords: ["NEXT", "DONE"] });
    select(textarea, 0, 0);
    button("Task").click();
    expect(textarea.value).toBe("* NEXT Ship");
  });

  test("priority writes [#A]", () => {
    const { textarea, button } = mount({ value: "* Ship" });
    select(textarea, 0, 0);
    button("Priority").click();
    expect(textarea.value).toBe("* [#A] Ship");
  });

  test("scheduled writes a planning line and selects the date", () => {
    const { textarea, button } = mount({ value: "* Ship\nbody" });
    select(textarea, 0, 0);
    button("Scheduled").click();
    expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
  });

  test("scheduled again removes it", () => {
    const { textarea, button } = mount({ value: "* Ship\nbody" });
    select(textarea, 0, 0);
    button("Scheduled").click();
    button("Scheduled").click();
    expect(textarea.value).toBe("* Ship\nbody");
  });

  test("deadline writes DEADLINE", () => {
    const { textarea, button } = mount({ value: "* Ship" });
    select(textarea, 0, 0);
    button("Deadline").click();
    expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
  });

  test("timestamp inserts at the caret", () => {
    const { textarea, button } = mount({ value: "due " });
    select(textarea, 4, 4);
    button("Timestamp").click();
    expect(textarea.value).toBe("due <2026-10-24 Sat>");
  });

  test("bullet list prefixes the lines", () => {
    const { textarea, button } = mount({ value: "a\nb" });
    select(textarea, 0, 3);
    button("Bulleted list").click();
    expect(textarea.value).toBe("- a\n- b");
  });

  test("checkbox cycles open then done", () => {
    const { textarea, button } = mount({ value: "a\nb" });
    select(textarea, 0, 3);
    button("Bulleted list").click();
    button("Checkbox").click();
    button("Checkbox").click();
    expect(textarea.value).toBe("- [X] a\n- [X] b");
  });

  test("numbered list counts from 1", () => {
    const { textarea, button } = mount({ value: "a\nb" });
    select(textarea, 0, 3);
    button("Numbered list").click();
    expect(textarea.value).toBe("1. a\n2. b");
  });

  test("quote wraps the lines in an org block", () => {
    const { textarea, button } = mount({ value: "x" });
    select(textarea, 0, 1);
    button("Quote").click();
    expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("x");
  });

  test("source block wraps the lines", () => {
    const { textarea, button } = mount({ value: "x = 1" });
    select(textarea, 0, 5);
    button("Source block").click();
    expect(textarea.value).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
  });

  test("property adds a drawer with the key, and the key is an option", () => {
    const { textarea, button } = mount({ value: "* Ship", propertyKey: "CUSTOM_ID" });
    select(textarea, 0, 0);
    button("Property").click();
    expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
  });

  test("drawer wraps the lines, and the name is an option", () => {
    const { textarea, button } = mount({ value: "note", drawerName: "NOTES" });
    select(textarea, 0, 4);
    button("Drawer").click();
    expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
  });

  test("contact makes an org-contacts entry from the selected name", () => {
    const { textarea, button } = mount({ value: "Ada Lovelace" });
    select(textarea, 0, 12);
    button("Contact").click();
    expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
  });

  test("the contact properties are an option", () => {
    const { textarea, button } = mount({ value: "Ada", contactProperties: ["NICKNAME"] });
    select(textarea, 0, 3);
    button("Contact").click();
    expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
  });

  test("a tool with nothing to do leaves the text alone", () => {
    const { textarea, button } = mount({ value: "plain" });
    select(textarea, 0, 0);
    button("Scheduled").click();
    expect(textarea.value).toBe("plain");
  });

  test("a tool that changed the text dispatches lily:valuechange; one with nothing to do does not", () => {
    const { root, textarea, button } = mount({ value: "plain" });
    const changed = vi.fn();
    root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
    select(textarea, 0, 0);
    button("Scheduled").click();
    expect(changed).not.toHaveBeenCalled();
    button("Bold").click();
    expect(changed).toHaveBeenLastCalledWith("**plain");
  });

  test("with no `today` the date is the local date", () => {
    const { textarea, button } = mount({ value: "x", today: undefined });
    select(textarea, 0, 0);
    button("Timestamp").click();
    expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
  });

  test("moves focus back to the textarea after a tool runs", () => {
    const { textarea, button } = mount();
    select(textarea, 0, 5);
    button("Italic").click();
    expect(document.activeElement).toBe(textarea);
  });

  test("typing dispatches lily:valuechange with the new text", () => {
    const { root, textarea } = mount({ value: "" });
    const changed = vi.fn();
    root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
    textarea.value = "ab";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    expect(changed).toHaveBeenLastCalledWith("ab");
  });

  test("Ctrl+B bolds, Cmd+U underlines, an absent tool's shortcut does nothing", () => {
    const { textarea } = mount();
    select(textarea, 0, 5);
    key(textarea, { key: "b", ctrlKey: true });
    expect(textarea.value).toBe("*hello* world");
    select(textarea, 1, 6);
    key(textarea, { key: "u", metaKey: true });
    expect(textarea.value).toBe("*_hello_* world");
    const second = mount({ tools: ["code"] });
    select(second.textarea, 0, 5);
    key(second.textarea, { key: "b", ctrlKey: true });
    expect(second.textarea.value).toBe("hello world");
  });

  test("plain letters are untouched", () => {
    const { textarea } = mount();
    expect(key(textarea, { key: "b" }).defaultPrevented).toBe(false);
  });

  test("arrows move focus and the tab stop, clamping at the ends; Home and End jump", () => {
    const { buttons } = mount();
    const b = buttons();
    b[0].focus();
    key(b[0], { key: "ArrowRight" });
    expect(document.activeElement).toBe(b[1]);
    expect(b[1].getAttribute("tabindex")).toBe("0");
    expect(b[0].getAttribute("tabindex")).toBe("-1");
    key(b[1], { key: "ArrowLeft" });
    key(b[0], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(b[0]);
    key(b[0], { key: "End" });
    expect(document.activeElement).toBe(b[b.length - 1]);
    key(b[b.length - 1], { key: "Home" });
    expect(document.activeElement).toBe(b[0]);
  });

  test("readonly keeps the text unchangeable by a tool; disabled disables the buttons", () => {
    const ro = mount({ readonly: true });
    select(ro.textarea, 0, 5);
    ro.button("Bold").click();
    expect(ro.textarea.value).toBe("hello world");
    for (const b of mount({ disabled: true }, false).buttons()) expect(b.disabled).toBe(true);
  });

  test("the macro's data attributes carry the options to the client", () => {
    const { textarea, button } = mount({ value: "* a", todoKeywords: ["NEXT", "DONE"] });
    select(textarea, 0, 0);
    button("Task").click();
    expect(textarea.value).toBe("* NEXT a");
  });

  test("dispose removes the behaviour", () => {
    const { textarea, button, dispose } = mount();
    dispose();
    select(textarea, 0, 5);
    button("Bold").click();
    expect(textarea.value).toBe("hello world");
  });

  test("autoInit wires every editor under a scope", () => {
    document.body.innerHTML = html({ id: "a" }) + html({ id: "b" });
    expect(autoInit().length).toBe(2);
  });
});
