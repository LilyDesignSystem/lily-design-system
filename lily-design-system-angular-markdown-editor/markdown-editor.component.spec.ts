import { Component, TemplateRef, viewChild } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, test, vi } from "vitest";

import { MarkdownEditor, nextMarkdownEditorId } from "./markdown-editor.component";

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

function setup(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(MarkdownEditor);
  const all = { label: "Message", toolbarLabel: "Formatting", labels, value: "hello world", ...inputs };
  for (const [k, v] of Object.entries(all)) fixture.componentRef.setInput(k, v);
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
    expect(root.querySelector("div.markdown-editor")).toBeTruthy();
    const bar = root.querySelector('[role="toolbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Formatting");
    expect(bar.className).toContain("markdown-editor-toolbar");
    expect(textarea.className).toContain("markdown-editor-textarea");
    expect(textarea.getAttribute("aria-label")).toBe("Message");
  });

  test("renders one named button per labelled tool, in order", () => {
    const { buttons } = setup();
    expect(buttons().map((b) => b.getAttribute("aria-label"))).toEqual(Object.values(labels));
  });

  test("omits a tool that has no label", () => {
    expect(setup({ labels: { bold: "Bold" } }).buttons().length).toBe(1);
  });

  test("honours the tools input for subset and order", () => {
    expect(setup({ tools: ["link", "bold"] }).buttons().map((b) => b.getAttribute("data-tool"))).toEqual(["link", "bold"]);
  });

  test("every button is type=button so it never submits a form", () => {
    for (const b of setup().buttons()) expect(b.getAttribute("type")).toBe("button");
  });

  test("icons are decorative", () => {
    for (const svg of Array.from(setup().root.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
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
    expect(setup({ className: "mine" }).root.querySelector(".markdown-editor")!.getAttribute("class")).toContain("markdown-editor mine");
  });

  test("ships no English of its own: no tool labels, no placeholder text", () => {
    const { buttons, textarea } = setup({ labels: {} });
    expect(buttons().length).toBe(0);
    expect(textarea.getAttribute("placeholder")).toBeNull();
  });

  test("ids are unique per editor", () => {
    expect(nextMarkdownEditorId()).not.toBe(nextMarkdownEditorId());
  });
});

describe("tools", () => {
  test("bold wraps the selection, updates the textarea, the model and the changed output", () => {
    const { fixture, textarea, click } = setup();
    const changed = vi.fn();
    fixture.componentInstance.changed.subscribe(changed);
    select(textarea, 0, 5);
    click("Bold");
    expect(textarea.value).toBe("**hello** world");
    expect(fixture.componentInstance.value()).toBe("**hello** world");
    expect(changed).toHaveBeenLastCalledWith("**hello** world");
  });

  test("keeps the selection on the formatted text, ready for the next tool", () => {
    const { textarea, click } = setup();
    select(textarea, 0, 5);
    click("Bold");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
  });

  test("pressing the same tool again takes the formatting off", () => {
    const { textarea, click } = setup();
    select(textarea, 0, 5);
    click("Bold");
    click("Bold");
    expect(textarea.value).toBe("hello world");
  });

  test("list tools prefix the selected lines", () => {
    const { textarea, click } = setup({ value: "a\nb" });
    select(textarea, 0, 3);
    click("Numbered list");
    expect(textarea.value).toBe("1. a\n2. b");
  });

  test("link selects the address placeholder", () => {
    const { textarea, click } = setup();
    select(textarea, 0, 5);
    click("Link");
    expect(textarea.value).toBe("[hello](https://) world");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
  });

  test("the heading level is an input", () => {
    const { textarea, click } = setup({ headingLevel: 3 });
    select(textarea, 0, 0);
    click("Heading");
    expect(textarea.value).toBe("### hello world");
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

  test("moves focus back to the textarea after a tool runs", () => {
    const { textarea, click } = setup();
    select(textarea, 0, 5);
    click("Italic");
    expect(document.activeElement).toBe(textarea);
  });
});

describe("shortcuts", () => {
  test("Ctrl+B bolds", () => {
    const { textarea } = setup();
    select(textarea, 0, 5);
    key(textarea, { key: "b", ctrlKey: true });
    expect(textarea.value).toBe("**hello** world");
  });

  test("Cmd+I italicises", () => {
    const { textarea } = setup();
    select(textarea, 0, 5);
    key(textarea, { key: "i", metaKey: true });
    expect(textarea.value).toBe("*hello* world");
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
  test("draws a default path per tool", () => {
    expect(setup().root.querySelectorAll("svg path").length).toBe(9);
  });

  test("the icon input replaces them", () => {
    @Component({
      standalone: true,
      imports: [MarkdownEditor],
      template: `
        <ng-template #tpl let-tool><span [attr.data-icon]="tool">x</span></ng-template>
        <lily-markdown-editor label="Message" toolbarLabel="Formatting" [labels]="labels" [icon]="tpl" />
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
    expect(root.querySelectorAll("[data-icon]").length).toBe(9);
  });
});
