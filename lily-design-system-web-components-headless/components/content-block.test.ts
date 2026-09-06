import { afterEach, describe, expect, test } from "vitest";

import { ContentBlock } from "./content-block.js";

if (!customElements.get("lily-content-block")) {
    customElements.define("lily-content-block", ContentBlock);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ContentBlock", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-content-block>Text</lily-content-block>");

        expect(host.className).toBe("content-block");
    });

    test("defaults data-width to normal", () => {
        const host = render("<lily-content-block>Text</lily-content-block>");

        expect(host.getAttribute("data-width")).toBe("normal");
    });

    test("reflects the width attribute onto data-width", () => {
        const host = render('<lily-content-block width="wide">Text</lily-content-block>');

        expect(host.getAttribute("data-width")).toBe("wide");
    });

    test("preserves children content", () => {
        const host = render("<lily-content-block><p>Article body</p></lily-content-block>");

        expect(host.querySelector("p")!.textContent).toBe("Article body");
    });
});
