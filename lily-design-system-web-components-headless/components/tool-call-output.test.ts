import { afterEach, describe, expect, test } from "vitest";

import { ToolCallOutput } from "./tool-call-output.js";

if (!customElements.get("lily-tool-call-output")) {
    customElements.define("lily-tool-call-output", ToolCallOutput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToolCallOutput", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-tool-call-output>Hello</lily-tool-call-output>").querySelector("div.tool-call-output")).toBeTruthy();
    });

    test("with a label it is a named group (live); without one it has neither role nor aria-label", () => {
        const host = render('<lily-tool-call-output label="Input">x</lily-tool-call-output>');
        const el = host.querySelector("div")!;
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Input");
        host.removeAttribute("label");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-tool-call-output class="mine">x</lily-tool-call-output>').querySelector("div")!.getAttribute("class")).toBe("tool-call-output mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-tool-call-output><b data-testid="txt">Hello</b></lily-tool-call-output>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-tool-call-output id="x1">x</lily-tool-call-output>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-tool-call-output>x</lily-tool-call-output>");
        (host as unknown as ToolCallOutput).connectedCallback();
        expect(host.querySelectorAll("div.tool-call-output").length).toBe(1);
    });
});
