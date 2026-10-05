import { afterEach, describe, expect, test } from "vitest";

import { StreamingText } from "./streaming-text.js";

if (!customElements.get("lily-streaming-text")) {
    customElements.define("lily-streaming-text", StreamingText);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("StreamingText", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-streaming-text>Hello</lily-streaming-text>").querySelector("div.streaming-text")).toBeTruthy();
    });

    test("is a polite, atomic status region", () => {
        const el = render("<lily-streaming-text>Hello</lily-streaming-text>").querySelector("div")!;
        expect(el.getAttribute("role")).toBe("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
        expect(el.getAttribute("aria-atomic")).toBe("true");
    });

    test("is not busy by default", () => {
        const el = render("<lily-streaming-text>Hello</lily-streaming-text>").querySelector("div")!;
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    test("is busy while the streaming attribute is present", () => {
        const el = render("<lily-streaming-text streaming>Hel</lily-streaming-text>").querySelector("div")!;
        expect(el.getAttribute("aria-busy")).toBe("true");
        expect(el.getAttribute("data-streaming")).toBe("true");
    });

    test("clears busy when the streaming attribute is removed, and restores it when added", () => {
        const host = render("<lily-streaming-text streaming>Hel</lily-streaming-text>");
        host.removeAttribute("streaming");
        expect(host.querySelector("div")!.hasAttribute("aria-busy")).toBe(false);
        host.setAttribute("streaming", "");
        expect(host.querySelector("div")!.getAttribute("aria-busy")).toBe("true");
    });

    test("sets aria-label from label, updates live, and omits it without one", () => {
        const host = render('<lily-streaming-text label="Answer">x</lily-streaming-text>');
        expect(host.querySelector("div")!.getAttribute("aria-label")).toBe("Answer");
        host.setAttribute("label", "Reply");
        expect(host.querySelector("div")!.getAttribute("aria-label")).toBe("Reply");
        host.removeAttribute("label");
        expect(host.querySelector("div")!.hasAttribute("aria-label")).toBe(false);
    });

    test("appends the consumer class after the base class", () => {
        const host = render('<lily-streaming-text class="mine">x</lily-streaming-text>');
        expect(host.querySelector("div")!.getAttribute("class")).toBe("streaming-text mine");
    });

    test("moves the children into the region", () => {
        const host = render('<lily-streaming-text><span data-testid="txt">Hello</span></lily-streaming-text>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes onto the region", () => {
        const host = render('<lily-streaming-text id="s1" data-testid="root">x</lily-streaming-text>');
        const el = host.querySelector("div")!;
        expect(el.id).toBe("s1");
        expect(el.getAttribute("data-testid")).toBe("root");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-streaming-text>x</lily-streaming-text>");
        (host as unknown as StreamingText).connectedCallback();
        expect(host.querySelectorAll("div.streaming-text").length).toBe(1);
    });
});
