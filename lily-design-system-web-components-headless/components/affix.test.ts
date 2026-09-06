import { afterEach, describe, expect, test } from "vitest";

import { Affix } from "./affix.js";

if (!customElements.get("lily-affix")) {
    customElements.define("lily-affix", Affix);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Affix", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-affix>Pinned content</lily-affix>");

        expect(host.className).toBe("affix");
    });

    test("defaults --affix-offset-top to 0px; sets no position directly (that's the consumer's CSS)", () => {
        const host = render("<lily-affix>Pinned content</lily-affix>");

        expect(host.style.getPropertyValue("--affix-offset-top")).toBe("0px");
        expect(host.style.position).toBe("");
    });

    test("offset-top sets --affix-offset-top and data-offset-top", () => {
        const host = render('<lily-affix offset-top="12">Pinned content</lily-affix>');

        expect(host.style.getPropertyValue("--affix-offset-top")).toBe("12px");
        expect(host.getAttribute("data-offset-top")).toBe("12");
    });

    test("offset-bottom sets --affix-offset-bottom and data-offset-bottom", () => {
        const host = render('<lily-affix offset-bottom="16">Pinned content</lily-affix>');

        expect(host.style.getPropertyValue("--affix-offset-bottom")).toBe("16px");
        expect(host.getAttribute("data-offset-bottom")).toBe("16");
    });

    test("preserves original content", () => {
        const host = render("<lily-affix>Pinned content</lily-affix>");

        expect(host.textContent).toBe("Pinned content");
    });
});
