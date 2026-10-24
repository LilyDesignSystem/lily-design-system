import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MarkdownEditor, { nextMarkdownEditorId, type Props } from "./MarkdownEditor";

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

function setup(props: Partial<Props> = {}) {
    const utils = render(
        <MarkdownEditor label="Message" toolbarLabel="Formatting" labels={labels} defaultValue="hello world" {...props} />,
    );
    const textarea = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    return { ...utils, textarea };
}

function select(textarea: HTMLTextAreaElement, start: number, end: number) {
    textarea.focus();
    textarea.setSelectionRange(start, end);
}

describe("structure", () => {
    it("renders a toolbar and a textarea under the base classes", () => {
        const { container, textarea } = setup();
        expect(container.querySelector("div.markdown-editor")).toBeTruthy();
        expect(screen.getByRole("toolbar", { name: "Formatting" }).className).toContain("markdown-editor-toolbar");
        expect(textarea.className).toContain("markdown-editor-textarea");
        expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("renders one named button per labelled tool, in order", () => {
        setup();
        const names = screen.getAllByRole("button").map((b) => b.getAttribute("aria-label"));
        expect(names).toEqual(Object.values(labels));
    });

    it("omits a tool that has no label", () => {
        setup({ labels: { bold: "Bold" } });
        expect(screen.getAllByRole("button").length).toBe(1);
    });

    it("honours the tools prop for subset and order", () => {
        setup({ tools: ["link", "bold"] });
        expect(screen.getAllByRole("button").map((b) => b.getAttribute("data-tool"))).toEqual(["link", "bold"]);
    });

    it("every button is type=button so it never submits a form", () => {
        setup();
        for (const b of screen.getAllByRole("button")) expect(b.getAttribute("type")).toBe("button");
    });

    it("icons are decorative", () => {
        const { container } = setup();
        for (const svg of container.querySelectorAll("svg")) expect(svg.getAttribute("aria-hidden")).toBe("true");
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
        const root = container.querySelector(".markdown-editor")!;
        expect(root.getAttribute("class")).toBe("markdown-editor mine");
        expect(root.getAttribute("data-x")).toBe("1");
    });

    it("ships no English of its own: no tool labels, no placeholder text", () => {
        const { container } = setup({ labels: {} });
        expect(container.querySelectorAll("button").length).toBe(0);
        expect(container.querySelector("textarea")!.getAttribute("placeholder")).toBeNull();
    });

    it("ids are unique per editor", () => {
        expect(nextMarkdownEditorId()).not.toBe(nextMarkdownEditorId());
    });
});

describe("tools", () => {
    it("bold wraps the selection, updates the textarea and calls onChange", async () => {
        const onChange = vi.fn();
        const { textarea } = setup({ onChange });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(textarea.value).toBe("**hello** world");
        expect(onChange).toHaveBeenLastCalledWith("**hello** world");
    });

    it("keeps the selection on the formatted text, ready for the next tool", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("hello");
    });

    it("pressing the same tool again takes the formatting off", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(textarea.value).toBe("hello world");
    });

    it("list tools prefix the selected lines", async () => {
        const { textarea } = setup({ defaultValue: "a\nb" });
        select(textarea, 0, 3);
        await userEvent.click(screen.getByRole("button", { name: "Numbered list" }));
        expect(textarea.value).toBe("1. a\n2. b");
    });

    it("link selects the address placeholder", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Link" }));
        expect(textarea.value).toBe("[hello](https://) world");
        expect(textarea.value.slice(textarea.selectionStart, textarea.selectionEnd)).toBe("https://");
    });

    it("the heading level is a prop", async () => {
        const { textarea } = setup({ headingLevel: 3 });
        select(textarea, 0, 0);
        await userEvent.click(screen.getByRole("button", { name: "Heading" }));
        expect(textarea.value).toBe("### hello world");
    });

    it("typing updates the value and calls onChange", async () => {
        const onChange = vi.fn();
        const { textarea } = setup({ defaultValue: "", onChange });
        await userEvent.type(textarea, "ab");
        expect(onChange).toHaveBeenLastCalledWith("ab");
    });

    it("moves focus back to the textarea after a tool runs", async () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Italic" }));
        expect(document.activeElement).toBe(textarea);
    });

    it("a controlled value is what the textarea shows, and a tool reports the new one", async () => {
        const onChange = vi.fn();
        const { textarea } = setup({ value: "hello world", defaultValue: undefined, onChange });
        select(textarea, 0, 5);
        await userEvent.click(screen.getByRole("button", { name: "Bold" }));
        expect(onChange).toHaveBeenLastCalledWith("**hello** world");
    });
});

describe("shortcuts", () => {
    it("Ctrl+B bolds", () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        fireEvent.keyDown(textarea, { key: "b", ctrlKey: true });
        expect(textarea.value).toBe("**hello** world");
    });

    it("Cmd+I italicises", () => {
        const { textarea } = setup();
        select(textarea, 0, 5);
        fireEvent.keyDown(textarea, { key: "i", metaKey: true });
        expect(textarea.value).toBe("*hello* world");
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
    it("draws a default path per tool", () => {
        const { container } = setup();
        expect(container.querySelectorAll("svg path").length).toBe(9);
    });

    it("the icon prop replaces them", () => {
        const { container } = setup({ icon: (t) => <span data-icon={t}>x</span> });
        expect(container.querySelectorAll("svg").length).toBe(0);
        expect(container.querySelectorAll("[data-icon]").length).toBe(9);
    });
});
