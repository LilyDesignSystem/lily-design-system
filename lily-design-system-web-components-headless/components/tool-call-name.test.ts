import { afterEach, describe, expect, test } from "vitest";

import { ToolCallName } from "./tool-call-name.js";

if (!customElements.get("lily-tool-call-name")) {
    customElements.define("lily-tool-call-name", ToolCallName);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToolCallName", () => {
    test("renders a span with the base class", () => {
        expect(render("<lily-tool-call-name>Hello</lily-tool-call-name>").querySelector("span.tool-call-name")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-tool-call-name class="mine">x</lily-tool-call-name>').querySelector("span")!.getAttribute("class")).toBe("tool-call-name mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-tool-call-name><b data-testid="txt">Hello</b></lily-tool-call-name>');
        expect(host.querySelector("span [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-tool-call-name id="x1">x</lily-tool-call-name>').querySelector("span")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-tool-call-name>x</lily-tool-call-name>");
        (host as unknown as ToolCallName).connectedCallback();
        expect(host.querySelectorAll("span.tool-call-name").length).toBe(1);
    });
});
