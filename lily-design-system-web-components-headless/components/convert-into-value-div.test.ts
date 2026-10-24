import { afterEach, describe, expect, test } from "vitest";

import { ConvertIntoValueDiv } from "./convert-into-value-div.js";

if (!customElements.get("lily-convert-into-value-div")) {
    customElements.define("lily-convert-into-value-div", ConvertIntoValueDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertIntoValueDiv", () => {
    test("renders a div with the base class", () => {
        expect(render("<lily-convert-into-value-div>Hello</lily-convert-into-value-div>").querySelector("div.convert-into-value-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-into-value-div class="mine">x</lily-convert-into-value-div>').querySelector("div")!.getAttribute("class")).toBe("convert-into-value-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-into-value-div><b data-testid="txt">Hello</b></lily-convert-into-value-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-into-value-div id="x1">x</lily-convert-into-value-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-convert-into-value-div>x</lily-convert-into-value-div>");
        (host as unknown as ConvertIntoValueDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-into-value-div").length).toBe(1);
    });

    test("has no role and no aria-label", () => {
        const el = render("<lily-convert-into-value-div>x</lily-convert-into-value-div>").querySelector("div")!;
        expect(el.getAttribute("role")).toBeNull();
        expect(el.getAttribute("aria-label")).toBeNull();
    });
});
