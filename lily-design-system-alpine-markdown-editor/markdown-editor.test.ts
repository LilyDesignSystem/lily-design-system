import { readFileSync } from "node:fs";
import Alpine from "alpinejs";
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest";
import lilyMarkdownEditor, { createMarkdownEditor } from "./index.js";
import type { MarkdownEditorOptions } from "./index.js";

const SNIPPET = readFileSync("snippet.html", "utf8");
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const settle = async () => { await tick(); await tick(); };

const LABELS = {
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

const options = (extra: Partial<MarkdownEditorOptions> = {}): MarkdownEditorOptions => ({
    value: "hello world",
    label: "Message",
    toolbarLabel: "Formatting",
    labels: LABELS,
    ...extra,
});

beforeAll(() => {
    (window as unknown as { Alpine: typeof Alpine }).Alpine = Alpine;
    Alpine.plugin(lilyMarkdownEditor);
    Alpine.start();
});

afterEach(async () => {
    document.body.innerHTML = "";
    await tick();
});

async function mount(extra: Partial<MarkdownEditorOptions> = {}) {
    (window as unknown as { markdownEditorOptions: MarkdownEditorOptions }).markdownEditorOptions = options(extra);
    document.body.innerHTML = SNIPPET;
    await settle();
    const root = document.querySelector(".markdown-editor") as HTMLElement;
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
        expect(root.querySelector("div.markdown-editor") ?? root.classList.contains("markdown-editor")).toBeTruthy();
        const bar = root.querySelector('[role="toolbar"]')!;
        expect(bar.getAttribute("aria-label")).toBe("Formatting");
        expect(bar.className).toContain("markdown-editor-toolbar");
        expect(textarea.className).toContain("markdown-editor-textarea");
        expect(textarea.getAttribute("aria-label")).toBe("Message");
        expect(textarea.value).toBe("hello world");
    });

    test("renders one named button per labelled tool, in order", async () => {
        const { buttons } = await mount();
        expect(buttons().map((b) => b.getAttribute("aria-label"))).toEqual(Object.values(LABELS));
    });

    test("omits a tool that has no label", async () => {
        expect((await mount({ labels: { bold: "Bold" } })).buttons().length).toBe(1);
    });

    test("honours tools for subset and order", async () => {
        expect((await mount({ tools: ["link", "bold"] })).buttons().map((b) => b.dataset.tool)).toEqual(["link", "bold"]);
    });

    test("every button is type=button", async () => {
        for (const b of (await mount()).buttons()) expect(b.getAttribute("type")).toBe("button");
    });

    test("icons are decorative and draw one path each", async () => {
        const { root } = await mount();
        for (const svg of Array.from(root.querySelectorAll("svg"))) expect(svg.getAttribute("aria-hidden")).toBe("true");
        expect(root.querySelectorAll("svg path").length).toBe(9);
    });

    test("the toolbar controls the textarea", async () => {
        const { root, textarea } = await mount();
        expect(root.querySelector('[role="toolbar"]')!.getAttribute("aria-controls")).toBe(textarea.id);
        expect(textarea.id).toMatch(/^markdown-editor-\d+$/);
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
        expect(createMarkdownEditor().id).not.toBe(createMarkdownEditor().id);
    });
});

describe("tools", () => {
    test("bold wraps the selection, updates the textarea and dispatches lily:valuechange", async () => {
        const { root, textarea, button } = await mount();
        const changed = vi.fn();
        root.addEventListener("lily:valuechange", (e) => changed((e as CustomEvent).detail.value));
        select(textarea, 0, 5);
        await click(button("Bold"));
        expect(textarea.value).toBe("**hello** world");
        expect(changed).toHaveBeenLastCalledWith("**hello** world");
        expect((Alpine.$data(root) as { value: string }).value).toBe("**hello** world");
    });

    test("keeps the selection on the formatted text", async () => {
        const { textarea, button } = await mount();
        select(textarea, 0, 5);
        await click(button("Bold"));
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    test("pressing the same tool again takes the formatting off", async () => {
        const { textarea, button } = await mount();
        select(textarea, 0, 5);
        await click(button("Bold"));
        await click(button("Bold"));
        expect(textarea.value).toBe("hello world");
    });

    test("list tools prefix the selected lines", async () => {
        const { textarea, button } = await mount({ value: "a\nb" });
        select(textarea, 0, 3);
        await click(button("Numbered list"));
        expect(textarea.value).toBe("1. a\n2. b");
    });

    test("link selects the address placeholder", async () => {
        const { textarea, button } = await mount();
        select(textarea, 0, 5);
        await click(button("Link"));
        expect(textarea.value).toBe("[hello](https://) world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    test("the heading level is an option", async () => {
        const { textarea, button } = await mount({ headingLevel: 3 });
        select(textarea, 0, 0);
        await click(button("Heading"));
        expect(textarea.value).toBe("### hello world");
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

    test("moves focus back to the textarea after a tool runs", async () => {
        const { textarea, button } = await mount();
        select(textarea, 0, 5);
        await click(button("Italic"));
        expect(document.activeElement).toBe(textarea);
    });
});

describe("shortcuts", () => {
    test("Ctrl+B bolds", async () => {
        const { textarea } = await mount();
        select(textarea, 0, 5);
        await press(textarea, "b", { ctrlKey: true });
        expect(textarea.value).toBe("**hello** world");
    });

    test("Cmd+I italicises", async () => {
        const { textarea } = await mount();
        select(textarea, 0, 5);
        await press(textarea, "i", { metaKey: true });
        expect(textarea.value).toBe("*hello* world");
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
