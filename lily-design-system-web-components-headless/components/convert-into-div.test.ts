import { afterEach, describe, expect, test } from "vitest";

import { ConvertIntoDiv } from "./convert-into-div.js";

if (!customElements.get("lily-convert-into-div")) {
    customElements.define("lily-convert-into-div", ConvertIntoDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertIntoDiv", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-convert-into-div>Hello</lily-convert-into-div>").querySelector("div.convert-into-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-into-div class="mine">x</lily-convert-into-div>').querySelector("div")!.getAttribute("class")).toBe("convert-into-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-into-div><b data-testid="txt">Hello</b></lily-convert-into-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-into-div id="x1">x</lily-convert-into-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-convert-into-div>x</lily-convert-into-div>");
        (host as unknown as ConvertIntoDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-into-div").length).toBe(1);
    });

    test("has no role and no aria-label", () => {
        const el = render("<lily-convert-into-div>x</lily-convert-into-div>").querySelector("div")!;
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
