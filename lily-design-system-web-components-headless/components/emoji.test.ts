import { afterEach, describe, expect, test } from "vitest";

import { Emoji } from "./emoji.js";

if (!customElements.get("lily-emoji")) {
    customElements.define("lily-emoji", Emoji);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Emoji", () => {
    test("renders a span with role=img", () => {
        const host = render('<lily-emoji emoji="👍" label="Thumbs up"></lily-emoji>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.className).toBe("emoji");
        expect(span.getAttribute("role")).toBe("img");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-emoji emoji="👍" label="Thumbs up"></lily-emoji>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Thumbs up");
    });

    test("displays the emoji character as text content", () => {
        const host = render('<lily-emoji emoji="👍" label="Thumbs up"></lily-emoji>');

        expect(host.querySelector("span")!.textContent).toBe("👍");
    });

    test("passes through rest attributes onto the span", () => {
        const host = render('<lily-emoji emoji="⚠️" label="Warning" data-testid="warn"></lily-emoji>');

        expect(host.querySelector("span")!.getAttribute("data-testid")).toBe("warn");
    });
});
