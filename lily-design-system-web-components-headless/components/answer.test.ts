import { afterEach, describe, expect, test } from "vitest";

import { Answer } from "./answer.js";

if (!customElements.get("lily-answer")) {
    customElements.define("lily-answer", Answer);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Answer", () => {
    test("the custom element itself is the wrapper (self-is-the-wrapper)", () => {
        const host = render("<lily-answer>42.</lily-answer>");

        expect(host.className).toBe("answer");
    });

    test("has no aria-label when label is absent", () => {
        const host = render("<lily-answer>42.</lily-answer>");

        expect(host.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as aria-label", () => {
        const host = render('<lily-answer label="Answer to the question">42.</lily-answer>');

        expect(host.getAttribute("aria-label")).toBe("Answer to the question");
    });

    test("preserves original content", () => {
        const host = render("<lily-answer>42.</lily-answer>");

        expect(host.textContent).toBe("42.");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-answer>42.</lily-answer>");

        (host as unknown as Answer).connectedCallback();

        expect(host.className).toBe("answer");
    });
});
