import { afterEach, describe, expect, test } from "vitest";

import { InsetText } from "./inset-text.js";

if (!customElements.get("lily-inset-text")) {
    customElements.define("lily-inset-text", InsetText);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("InsetText", () => {
    test("renders as itself with the base class", () => {
        const host = render("<lily-inset-text><p>Important note</p></lily-inset-text>");

        expect(host.tagName.toLowerCase()).toBe("lily-inset-text");
        expect(host.className).toBe("inset-text");
    });

    test("has role=note", () => {
        const host = render("<lily-inset-text><p>Important note</p></lily-inset-text>");

        expect(host.getAttribute("role")).toBe("note");
    });

    test("preserves children content in place", () => {
        const host = render("<lily-inset-text><p>It can take up to 8 weeks.</p></lily-inset-text>");

        expect(host.querySelector("p")!.textContent).toBe("It can take up to 8 weeks.");
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-inset-text class="callout"><p>Note</p></lily-inset-text>');

        expect(host.className).toBe("inset-text callout");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-inset-text data-testid="inset"><p>Note</p></lily-inset-text>');

        expect(host.getAttribute("data-testid")).toBe("inset");
    });
});
