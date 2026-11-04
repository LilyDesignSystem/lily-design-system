import { afterEach, describe, expect, test } from "vitest";

import { WarningText } from "./warning-text.js";

if (!customElements.get("lily-warning-text")) {
    customElements.define("lily-warning-text", WarningText);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

const TEXT =
    '<span class="screen-reader-span">Warning</span> You can be fined if you do not register.';

describe("WarningText", () => {
    test("renders as itself with the base class", () => {
        const host = render(`<lily-warning-text>${TEXT}</lily-warning-text>`);
        expect(host.tagName.toLowerCase()).toBe("lily-warning-text");
        expect(host.className).toBe("warning-text");
    });

    test("appends the consumer class after the base class", () => {
        const host = render(`<lily-warning-text class="mine">${TEXT}</lily-warning-text>`);
        expect(host.getAttribute("class")).toBe("warning-text mine");
    });

    test("moves the content, hidden prefix included, into strong.warning-text-text", () => {
        const host = render(`<lily-warning-text>${TEXT}</lily-warning-text>`);
        const strong = host.querySelector(":scope > strong.warning-text-text")!;
        expect(strong.querySelector(".screen-reader-span")!.textContent).toBe("Warning");
        expect(strong.textContent).toContain("You can be fined");
    });

    test("moves a slot=icon child first, into an aria-hidden wrapper", () => {
        const host = render(
            `<lily-warning-text>${TEXT}<span slot="icon">!</span></lily-warning-text>`,
        );
        const wrap = host.querySelector(":scope > .warning-text-icon")!;
        expect(wrap.getAttribute("aria-hidden")).toBe("true");
        expect(wrap.textContent).toBe("!");
        expect(wrap.querySelector("[slot]")).toBeNull();
        expect(host.firstElementChild).toBe(wrap);
        expect(host.querySelector(".warning-text-text")!.textContent).not.toContain("!");
    });

    test("renders no icon wrapper when no icon is supplied", () => {
        const host = render(`<lily-warning-text>${TEXT}</lily-warning-text>`);
        expect(host.querySelector(".warning-text-icon")).toBeNull();
    });

    test("adds no role and no text of its own; other attributes stay on the root", () => {
        const host = render('<lily-warning-text id="x1"></lily-warning-text>');
        expect(host.getAttribute("role")).toBeNull();
        expect(host.textContent).toBe("");
        expect(host.id).toBe("x1");
    });

    test("is idempotent if connectedCallback runs twice", () => {
        const host = render(`<lily-warning-text>${TEXT}</lily-warning-text>`);
        (host as unknown as WarningText).connectedCallback();
        expect(host.querySelectorAll("strong.warning-text-text").length).toBe(1);
    });
});
