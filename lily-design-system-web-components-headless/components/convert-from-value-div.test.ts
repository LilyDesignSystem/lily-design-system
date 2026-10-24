import { afterEach, describe, expect, test } from "vitest";

import { ConvertFromValueDiv } from "./convert-from-value-div.js";

if (!customElements.get("lily-convert-from-value-div")) {
    customElements.define("lily-convert-from-value-div", ConvertFromValueDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertFromValueDiv", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-convert-from-value-div>Hello</lily-convert-from-value-div>").querySelector("div.convert-from-value-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-from-value-div class="mine">x</lily-convert-from-value-div>').querySelector("div")!.getAttribute("class")).toBe("convert-from-value-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-from-value-div><b data-testid="txt">Hello</b></lily-convert-from-value-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-from-value-div id="x1">x</lily-convert-from-value-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-convert-from-value-div>x</lily-convert-from-value-div>");
        (host as unknown as ConvertFromValueDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-from-value-div").length).toBe(1);
    });

    test("has no role and no aria-label", () => {
        const el = render("<lily-convert-from-value-div>x</lily-convert-from-value-div>").querySelector("div")!;
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
