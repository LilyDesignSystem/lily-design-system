import { Component, TemplateRef, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, test, vi } from "vitest";

import { OrgEditor, nextOrgEditorId } from "./org-editor.component";
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

function setup(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(OrgEditor);
  const all = { label: "Notes", toolbarLabel: "Formatting", labels, value: "hello world", today: "2026-10-24", ...inputs };
  for (const [k, v] of Object.entries(all)) if (v !== undefined) fixture.componentRef.setInput(k, v);
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  const textarea = root.querySelector("textarea") as HTMLTextAreaElement;
  const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>("button"));
  const button = (name: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
  const click = (name: string) => {
    button(name).click();
    fixture.detectChanges();
  };
  return { fixture, root, textarea, buttons, button, click };
}

function select(textarea: HTMLTextAreaElement, start: number, end: number) {
  textarea.focus();
  textarea.setSelectionRange(start, end);
}

const key = (el: Element, init: KeyboardEventInit) => {
  const ev = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
  el.dispatchEvent(ev);
  return ev;
};

describe("structure", () => {
  test("renders a toolbar and a textarea under the base classes", () => {
    const { root, textarea } = setup();
    expect(root.querySelector("div.org-editor")).toBeTruthy();
    const bar = root.querySelector('[role="toolbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Formatting");
    expect(bar.className).toContain("org-editor-toolbar");
    expect(textarea.className).toContain("org-editor-textarea");
    expect(textarea.getAttribute("aria-label")).toBe("Notes");
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
    expect(setup({ labels: { todo: "Task" } }).buttons().length).toBe(1);
  });

  test("honours the tools input for subset and order", () => {
    expect(setup({ tools: ["contact", "todo"] }).buttons().map((b) => b.getAttribute("data-tool"))).toEqual(["contact", "todo"]);
  });

  test("every button is type=button", () => {
    for (const b of setup().buttons()) expect(b.getAttribute("type")).toBe("button");
  });

  test("icons are decorative and draw one path each", () => {
    const { root } = setup();
    for (const svg of Array.from(root.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelectorAll("svg path").length).toBe(TOOL_IDS.length);
  });

  test("the toolbar controls the textarea", () => {
    const { root, textarea } = setup();
    expect(root.querySelector('[role="toolbar"]')!.getAttribute("aria-controls")).toBe(textarea.id);
  });

  test("passes name, rows, placeholder, required through to the textarea", () => {
    const { textarea } = setup({ name: "body", rows: 6, placeholder: "Type", required: true });
    expect(textarea.name).toBe("body");
    expect(textarea.rows).toBe(6);
    expect(textarea.placeholder).toBe("Type");
    expect(textarea.required).toBe(true);
  });

  test("appends className to the root class", () => {
    const classes = setup({ className: "mine" }).root.querySelector(".org-editor")!.classList;
    expect(classes.contains("org-editor")).toBe(true);
    expect(classes.contains("mine")).toBe(true);
  });

  test("ships no English of its own: no labels, no buttons, no placeholder", () => {
    const { buttons, textarea } = setup({ labels: {} });
    expect(buttons().length).toBe(0);
    expect(textarea.getAttribute("placeholder")).toBeNull();
  });

  test("ids are unique per editor", () => {
    expect(nextOrgEditorId()).not.toBe(nextOrgEditorId());
  });
});

describe("tools", () => {
  test("bold wraps the selection in org's single asterisks", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Bold");
    expect(textarea.value).toBe("*hello* world");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
  });

  test("italic uses slashes", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Italic");
    expect(textarea.value).toBe("/hello/ world");
  });

  test("underline uses underscores", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Underline");
    expect(textarea.value).toBe("_hello_ world");
  });

  test("strikethrough uses plus signs", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Strikethrough");
    expect(textarea.value).toBe("+hello+ world");
  });

  test("code uses tildes", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Code");
    expect(textarea.value).toBe("~hello~ world");
  });

  test("verbatim uses equals signs", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Verbatim");
    expect(textarea.value).toBe("=hello= world");
  });

  test("pressing a text tool again takes it off", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Bold");
    click("Bold");
    expect(textarea.value).toBe("hello world");
  });

  test("link writes an org link and selects the address", () => {
    const { textarea, click } = setup({ value: "hello world" });
    select(textarea, 0, 5);
    click("Link");
    expect(textarea.value).toBe("[[https://][hello]] world");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
  });

  test("heading uses the headingLevel", () => {
    const { textarea, click } = setup({ value: "hello world", headingLevel: 2 });
    select(textarea, 0, 0);
    click("Heading");
    expect(textarea.value).toBe("** hello world");
  });

  test("demote adds a star", () => {
    const { textarea, click } = setup({ value: "* a" });
    select(textarea, 0, 3);
    click("Demote");
    expect(textarea.value).toBe("** a");
  });

  test("demote then promote returns to the start", () => {
    const { textarea, click } = setup({ value: "* a" });
    select(textarea, 0, 3);
    click("Demote");
    click("Promote");
    expect(textarea.value).toBe("* a");
  });

  test("task makes TODO", () => {
    const { textarea, click } = setup({ value: "* Ship" });
    select(textarea, 0, 0);
    click("Task");
    expect(textarea.value).toBe("* TODO Ship");
  });

  test("task again makes DONE", () => {
    const { textarea, click } = setup({ value: "* Ship" });
    select(textarea, 0, 0);
    click("Task");
    click("Task");
    expect(textarea.value).toBe("* DONE Ship");
  });

  test("task a third time clears it", () => {
    const { textarea, click } = setup({ value: "* Ship" });
    select(textarea, 0, 0);
    click("Task");
    click("Task");
    click("Task");
    expect(textarea.value).toBe("* Ship");
  });

  test("the keywords are an option", () => {
    const { textarea, click } = setup({ value: "* Ship", todoKeywords: ["NEXT", "DONE"] });
    select(textarea, 0, 0);
    click("Task");
    expect(textarea.value).toBe("* NEXT Ship");
  });

  test("priority writes [#A]", () => {
    const { textarea, click } = setup({ value: "* Ship" });
    select(textarea, 0, 0);
    click("Priority");
    expect(textarea.value).toBe("* [#A] Ship");
  });

  test("scheduled writes a planning line and selects the date", () => {
    const { textarea, click } = setup({ value: "* Ship\nbody" });
    select(textarea, 0, 0);
    click("Scheduled");
    expect(textarea.value).toBe("* Ship\nSCHEDULED: <2026-10-24 Sat>\nbody");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("2026-10-24 Sat");
  });

  test("scheduled again removes it", () => {
    const { textarea, click } = setup({ value: "* Ship\nbody" });
    select(textarea, 0, 0);
    click("Scheduled");
    click("Scheduled");
    expect(textarea.value).toBe("* Ship\nbody");
  });

  test("deadline writes DEADLINE", () => {
    const { textarea, click } = setup({ value: "* Ship" });
    select(textarea, 0, 0);
    click("Deadline");
    expect(textarea.value).toBe("* Ship\nDEADLINE: <2026-10-24 Sat>");
  });

  test("timestamp inserts at the caret", () => {
    const { textarea, click } = setup({ value: "due " });
    select(textarea, 4, 4);
    click("Timestamp");
    expect(textarea.value).toBe("due <2026-10-24 Sat>");
  });

  test("bullet list prefixes the lines", () => {
    const { textarea, click } = setup({ value: "a\nb" });
    select(textarea, 0, 3);
    click("Bulleted list");
    expect(textarea.value).toBe("- a\n- b");
  });

  test("checkbox cycles open then done", () => {
    const { textarea, click } = setup({ value: "a\nb" });
    select(textarea, 0, 3);
    click("Bulleted list");
    click("Checkbox");
    click("Checkbox");
    expect(textarea.value).toBe("- [X] a\n- [X] b");
  });

  test("numbered list counts from 1", () => {
    const { textarea, click } = setup({ value: "a\nb" });
    select(textarea, 0, 3);
    click("Numbered list");
    expect(textarea.value).toBe("1. a\n2. b");
  });

  test("quote wraps the lines in an org block", () => {
    const { textarea, click } = setup({ value: "x" });
    select(textarea, 0, 1);
    click("Quote");
    expect(textarea.value).toBe("#+BEGIN_QUOTE\nx\n#+END_QUOTE");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("x");
  });

  test("source block wraps the lines", () => {
    const { textarea, click } = setup({ value: "x = 1" });
    select(textarea, 0, 5);
    click("Source block");
    expect(textarea.value).toBe("#+BEGIN_SRC\nx = 1\n#+END_SRC");
  });

  test("property adds a drawer with the key, and the key is an option", () => {
    const { textarea, click } = setup({ value: "* Ship", propertyKey: "CUSTOM_ID" });
    select(textarea, 0, 0);
    click("Property");
    expect(textarea.value).toBe("* Ship\n:PROPERTIES:\n:CUSTOM_ID: \n:END:");
  });

  test("drawer wraps the lines, and the name is an option", () => {
    const { textarea, click } = setup({ value: "note", drawerName: "NOTES" });
    select(textarea, 0, 4);
    click("Drawer");
    expect(textarea.value).toBe(":NOTES:\nnote\n:END:");
  });

  test("contact makes an org-contacts entry from the selected name", () => {
    const { textarea, click } = setup({ value: "Ada Lovelace" });
    select(textarea, 0, 12);
    click("Contact");
    expect(textarea.value).toBe("* Ada Lovelace\n:PROPERTIES:\n:EMAIL: \n:PHONE: \n:ADDRESS: \n:BIRTHDAY: \n:END:");
  });

  test("the contact properties are an option", () => {
    const { textarea, click } = setup({ value: "Ada", contactProperties: ["NICKNAME"] });
    select(textarea, 0, 3);
    click("Contact");
    expect(textarea.value).toBe("* Ada\n:PROPERTIES:\n:NICKNAME: \n:END:");
  });

  test("a tool with nothing to do leaves the text alone", () => {
    const { textarea, click } = setup({ value: "plain" });
    select(textarea, 0, 0);
    click("Scheduled");
    expect(textarea.value).toBe("plain");
  });

  test("a tool that changed the text updates the model and emits changed; one with nothing to do does not", () => {
    const { fixture, textarea, click } = setup({ value: "plain" });
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    select(textarea, 0, 0);
    click("Scheduled");
    expect(changed).not.toHaveBeenCalled();
    click("Bold");
    expect(fixture.componentInstance.value()).toBe("**plain");
    expect(changed).toHaveBeenLastCalledWith("**plain");
  });

  test("with no `today` the date is the local date", () => {
    const { textarea, click } = setup({ value: "x", today: undefined });
    select(textarea, 0, 0);
    click("Timestamp");
    expect(textarea.value).toMatch(/^<\d{4}-\d{2}-\d{2} (Sun|Mon|Tue|Wed|Thu|Fri|Sat)>x$/);
  });

  test("moves focus back to the textarea after a tool runs", () => {
    const { textarea, click } = setup();
    select(textarea, 0, 5);
    click("Italic");
    expect(document.activeElement).toBe(textarea);
  });

  test("typing updates the model and emits changed", () => {
    const { fixture, textarea } = setup({ value: "" });
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    textarea.value = "ab";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    expect(fixture.componentInstance.value()).toBe("ab");
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
    const { textarea } = setup({ tools: ["code"] });
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
    const { fixture, buttons } = setup();
    const b = buttons();
    b[0].focus();
    key(b[0], { key: "ArrowRight" });
    fixture.detectChanges();
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
    const { textarea, click } = setup({ readonly: true });
    select(textarea, 0, 5);
    click("Bold");
    expect(textarea.value).toBe("hello world");
  });
});

describe("icon template", () => {
  test("the icon input replaces the default icons", () => {
    @Component({
      standalone: true,
      imports: [OrgEditor],
      template: `
        <ng-template #tpl let-tool><span [attr.data-icon]="tool">x</span></ng-template>
        <lily-org-editor label="Notes" toolbarLabel="Formatting" [labels]="labels" [icon]="tpl" />
      `,
    })
    class Host {
      labels = labels;
      tpl = viewChild<TemplateRef<unknown>>("tpl");
    }
    const fixture: ComponentFixture<Host> = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    expect(root.querySelectorAll("svg").length).toBe(0);
    expect(root.querySelectorAll("[data-icon]").length).toBe(TOOL_IDS.length);
  });
});
