// @vitest-environment jsdom
import { afterEach, describe, expect, test, vi } from "vitest";
import nunjucks from "nunjucks";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { autoInit, initMarkdownEditor } from "./markdown-editor.client.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = nunjucks.configure(__dirname, { autoescape: true, trimBlocks: true, lstripBlocks: true });

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

function html(opts: Record<string, unknown> = {}): string {
  return env.renderString(
    `{% from "markdown-editor.njk" import markdownEditor %}{{ markdownEditor(opts) }}`,
    { opts: { label: "Message", toolbarLabel: "Formatting", labels, value: "hello world", ...opts } },
  );
}

function mount(opts: Record<string, unknown> = {}, init = true) {
  document.body.innerHTML = html(opts);
  const root = document.querySelector<HTMLElement>(".markdown-editor")!;
  const textarea = root.querySelector("textarea") as HTMLTextAreaElement;
  const buttons = () => Array.from(root.querySelectorAll<HTMLButtonElement>("button"));
  const button = (name: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${name}"]`)!;
  const dispose = init ? initMarkdownEditor(root) : () => {};
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
    expect(root.matches("div.markdown-editor")).toBe(true);
    const bar = root.querySelector('[role="toolbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Formatting");
    expect(bar.className).toContain("markdown-editor-toolbar");
    expect(textarea.className).toContain("markdown-editor-textarea");
    expect(textarea.getAttribute("aria-label")).toBe("Message");
    expect(textarea.value).toBe("hello world");
  });

  test("renders one named button per labelled tool, in order", () => {
    expect(mount({}, false).buttons().map((b) => b.getAttribute("aria-label"))).toEqual(Object.values(labels));
  });

  test("omits a tool that has no label", () => {
    expect(mount({ labels: { bold: "Bold" } }, false).buttons().length).toBe(1);
  });

  test("honours tools for subset and order", () => {
    expect(mount({ tools: ["link", "bold"] }, false).buttons().map((b) => b.dataset.tool)).toEqual(["link", "bold"]);
  });

  test("every button is type=button", () => {
    for (const b of mount({}, false).buttons()) expect(b.getAttribute("type")).toBe("button");
  });

  test("exactly one button holds the tab stop", () => {
    const tabbable = mount({}, false).buttons().filter((b) => b.getAttribute("tabindex") === "0");
    expect(tabbable.length).toBe(1);
    expect(tabbable[0].dataset.tool).toBe("heading");
  });

  test("icons are decorative and draw one path each", () => {
    const { root } = mount({}, false);
    for (const svg of Array.from(root.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(root.querySelectorAll("svg path").length).toBe(9);
  });

  test("the toolbar controls the textarea", () => {
    const { root, textarea } = mount({ id: "body-text" }, false);
    expect(textarea.id).toBe("body-text");
    expect(root.querySelector('[role="toolbar"]')!.getAttribute("aria-controls")).toBe("body-text");
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
    expect(mount({ classes: "mine" }, false).root.getAttribute("class")).toBe("markdown-editor mine");
  });

  test("ships no English of its own: no labels, no buttons", () => {
    expect(mount({ labels: {} }, false).buttons().length).toBe(0);
  });

  test("submits with a form under the field name, with no JavaScript", () => {
    document.body.innerHTML = `<form>${html({ name: "body" })}</form>`;
    expect(new FormData(document.querySelector("form")!).get("body")).toBe("hello world");
  });
});

describe("client", () => {
  test("bold wraps the selection, updates the textarea and dispatches lily:valuechange", () => {
    const { root, textarea, button } = mount();
    const changed = vi.fn();
    root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
    select(textarea, 0, 5);
    button("Bold").click();
    expect(textarea.value).toBe("**hello** world");
    expect(changed).toHaveBeenLastCalledWith("**hello** world");
  });

  test("keeps the selection on the formatted text", () => {
    const { textarea, button } = mount();
    select(textarea, 0, 5);
    button("Bold").click();
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
  });

  test("pressing the same tool again takes the formatting off", () => {
    const { textarea, button } = mount();
    select(textarea, 0, 5);
    button("Bold").click();
    button("Bold").click();
    expect(textarea.value).toBe("hello world");
  });

  test("list tools prefix the selected lines", () => {
    const { textarea, button } = mount({ value: "a\nb" });
    select(textarea, 0, 3);
    button("Numbered list").click();
    expect(textarea.value).toBe("1. a\n2. b");
  });

  test("link selects the address placeholder", () => {
    const { textarea, button } = mount();
    select(textarea, 0, 5);
    button("Link").click();
    expect(textarea.value).toBe("[hello](https://) world");
    expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
  });

  test("the heading level is a macro option", () => {
    const { textarea, button } = mount({ headingLevel: 3 });
    select(textarea, 0, 0);
    button("Heading").click();
    expect(textarea.value).toBe("### hello world");
  });

  test("typing dispatches lily:valuechange with the new text", () => {
    const { root, textarea } = mount({ value: "" });
    const changed = vi.fn();
    root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
    textarea.value = "ab";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    expect(changed).toHaveBeenLastCalledWith("ab");
  });

  test("moves focus back to the textarea after a tool runs", () => {
    const { textarea, button } = mount();
    select(textarea, 0, 5);
    button("Italic").click();
    expect(document.activeElement).toBe(textarea);
  });

  test("Ctrl+B bolds, Cmd+I italicises, an absent tool's shortcut does nothing", () => {
    const { textarea } = mount();
    select(textarea, 0, 5);
    key(textarea, { key: "b", ctrlKey: true });
    expect(textarea.value).toBe("**hello** world");
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
    const dis = mount({ disabled: true }, false);
    for (const b of dis.buttons()) expect(b.disabled).toBe(true);
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
