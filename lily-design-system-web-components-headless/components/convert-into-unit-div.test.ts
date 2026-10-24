import { afterEach, describe, expect, test } from "vitest";

import { ConvertIntoUnitDiv } from "./convert-into-unit-div.js";

if (!customElements.get("lily-convert-into-unit-div")) {
    customElements.define("lily-convert-into-unit-div", ConvertIntoUnitDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertIntoUnitDiv", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-convert-into-unit-div>Hello</lily-convert-into-unit-div>").querySelector("div.convert-into-unit-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-into-unit-div class="mine">x</lily-convert-into-unit-div>').querySelector("div")!.getAttribute("class")).toBe("convert-into-unit-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-into-unit-div><b data-testid="txt">Hello</b></lily-convert-into-unit-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-into-unit-div id="x1">x</lily-convert-into-unit-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-convert-into-unit-div>x</lily-convert-into-unit-div>");
        (host as unknown as ConvertIntoUnitDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-into-unit-div").length).toBe(1);
    });

    test("has no role and no aria-label", () => {
        const el = render("<lily-convert-into-unit-div>x</lily-convert-into-unit-div>").querySelector("div")!;
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
