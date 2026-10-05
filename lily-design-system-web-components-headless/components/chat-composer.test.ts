import { afterEach, describe, expect, test, vi } from "vitest";

import { ChatComposer } from "./chat-composer.js";

if (!customElements.get("lily-chat-composer")) {
    customElements.define("lily-chat-composer", ChatComposer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

const BASE = 'label="Message" send-label="Send" stop-label="Stop"';
function render(attrs = "", inner = ""): HTMLElement {
    document.body.innerHTML = `<lily-chat-composer ${BASE} ${attrs}>${inner}</lily-chat-composer>`;
    return document.body.firstElementChild as HTMLElement;
}
const ta = (h: HTMLElement) => h.querySelector("textarea") as HTMLTextAreaElement;
const btn = (h: HTMLElement) => h.querySelector("button") as HTMLButtonElement;
const type = (h: HTMLElement, text: string) => {
    ta(h).value = text;
    ta(h).dispatchEvent(new Event("input"));
};
const key = (el: HTMLElement, init: KeyboardEventInit) => {
    const e = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, ...init });
    el.dispatchEvent(e);
    return e;
};

describe("ChatComposer", () => {
    test("renders a form with the base class, a named textarea and one button", () => {
        const h = render();
        expect(h.querySelector("form.chat-composer")).toBeTruthy();
        expect(ta(h).getAttribute("aria-label")).toBe("Message");
        expect(ta(h).classList.contains("chat-composer-input")).toBe(true);
        expect(h.querySelectorAll("button").length).toBe(1);
    });

    test("the button is the send button: type=submit, data-state=send, labelled by send-label", () => {
        const b = btn(render());
        expect(b.type).toBe("submit");
        expect(b.getAttribute("data-state")).toBe("send");
        expect(b.textContent).toBe("Send");
    });

    test("the send button is disabled, not hidden, while empty or whitespace", () => {
        const h = render();
        expect(btn(h).disabled).toBe(true);
        type(h, "   ");
        expect(btn(h).disabled).toBe(true);
        type(h, "hi");
        expect(btn(h).disabled).toBe(false);
    });

    test("Enter fires lily-send with the value and prevents the line break", () => {
        const h = render('value="hello"');
        const send = vi.fn();
        h.addEventListener("lily-send", (e) => send((e as CustomEvent).detail));
        const e = key(ta(h), { key: "Enter" });
        expect(send).toHaveBeenCalledWith({ value: "hello" });
        expect(e.defaultPrevented).toBe(true);
    });

    test("Shift+Enter does not send (it inserts a line break)", () => {
        const h = render('value="hello"');
        const send = vi.fn();
        h.addEventListener("lily-send", send);
        const e = key(ta(h), { key: "Enter", shiftKey: true });
        expect(send).not.toHaveBeenCalled();
        expect(e.defaultPrevented).toBe(false);
    });

    test("Enter during IME composition does not send", () => {
        const h = render('value="こん"');
        const send = vi.fn();
        h.addEventListener("lily-send", send);
        key(ta(h), { key: "Enter", isComposing: true });
        expect(send).not.toHaveBeenCalled();
    });

    test("Enter on empty text or when disabled does not send", () => {
        const send = vi.fn();
        const a = render();
        a.addEventListener("lily-send", send);
        key(ta(a), { key: "Enter" });
        const b = render('value="hi" disabled');
        b.addEventListener("lily-send", send);
        key(ta(b), { key: "Enter" });
        expect(send).not.toHaveBeenCalled();
    });

    test("submitting the form (the send button) sends", () => {
        const h = render('value="hello"');
        const send = vi.fn();
        h.addEventListener("lily-send", (e) => send((e as CustomEvent).detail));
        h.querySelector("form")!.dispatchEvent(new Event("submit", { cancelable: true }));
        expect(send).toHaveBeenCalledWith({ value: "hello" });
    });

    test("while busy the same button becomes stop (live): type=button, data-state=stop, stop-label", () => {
        const h = render('value="x"');
        h.setAttribute("busy", "");
        expect(btn(h).type).toBe("button");
        expect(btn(h).getAttribute("data-state")).toBe("stop");
        expect(btn(h).textContent).toBe("Stop");
        expect(btn(h).disabled).toBe(false);
        h.removeAttribute("busy");
        expect(btn(h).getAttribute("data-state")).toBe("send");
    });

    test("pressing stop fires lily-stop and never lily-send; Enter while busy does not send", () => {
        const h = render('value="x" busy');
        const send = vi.fn();
        const stop = vi.fn();
        h.addEventListener("lily-send", send);
        h.addEventListener("lily-stop", stop);
        btn(h).click();
        key(ta(h), { key: "Enter" });
        expect(stop).toHaveBeenCalledTimes(1);
        expect(send).not.toHaveBeenCalled();
    });

    test("rows follow the number of lines, clamped to min-rows and max-rows", () => {
        const h = render('min-rows="2" max-rows="4"');
        expect(ta(h).rows).toBe(2);
        type(h, "a\nb\nc");
        expect(ta(h).rows).toBe(3);
        type(h, "a\nb\nc\nd\ne\nf");
        expect(ta(h).rows).toBe(4);
    });

    test("disabled disables the textarea and the button", () => {
        const h = render('value="x" disabled');
        expect(ta(h).disabled).toBe(true);
        expect(btn(h).disabled).toBe(true);
    });

    test("passes placeholder and name, and the value property reads and writes the text", () => {
        const h = render('placeholder="Ask" name="msg"') as unknown as ChatComposer;
        expect(ta(h as unknown as HTMLElement).placeholder).toBe("Ask");
        expect(ta(h as unknown as HTMLElement).name).toBe("msg");
        h.value = "hello";
        expect(ta(h as unknown as HTMLElement).value).toBe("hello");
        expect(h.value).toBe("hello");
    });

    test("appends the consumer class and spreads other attributes onto the form", () => {
        const h = render('class="mine" id="cc1"');
        const f = h.querySelector("form")!;
        expect(f.getAttribute("class")).toBe("chat-composer mine");
        expect(f.id).toBe("cc1");
    });

    test("moves the children into the form before the textarea", () => {
        const h = render("", '<span data-testid="extra">E</span>');
        expect(h.querySelector("form")!.firstElementChild!.getAttribute("data-testid")).toBe("extra");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const h = render();
        (h as unknown as ChatComposer).connectedCallback();
        expect(h.querySelectorAll("form.chat-composer").length).toBe(1);
    });
});
