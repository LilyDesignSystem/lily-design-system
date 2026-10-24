import { afterEach, describe, expect, test } from "vitest";

import { ConvertDiv } from "./convert-div.js";

if (!customElements.get("lily-convert-div")) {
    customElements.define("lily-convert-div", ConvertDiv);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ConvertDiv", () => {
    test("renders a div with the base class", () => {
        expect(render('<lily-convert-div label="Currency converter">Hello</lily-convert-div>').querySelector("div.convert-div")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-convert-div label="Currency converter" class="mine">x</lily-convert-div>').querySelector("div")!.getAttribute("class")).toBe("convert-div mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-convert-div label="Currency converter"><b data-testid="txt">Hello</b></lily-convert-div>');
        expect(host.querySelector("div [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-convert-div label="Currency converter" id="x1">x</lily-convert-div>').querySelector("div")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render('<lily-convert-div label="Currency converter">x</lily-convert-div>');
        (host as unknown as ConvertDiv).connectedCallback();
        expect(host.querySelectorAll("div.convert-div").length).toBe(1);
    });

    test("is a named group", () => {
        const el = render('<lily-convert-div label="Currency converter">x</lily-convert-div>').querySelector("div")!;
        expect(el.getAttribute("role")).toBe("group");
        expect(el.getAttribute("aria-label")).toBe("Currency converter");
    });
});
