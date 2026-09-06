import { afterEach, describe, expect, test } from "vitest";

import { Grid } from "./grid.js";

if (!customElements.get("lily-grid")) {
    customElements.define("lily-grid", Grid);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Grid", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-grid></lily-grid>");

        expect(host.tagName.toLowerCase()).toBe("lily-grid");
        expect(host.className).toBe("grid");
    });

    test("defaults data-columns to 12 and data-gap to 1rem", () => {
        const host = render("<lily-grid></lily-grid>");

        expect(host.getAttribute("data-columns")).toBe("12");
        expect(host.getAttribute("data-gap")).toBe("1rem");
    });

    test("reflects a numeric columns attribute verbatim", () => {
        const host = render('<lily-grid columns="3" gap="1.5rem"></lily-grid>');

        expect(host.getAttribute("data-columns")).toBe("3");
        expect(host.getAttribute("data-gap")).toBe("1.5rem");
    });

    test("reflects a custom track-string columns attribute verbatim", () => {
        const host = render('<lily-grid columns="200px 1fr 200px"></lily-grid>');

        expect(host.getAttribute("data-columns")).toBe("200px 1fr 200px");
    });

    test("preserves children in place", () => {
        const host = render("<lily-grid><div>One</div><div>Two</div></lily-grid>");

        expect(host.children.length).toBe(2);
    });

    test("does not apply an inline style (deviation from other frameworks)", () => {
        const host = render('<lily-grid columns="3"></lily-grid>');

        expect(host.getAttribute("style")).toBeNull();
    });
});
