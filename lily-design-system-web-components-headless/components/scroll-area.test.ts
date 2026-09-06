import { afterEach, describe, expect, test } from "vitest";

import { ScrollArea } from "./scroll-area.js";

if (!customElements.get("lily-scroll-area")) {
    customElements.define("lily-scroll-area", ScrollArea);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ScrollArea", () => {
    test("carries the base class", () => {
        const host = render('<lily-scroll-area label="Chat messages"><p>Long content...</p></lily-scroll-area>');

        expect(host.classList.contains("scroll-area")).toBe(true);
    });

    test("has role=region", () => {
        const host = render('<lily-scroll-area label="Chat messages"><p>Long content...</p></lily-scroll-area>');

        expect(host.getAttribute("role")).toBe("region");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-scroll-area label="Chat messages"><p>Long content...</p></lily-scroll-area>');

        expect(host.getAttribute("aria-label")).toBe("Chat messages");
    });

    test("is keyboard-focusable via tabindex=0", () => {
        const host = render('<lily-scroll-area label="Chat messages"><p>Long content...</p></lily-scroll-area>');

        expect(host.tabIndex).toBe(0);
    });

    test("keeps scrollable content in place", () => {
        const host = render('<lily-scroll-area label="Chat messages"><p>Long content...</p></lily-scroll-area>');

        expect(host.querySelector("p")?.textContent).toBe("Long content...");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-scroll-area label="Chat messages" class="my-scroll"><p></p></lily-scroll-area>');

        expect(host.getAttribute("class")).toBe("scroll-area my-scroll");
    });
});
