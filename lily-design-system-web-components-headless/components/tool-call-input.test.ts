import { afterEach, describe, expect, test } from "vitest";

import { ToolCallInput } from "./tool-call-input.js";

if (!customElements.get("lily-tool-call-input")) {
    customElements.define("lily-tool-call-input", ToolCallInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ToolCallInput", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-tool-call-input>Hello</lily-tool-call-input>").querySelector("div.tool-call-input")).toBeTruthy();
    });

    test("with a label it is a named group (live); without one it has neither role nor aria-label", () => {
        const host = render('<lily-tool-call-input label="Input">x</lily-tool-call-input>');
        const el = host.querySelector("div")!;
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Input");
        host.removeAttribute("label");
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-tool-call-input class="mine">x</lily-tool-call-input>').querySelector("div")!.getAttribute("class")).toBe("tool-call-input mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-tool-call-input><b data-testid="txt">Hello</b></lily-tool-call-input>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-tool-call-input id="x1">x</lily-tool-call-input>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-tool-call-input>x</lily-tool-call-input>");
        (host as unknown as ToolCallInput).connectedCallback();
        expect(host.querySelectorAll("div.tool-call-input").length).toBe(1);
    });
});
