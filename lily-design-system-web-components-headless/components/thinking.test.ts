import { afterEach, describe, expect, test } from "vitest";

import { Thinking } from "./thinking.js";

if (!customElements.get("lily-thinking")) {
    customElements.define("lily-thinking", Thinking);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASE = '<lily-thinking label="Thinking"><p>Step one</p></lily-thinking>';

describe("Thinking", () => {
    test("root is native <details> with the thinking class", () => {
        const details = render(BASE).querySelector("details")!;
        expect(details.className).toBe("thinking");
    });

    test("summary carries label and class", () => {
        const summary = render(BASE).querySelector("details > summary")!;
        expect(summary.textContent).toBe("Thinking");
        expect(summary.className).toBe("thinking-summary");
    });

    test("closed by default", () => {
        expect(render(BASE).querySelector("details")!.open).toBe(false);
    });

    test("open attribute opens it, and toggling the attribute follows", () => {
        const host = render('<lily-thinking label="T" open>x</lily-thinking>');
        const details = host.querySelector("details")!;
        expect(details.open).toBe(true);
        host.removeAttribute("open");
        expect(details.open).toBe(false);
    });

    test("children render inside .thinking-content", () => {
        const content = render(BASE).querySelector("details > .thinking-content")!;
        expect(content.querySelector("p")!.textContent).toBe("Step one");
    });

    test("user toggle syncs the open attribute and fires lily-change", async () => {
        const host = render(BASE);
        let detail: unknown = null;
        host.addEventListener("lily-change", (e) => (detail = (e as CustomEvent).detail));
        host.querySelector("details")!.open = true;
        await new Promise((r) => setTimeout(r, 0));
        expect(host.hasAttribute("open")).toBe(true);
        expect(detail).toEqual({ open: true });
    });

    test("streaming sets data-streaming and aria-busy", () => {
        const details = render('<lily-thinking label="T" streaming>x</lily-thinking>').querySelector("details")!;
        expect(details.getAttribute("data-streaming")).toBe("true");
        expect(details.getAttribute("aria-busy")).toBe("true");
    });

    test("not streaming omits data-streaming and aria-busy", () => {
        const details = render(BASE).querySelector("details")!;
        expect(details.hasAttribute("data-streaming")).toBe(false);
        expect(details.hasAttribute("aria-busy")).toBe(false);
    });

    test("passes through attributes and consumer class", () => {
        const details = render('<lily-thinking label="T" data-testid="x" class="extra">x</lily-thinking>').querySelector("details")!;
        expect(details.getAttribute("data-testid")).toBe("x");
        expect(details.className).toBe("thinking extra");
    });
});
