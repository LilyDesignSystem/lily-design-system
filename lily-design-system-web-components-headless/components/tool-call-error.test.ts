import { afterEach, describe, expect, test } from "vitest";

import { ToolCallError } from "./tool-call-error.js";

if (!customElements.get("lily-tool-call-error")) {
    customElements.define("lily-tool-call-error", ToolCallError);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToolCallError", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-tool-call-error>Hello</lily-tool-call-error>").querySelector("div.tool-call-error")).toBeTruthy();
    });

    test("is an alert region", () => {
        expect(render("<lily-tool-call-error>x</lily-tool-call-error>").querySelector("div")!.getAttribute("role")).toBe("alert");
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-tool-call-error class="mine">x</lily-tool-call-error>').querySelector("div")!.getAttribute("class")).toBe("tool-call-error mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-tool-call-error><b data-testid="txt">Hello</b></lily-tool-call-error>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-tool-call-error id="x1">x</lily-tool-call-error>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-tool-call-error>x</lily-tool-call-error>");
        (host as unknown as ToolCallError).connectedCallback();
        expect(host.querySelectorAll("div.tool-call-error").length).toBe(1);
    });
});
