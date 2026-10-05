import { afterEach, describe, expect, test } from "vitest";

import { ToolCallStatus } from "./tool-call-status.js";

if (!customElements.get("lily-tool-call-status")) {
    customElements.define("lily-tool-call-status", ToolCallStatus);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToolCallStatus", () => {
    test("renders a span with the base class", () => {
        expect(render("<lily-tool-call-status>Hello</lily-tool-call-status>").querySelector("span.tool-call-status")).toBeTruthy();
    });

    test("sets data-status from status (live), and omits it without one", () => {
        const host = render('<lily-tool-call-status status="running">x</lily-tool-call-status>');
        const el = host.querySelector("span")!;
        expect(el.getAttribute("data-status")).toBe("running");
        host.setAttribute("status", "done");
        expect(el.getAttribute("data-status")).toBe("done");
        host.removeAttribute("status");
        expect(el.hasAttribute("data-status")).toBe(false);
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-tool-call-status class="mine">x</lily-tool-call-status>').querySelector("span")!.getAttribute("class")).toBe("tool-call-status mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-tool-call-status><b data-testid="txt">Hello</b></lily-tool-call-status>');
        expect(host.querySelector("span [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-tool-call-status id="x1">x</lily-tool-call-status>').querySelector("span")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-tool-call-status>x</lily-tool-call-status>");
        (host as unknown as ToolCallStatus).connectedCallback();
        expect(host.querySelectorAll("span.tool-call-status").length).toBe(1);
    });
});
