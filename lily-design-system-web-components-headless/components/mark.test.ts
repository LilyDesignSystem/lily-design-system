import { afterEach, describe, expect, test } from "vitest";

import { Mark } from "./mark.js";

if (!customElements.get("lily-mark")) {
    customElements.define("lily-mark", Mark);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Mark", () => {
    test("renders a mark with the base class", () => {
        expect(render("<lily-mark>Hello</lily-mark>").querySelector("mark.mark")).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(render('<lily-mark class="mine">x</lily-mark>').querySelector("mark")!.getAttribute("class")).toBe("mark mine");
    });

    test("moves the children into the element", () => {
        const host = render('<lily-mark><b data-testid="txt">Hello</b></lily-mark>');
        expect(host.querySelector("mark [data-testid=txt]")!.textContent).toBe("Hello");
    });

    test("spreads other attributes", () => {
        expect(render('<lily-mark id="x1">x</lily-mark>').querySelector("mark")!.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render("<lily-mark>x</lily-mark>");
        (host as unknown as Mark).connectedCallback();
        expect(host.querySelectorAll("mark.mark").length).toBe(1);
    });
});
