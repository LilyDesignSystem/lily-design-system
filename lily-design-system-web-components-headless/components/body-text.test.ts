import { afterEach, describe, expect, test } from "vitest";

import { BodyText } from "./body-text.js";

if (!customElements.get("lily-body-text")) {
    customElements.define("lily-body-text", BodyText);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BodyText", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-body-text><p>Paragraph one.</p></lily-body-text>");

        expect(host.className).toBe("body-text");
    });

    test("preserves original content unmodified", () => {
        const host = render("<lily-body-text><p>Paragraph one.</p><p>Paragraph two.</p></lily-body-text>");

        expect(host.querySelectorAll("p").length).toBe(2);
    });

    test("class hook includes the consumer's class attribute", () => {
        const host = render('<lily-body-text class="lede">Text</lily-body-text>');

        expect(host.className).toBe("body-text lede");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-body-text>Text</lily-body-text>");

        (host as unknown as BodyText).connectedCallback();

        expect(host.className).toBe("body-text");
    });
});
