import { afterEach, describe, expect, test } from "vitest";

import { ConvertFromDiv } from "./convert-from-div.js";

if (!customElements.get("lily-convert-from-div")) {
    customElements.define("lily-convert-from-div", ConvertFromDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertFromDiv", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-convert-from-div>Hello</lily-convert-from-div>").querySelector("div.convert-from-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-from-div class="mine">x</lily-convert-from-div>').querySelector("div")!.getAttribute("class")).toBe("convert-from-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-from-div><b data-testid="txt">Hello</b></lily-convert-from-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-from-div id="x1">x</lily-convert-from-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-convert-from-div>x</lily-convert-from-div>");
        (host as unknown as ConvertFromDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-from-div").length).toBe(1);
    });

    test("has no role and no aria-label", () => {
        const el = render("<lily-convert-from-div>x</lily-convert-from-div>").querySelector("div")!;
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
