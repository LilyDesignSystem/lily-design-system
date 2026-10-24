import { afterEach, describe, expect, test, vi } from "vitest";

import { MarkdownEditor, nextMarkdownEditorId } from "./markdown-editor.js";

if (!customElements.get("markdown-editor")) customElements.define("markdown-editor", MarkdownEditor);

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

afterEach(() => {
    document.body.innerHTML = "";
});

function setup(attrs: Record<string, string | true> = {}, props: Partial<MarkdownEditor> = {}) {
    const el = document.createElement("markdown-editor") as MarkdownEditor;
    el.setAttribute("label", "Message");
    el.setAttribute("toolbar-label", "Formatting");
    el.setAttribute("value", "hello world");
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v === true ? "" : v);
    el.labels = (props as { labels?: object }).labels ?? labels;
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
        expect(el.querySelector("div.markdown-editor")).toBeTruthy();
        const bar = el.querySelector('[role="toolbar"]')!;
        expect(bar.getAttribute("aria-label")).toBe("Formatting");
        expect(bar.className).toContain("markdown-editor-toolbar");
        expect(textarea.className).toContain("markdown-editor-textarea");
        expect(textarea.getAttribute("aria-label")).toBe("Message");
        expect(textarea.value).toBe("hello world");
    });

    test("renders one named button per labelled tool, in order", () => {
        expect(setup().buttons().map((b) => b.getAttribute("aria-label"))).toEqual(Object.values(labels));
    });

    test("omits a tool that has no label", () => {
        expect(setup({}, { labels: { bold: "Bold" } } as never).buttons().length).toBe(1);
    });

    test("honours the tools attribute for subset and order", () => {
        expect(setup({ tools: "link bold" }).buttons().map((b) => b.getAttribute("data-tool"))).toEqual(["link", "bold"]);
    });

    test("ignores an unknown tool id", () => {
        expect(setup({ tools: "bold nonsense" }).buttons().length).toBe(1);
    });

    test("labels can arrive as a JSON attribute", () => {
        const el = document.createElement("markdown-editor") as MarkdownEditor;
        el.setAttribute("label", "M");
        el.setAttribute("toolbar-label", "F");
        el.setAttribute("labels", JSON.stringify({ bold: "Bold" }));
        document.body.append(el);
        expect(el.querySelectorAll("button").length).toBe(1);
    });

    test("every button is type=button so it never submits a form", () => {
        for (const b of setup().buttons()) expect(b.getAttribute("type")).toBe("button");
    });

    test("icons are decorative", () => {
        for (const svg of Array.from(setup().el.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
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
        expect(setup({ class: "mine" }).el.querySelector(".markdown-editor")!.getAttribute("class")).toBe("markdown-editor mine");
    });

    test("ships no English of its own: no tool labels, no placeholder text", () => {
        const { buttons, textarea } = setup({}, { labels: {} } as never);
        expect(buttons().length).toBe(0);
        expect(textarea.getAttribute("placeholder")).toBeNull();
    });

    test("ids are unique per editor", () => {
        expect(nextMarkdownEditorId()).not.toBe(nextMarkdownEditorId());
    });

    test("the textarea submits with an enclosing form under its name", () => {
        const form = document.createElement("form");
        const el = document.createElement("markdown-editor") as MarkdownEditor;
        el.setAttribute("label", "M");
        el.setAttribute("name", "body");
        el.setAttribute("value", "hi");
        form.append(el);
        document.body.append(form);
        expect(new FormData(form).get("body")).toBe("hi");
    });

    test("the value property reads and writes the text", () => {
        const { el, textarea } = setup();
        el.value = "changed";
        expect(textarea.value).toBe("changed");
        expect(el.value).toBe("changed");
    });
});

describe("tools", () => {
    test("bold wraps the selection, updates the textarea and fires valuechange", () => {
        const { el, textarea, button } = setup();
        const changed = vi.fn();
        el.addEventListener("valuechange", (e) => changed((e as CustomEvent).detail.value));
        select(textarea, 0, 5);
        button("Bold").click();
        expect(textarea.value).toBe("**hello** world");
        expect(changed).toHaveBeenLastCalledWith("**hello** world");
    });

    test("keeps the selection on the formatted text, ready for the next tool", () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        button("Bold").click();
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    test("pressing the same tool again takes the formatting off", () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        button("Bold").click();
        button("Bold").click();
        expect(textarea.value).toBe("hello world");
    });

    test("list tools prefix the selected lines", () => {
        const { textarea, button } = setup({ value: "a\nb" });
        select(textarea, 0, 3);
        button("Numbered list").click();
        expect(textarea.value).toBe("1. a\n2. b");
    });

    test("link selects the address placeholder", () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        button("Link").click();
        expect(textarea.value).toBe("[hello](https://) world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    test("the heading level is an attribute", () => {
        const { textarea, button } = setup({ "heading-level": "3" });
        select(textarea, 0, 0);
        button("Heading").click();
        expect(textarea.value).toBe("### hello world");
    });

    test("typing fires valuechange with the new text", () => {
        const { el, textarea } = setup({ value: "" });
        const changed = vi.fn();
        el.addEventListener("valuechange", (e) => changed((e as CustomEvent).detail.value));
        textarea.value = "ab";
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        expect(changed).toHaveBeenLastCalledWith("ab");
    });

    test("moves focus back to the textarea after a tool runs", () => {
        const { textarea, button } = setup();
        select(textarea, 0, 5);
        button("Italic").click();
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
    test("draws a default path per tool", () => {
        expect(setup().el.querySelectorAll("svg path").length).toBe(9);
    });

    test("renderIcon can be overridden", () => {
        const { el } = setup();
        el.renderIcon = (tool) => Object.assign(document.createElement("span"), { textContent: tool });
        el.labels = labels; // re-render the toolbar with the override
        expect(el.querySelectorAll("svg").length).toBe(0);
        expect(el.querySelectorAll("button span").length).toBe(9);
    });
});
