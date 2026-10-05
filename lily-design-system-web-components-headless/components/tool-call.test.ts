import { afterEach, describe, expect, test } from "vitest";

import { ToolCall } from "./tool-call.js";

if (!customElements.get("lily-tool-call")) {
    customElements.define("lily-tool-call", ToolCall);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const BASIC = '<lily-tool-call><span slot="summary" data-testid="sum">search_web</span><span data-testid="body">Body</span></lily-tool-call>';

describe("ToolCall", () => {
    test("renders a details with the base class, closed by default", () => {
        const el = render(BASIC).querySelector("details.tool-call") as HTMLDetailsElement;
        expect(el).toBeTruthy();
        expect(el.open).toBe(false);
    });

    test("moves slot=summary children into the summary and the rest into the content", () => {
        const host = render(BASIC);
        expect(host.querySelector("summary.tool-call-summary [data-testid=sum]")).toBeTruthy();
        expect(host.querySelector("div.tool-call-content [data-testid=body]")).toBeTruthy();
        expect(host.querySelector("div.tool-call-content [data-testid=sum]")).toBeNull();
    });

    test("reflects the open attribute, live", () => {
        const host = render(BASIC);
        const el = host.querySelector("details") as HTMLDetailsElement;
        host.setAttribute("open", "");
        expect(el.open).toBe(true);
        host.removeAttribute("open");
        expect(el.open).toBe(false);
    });

    test("sets data-status from status (live), and omits it without one", () => {
        const host = render('<lily-tool-call status="done"><span slot="summary">x</span></lily-tool-call>');
        const el = host.querySelector("details")!;
        expect(el.getAttribute("data-status")).toBe("done");
        host.removeAttribute("status");
        expect(el.hasAttribute("data-status")).toBe(false);
    });

    test("is busy only while running", () => {
        const host = render('<lily-tool-call status="running"><span slot="summary">x</span></lily-tool-call>');
        const el = host.querySelector("details")!;
        expect(el.getAttribute("aria-busy")).toBe("true");
        host.setAttribute("status", "done");
        expect(el.hasAttribute("aria-busy")).toBe(false);
    });

    test("a native toggle updates the open attribute and fires lily-change", () => {
        const host = render(BASIC);
        let seen: unknown = null;
        host.addEventListener("lily-change", (e) => (seen = (e as CustomEvent).detail));
        const el = host.querySelector("details") as HTMLDetailsElement;
        el.open = true;
        el.dispatchEvent(new Event("toggle"));
        expect(host.hasAttribute("open")).toBe(true);
        expect(seen).toEqual({ open: true });
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-tool-call class="mine"></lily-tool-call>').querySelector("details")!.getAttribute("class")).toBe("tool-call mine");
    });

    test("spreads other attributes onto the details", () => {
        expect(render('<lily-tool-call id="t1"></lily-tool-call>').querySelector("details")!.id).toBe("t1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render(BASIC);
        (host as unknown as ToolCall).connectedCallback();
        expect(host.querySelectorAll("details.tool-call").length).toBe(1);
    });
});
