import { afterEach, describe, expect, test } from "vitest";

import { Figure } from "./figure.js";

if (!customElements.get("lily-figure")) {
    customElements.define("lily-figure", Figure);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Figure", () => {
    test("renders a native figure with role=img", () => {
        const host = render('<lily-figure label="Sales chart"></lily-figure>');

        expect(host.querySelector("figure")!.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-figure label="Sales chart"></lily-figure>');

        expect(host.querySelector("figure")!.getAttribute("aria-label")).toBe("Sales chart");
    });

    test("moves consumer-supplied visualization content inside", () => {
        const host = render('<lily-figure label="Sales chart"><svg><circle></circle></svg></lily-figure>');

        expect(host.querySelector("figure svg")).toBeTruthy();
    });
});
