import { afterEach, describe, expect, test } from "vitest";

import { ConvertFromUnitDiv } from "./convert-from-unit-div.js";

if (!customElements.get("lily-convert-from-unit-div")) {
    customElements.define("lily-convert-from-unit-div", ConvertFromUnitDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertFromUnitDiv", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-convert-from-unit-div>Hello</lily-convert-from-unit-div>").querySelector("div.convert-from-unit-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-from-unit-div class="mine">x</lily-convert-from-unit-div>').querySelector("div")!.getAttribute("class")).toBe("convert-from-unit-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-from-unit-div><b data-testid="txt">Hello</b></lily-convert-from-unit-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-from-unit-div id="x1">x</lily-convert-from-unit-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-convert-from-unit-div>x</lily-convert-from-unit-div>");
        (host as unknown as ConvertFromUnitDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-from-unit-div").length).toBe(1);
    });

    test("has no role and no aria-label", () => {
        const el = render("<lily-convert-from-unit-div>x</lily-convert-from-unit-div>").querySelector("div")!;
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
