import { render, screen, fireEvent } from "@testing-library/vue";
import { describe, expect, test } from "vitest";

import Subject from "./ChatComposer.vue";

const LABELS = { label: "Message", sendLabel: "Send", stopLabel: "Stop" };
const setup = (props: Record<string, unknown> = {}, extra: Record<string, unknown> = {}) => {
    const r = render(Subject, { props: { ...LABELS, ...props }, ...extra });
    const ta = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    return { ...r, ta };
};
const type = (ta: HTMLTextAreaElement, text: string) => fireEvent.update(ta, text);
const key = (el: HTMLElement, init: KeyboardEventInit) => {
    const e = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(e);
    return e;
};

describe("ChatComposer", () => {
    test("renders a <form> with the base class, a named textarea and one button", () => {
        const { container, ta } = setup();
        expect(container.querySelector("form.chat-composer")).toBeTruthy();
        expect(ta.classList.contains("chat-composer-input")).toBe(true);
        expect(container.querySelectorAll("button").length).toBe(1);
    });

    test("the button is the send button: type=submit, data-state=send, named by sendLabel", () => {
        const { container } = setup();
        const b = container.querySelector("button")!;
        expect(b.getAttribute("type")).toBe("submit");
        expect(b.getAttribute("data-state")).toBe("send");
        expect(screen.getByRole("button", { name: "Send" })).toBe(b);
    });

    test("the send button is disabled, not hidden, while the text is empty or whitespace", async () => {
        const { ta, container } = setup();
        const b = container.querySelector("button")!;
        expect(b.disabled).toBe(true);
        await type(ta, "   ");
        expect(b.disabled).toBe(true);
        await type(ta, "hi");
        expect(b.disabled).toBe(false);
    });

    test("Enter emits send with the value and prevents the line break", async () => {
        const { ta, emitted } = setup({ modelValue: "hello" });
        const e = key(ta, { key: "Enter" });
        expect(emitted().send).toEqual([["hello"]]);
        expect(e.defaultPrevented).toBe(true);
    });

    test("Shift+Enter does not send (it inserts a line break)", async () => {
        const { ta, emitted } = setup({ modelValue: "hello" });
        const e = key(ta, { key: "Enter", shiftKey: true });
        expect(emitted().send).toBeUndefined();
        expect(e.defaultPrevented).toBe(false);
    });

    test("Enter during IME composition does not send", async () => {
        const { ta, emitted } = setup({ modelValue: "こん" });
        await fireEvent.keyDown(ta, { key: "Enter", isComposing: true });
        expect(emitted().send).toBeUndefined();
    });

    test("Enter on empty text or when disabled does not send", async () => {
        const a = setup();
        await fireEvent.keyDown(a.ta, { key: "Enter" });
        expect(a.emitted().send).toBeUndefined();
        a.unmount();
        const b = setup({ modelValue: "hi", disabled: true });
        await fireEvent.keyDown(b.ta, { key: "Enter" });
        expect(b.emitted().send).toBeUndefined();
    });

    test("submitting the form (the send button) sends", async () => {
        const { container, emitted } = setup({ modelValue: "hello" });
        await fireEvent.submit(container.querySelector("form")!);
        expect(emitted().send).toEqual([["hello"]]);
    });

    test("while busy the same button becomes stop: type=button, data-state=stop, named by stopLabel", () => {
        const { container } = setup({ busy: true, modelValue: "x" });
        const b = container.querySelector("button")!;
        expect(b.getAttribute("type")).toBe("button");
        expect(b.getAttribute("data-state")).toBe("stop");
        expect(screen.getByRole("button", { name: "Stop" })).toBe(b);
        expect(b.disabled).toBe(false);
    });

    test("pressing stop emits stop and never send; Enter while busy does not send", async () => {
        const { container, ta, emitted } = setup({ busy: true, modelValue: "x" });
        await fireEvent.click(container.querySelector("button")!);
        expect(emitted().stop).toHaveLength(1);
        await fireEvent.keyDown(ta, { key: "Enter" });
        expect(emitted().send).toBeUndefined();
    });

    test("rows follow the number of lines, clamped to minRows and maxRows", async () => {
        const { ta } = setup({ minRows: 2, maxRows: 4 });
        expect(ta.rows).toBe(2);
        await type(ta, "a\nb\nc");
        expect(ta.rows).toBe(3);
        await type(ta, "a\nb\nc\nd\ne\nf");
        expect(ta.rows).toBe(4);
    });

    test("disabled disables the textarea and the button", () => {
        const { ta, container } = setup({ disabled: true, modelValue: "x" });
        expect(ta.disabled).toBe(true);
        expect(container.querySelector("button")!.disabled).toBe(true);
    });

    test("passes placeholder and name to the textarea", () => {
        const { ta } = setup({ placeholder: "Ask", name: "msg" });
        expect(ta.placeholder).toBe("Ask");
        expect(ta.name).toBe("msg");
    });

    test("typing updates the v-model", async () => {
        const { ta, emitted } = setup();
        await type(ta, "hello");
        expect(emitted()["update:modelValue"]).toEqual([["hello"]]);
    });

    test("merges attrs (class, id) onto the form", () => {
        const { container } = setup({}, { attrs: { class: "mine", id: "cc1" } });
        const f = container.querySelector("form")!;
        expect(f.id).toBe("cc1");
        expect(f.getAttribute("class")).toBe("chat-composer mine");
    });

    test("renders the default slot before the textarea", () => {
        const { container } = setup({}, { slots: { default: '<span data-testid="extra">E</span>' } });
        expect(container.querySelector("form")!.firstElementChild!.getAttribute("data-testid")).toBe("extra");
    });
});
