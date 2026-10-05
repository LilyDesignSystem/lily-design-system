import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ChatComposer from "./ChatComposer";

const LABELS = { label: "Message", sendLabel: "Send", stopLabel: "Stop" };
const setup = (props: Record<string, unknown> = {}) => {
    const onSend = vi.fn();
    const onStop = vi.fn();
    const onChange = vi.fn();
    const r = render(<ChatComposer {...LABELS} onSend={onSend} onStop={onStop} onChange={onChange} {...props} />);
    const ta = screen.getByRole("textbox", { name: "Message" }) as HTMLTextAreaElement;
    return { ...r, ta, onSend, onStop, onChange };
};

describe("ChatComposer", () => {
    it("renders a <form> with the base class, a named textarea and one button", () => {
        const { container, ta } = setup();
        expect(container.querySelector("form.chat-composer")).toBeTruthy();
        expect(ta.classList.contains("chat-composer-input")).toBe(true);
        expect(container.querySelectorAll("button").length).toBe(1);
    });

    it("the button is the send button: type=submit, data-state=send, named by sendLabel", () => {
        const { container } = setup();
        const b = container.querySelector("button")!;
        expect(b.getAttribute("type")).toBe("submit");
        expect(b.getAttribute("data-state")).toBe("send");
        expect(screen.getByRole("button", { name: "Send" })).toBe(b);
    });

    it("the send button is disabled, not hidden, while the text is empty or whitespace", () => {
        const a = setup();
        expect(a.container.querySelector("button")!.disabled).toBe(true);
        a.unmount();
        const b = setup({ value: "   " });
        expect(b.container.querySelector("button")!.disabled).toBe(true);
        b.unmount();
        const c = setup({ value: "hi" });
        expect(c.container.querySelector("button")!.disabled).toBe(false);
    });

    it("Enter sends the value and prevents the line break", () => {
        const { ta, onSend } = setup({ value: "hello" });
        const notPrevented = fireEvent.keyDown(ta, { key: "Enter" });
        expect(onSend).toHaveBeenCalledWith("hello");
        expect(notPrevented).toBe(false);
    });

    it("Shift+Enter does not send (it inserts a line break)", () => {
        const { ta, onSend } = setup({ value: "hello" });
        const notPrevented = fireEvent.keyDown(ta, { key: "Enter", shiftKey: true });
        expect(onSend).not.toHaveBeenCalled();
        expect(notPrevented).toBe(true);
    });

    it("Enter during IME composition does not send", () => {
        const { ta, onSend } = setup({ value: "こん" });
        fireEvent.keyDown(ta, { key: "Enter", isComposing: true });
        expect(onSend).not.toHaveBeenCalled();
    });

    it("Enter on empty text or when disabled does not send", () => {
        const a = setup();
        fireEvent.keyDown(a.ta, { key: "Enter" });
        expect(a.onSend).not.toHaveBeenCalled();
        a.unmount();
        const b = setup({ value: "hi", disabled: true });
        fireEvent.keyDown(b.ta, { key: "Enter" });
        expect(b.onSend).not.toHaveBeenCalled();
    });

    it("submitting the form (the send button) sends", () => {
        const { container, onSend } = setup({ value: "hello" });
        fireEvent.submit(container.querySelector("form")!);
        expect(onSend).toHaveBeenCalledWith("hello");
    });

    it("while busy the same button becomes stop: type=button, data-state=stop, named by stopLabel", () => {
        const { container } = setup({ busy: true, value: "x" });
        const b = container.querySelector("button")!;
        expect(b.getAttribute("type")).toBe("button");
        expect(b.getAttribute("data-state")).toBe("stop");
        expect(screen.getByRole("button", { name: "Stop" })).toBe(b);
        expect(b.disabled).toBe(false);
    });

    it("pressing stop calls onStop and never onSend; Enter while busy does not send", () => {
        const { container, ta, onSend, onStop } = setup({ busy: true, value: "x" });
        fireEvent.click(container.querySelector("button")!);
        expect(onStop).toHaveBeenCalledTimes(1);
        fireEvent.keyDown(ta, { key: "Enter" });
        expect(onSend).not.toHaveBeenCalled();
    });

    it("rows follow the number of lines, clamped to minRows and maxRows", () => {
        const a = setup({ minRows: 2, maxRows: 4 });
        expect(a.ta.rows).toBe(2);
        a.unmount();
        const b = setup({ minRows: 2, maxRows: 4, value: "a\nb\nc" });
        expect(b.ta.rows).toBe(3);
        b.unmount();
        expect(setup({ minRows: 2, maxRows: 4, value: "a\nb\nc\nd\ne\nf" }).ta.rows).toBe(4);
    });

    it("disabled disables the textarea and the button", () => {
        const { ta, container } = setup({ disabled: true, value: "x" });
        expect(ta.disabled).toBe(true);
        expect(container.querySelector("button")!.disabled).toBe(true);
    });

    it("passes placeholder and name to the textarea", () => {
        const { ta } = setup({ placeholder: "Ask", name: "msg" });
        expect(ta.placeholder).toBe("Ask");
        expect(ta.name).toBe("msg");
    });

    it("typing calls onChange with the new value", () => {
        const { ta, onChange } = setup();
        fireEvent.change(ta, { target: { value: "hello" } });
        expect(onChange).toHaveBeenCalledWith("hello");
    });

    it("appends the consumer class after the base class and spreads rest props on the form", () => {
        const { container } = setup({ className: "mine", id: "cc1" });
        const f = container.querySelector("form")!;
        expect(f.getAttribute("class")).toBe("chat-composer mine");
        expect(f.id).toBe("cc1");
    });

    it("renders children before the textarea", () => {
        const { container } = setup({ children: <span data-testid="extra">E</span> });
        const f = container.querySelector("form")!;
        expect(f.firstElementChild!.getAttribute("data-testid")).toBe("extra");
    });
});
