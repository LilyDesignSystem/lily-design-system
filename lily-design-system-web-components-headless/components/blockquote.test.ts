import { afterEach, describe, expect, test } from "vitest";

import { Blockquote } from "./blockquote.js";

if (!customElements.get("lily-blockquote")) {
    customElements.define("lily-blockquote", Blockquote);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Blockquote", () => {
    test("renders a native blockquote with the given cite", () => {
        const host = render('<lily-blockquote cite="https://example.com/source">Quoted text.</lily-blockquote>');

        const blockquote = host.querySelector("blockquote") as HTMLQuoteElement;
        expect(blockquote.getAttribute("cite")).toBe("https://example.com/source");
        expect(blockquote.textContent).toContain("Quoted text.");
    });

    test("renders no footer when citation-text is absent", () => {
        const host = render("<lily-blockquote>Quoted text.</lily-blockquote>");

        expect(host.querySelector("footer")).toBeNull();
    });

    test("renders a footer with citation-text when given", () => {
        const host = render('<lily-blockquote citation-text="Ada Lovelace">Quoted text.</lily-blockquote>');

        expect(host.querySelector("footer.blockquote-citation")!.textContent).toBe("Ada Lovelace");
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-blockquote label="A famous quote">Quoted text.</lily-blockquote>');

        expect(host.querySelector("blockquote")!.getAttribute("aria-label")).toBe("A famous quote");
    });
});
