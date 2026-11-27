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
        const host = render(
            '<lily-blockquote cite="https://example.com/source">Quoted text.</lily-blockquote>',
        );

        const blockquote = host.querySelector("blockquote") as HTMLQuoteElement;
        expect(blockquote.getAttribute("cite")).toBe("https://example.com/source");
        expect(blockquote.textContent).toContain("Quoted text.");
    });

    test("renders no footer when citation-text is absent", () => {
        const host = render("<lily-blockquote>Quoted text.</lily-blockquote>");

        expect(host.querySelector("footer")).toBeNull();
    });

    test("renders a footer with citation-text when given", () => {
        const host = render(
            '<lily-blockquote citation-text="Ada Lovelace">Quoted text.</lily-blockquote>',
        );

        expect(host.querySelector("footer.blockquote-citation")!.textContent).toBe("Ada Lovelace");
    });

    test("uses label as an aria-label override", () => {
        const host = render(
            '<lily-blockquote label="A famous quote">Quoted text.</lily-blockquote>',
        );

        expect(host.querySelector("blockquote")!.getAttribute("aria-label")).toBe("A famous quote");
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", () => {
        document.body.innerHTML = `<lily-blockquote >Words</lily-blockquote>`;
        const el = document.querySelector("lily-blockquote")!;
        el.setAttribute("citation-text", "A. Writer");
        const q = el.querySelector("blockquote")!;
        expect(q.lastElementChild!.textContent).toBe("A. Writer");
        el.removeAttribute("citation-text");
        expect(q.querySelector("footer")).toBeNull();
        expect(q.textContent).toBe("Words");
    });
});
