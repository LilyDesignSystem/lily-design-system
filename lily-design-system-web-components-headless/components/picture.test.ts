import { afterEach, describe, expect, test } from "vitest";

import { Picture } from "./picture.js";

if (!customElements.get("lily-picture")) {
    customElements.define("lily-picture", Picture);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const PARTS =
    '<source srcset="wide.webp" media="(min-width: 800px)" type="image/webp"><img src="small.jpg" alt="A lily" width="320" height="200">';

describe("Picture", () => {
    test("renders a picture with the base class", () => {
        expect(
            render(`<lily-picture>${PARTS}</lily-picture>`).querySelector("picture.picture"),
        ).toBeTruthy();
    });

    test("appends the consumer class after the base class", () => {
        expect(
            render(`<lily-picture class="mine">${PARTS}</lily-picture>`)
                .querySelector("picture")!
                .getAttribute("class"),
        ).toBe("picture mine");
    });

    test("moves the source and img into the picture, keeping the consumer's alt", () => {
        const host = render(`<lily-picture>${PARTS}</lily-picture>`);
        expect(host.querySelector("picture > source")!.getAttribute("media")).toBe(
            "(min-width: 800px)",
        );
        expect(host.querySelector("picture > img")!.getAttribute("alt")).toBe("A lily");
    });

    test("spreads other attributes", () => {
        expect(
            render(`<lily-picture id="x1">${PARTS}</lily-picture>`).querySelector("picture")!.id,
        ).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render(`<lily-picture>${PARTS}</lily-picture>`);
        (host as unknown as Picture).connectedCallback();
        expect(host.querySelectorAll("picture.picture").length).toBe(1);
    });
});
