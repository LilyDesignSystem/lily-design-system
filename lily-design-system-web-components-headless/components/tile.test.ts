import { afterEach, describe, expect, test } from "vitest";

import { Tile } from "./tile.js";

if (!customElements.get("lily-tile")) {
    customElements.define("lily-tile", Tile);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Tile", () => {
    test("carries the base class", () => {
        const host = render("<lily-tile>Content</lily-tile>");

        expect(host.classList.contains("tile")).toBe(true);
    });

    test("applies an explicit label as aria-label", () => {
        const host = render('<lily-tile label="Patient summary"></lily-tile>');

        expect(host.getAttribute("aria-label")).toBe("Patient summary");
    });

    test("omits aria-label when no label is given", () => {
        const host = render("<lily-tile>Content</lily-tile>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("preserves the consumer's children", () => {
        const host = render("<lily-tile><h3>Title</h3><p>Body</p></lily-tile>");

        expect(host.querySelector("h3")?.textContent).toBe("Title");
        expect(host.querySelector("p")?.textContent).toBe("Body");
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-tile class="my-tile">Content</lily-tile>');

        expect(host.classList.contains("tile")).toBe(true);
        expect(host.classList.contains("my-tile")).toBe(true);
    });
});
