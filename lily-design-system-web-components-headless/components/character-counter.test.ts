import { afterEach, describe, expect, test } from "vitest";

import { CharacterCounter } from "./character-counter.js";

if (!customElements.get("lily-character-counter")) {
    customElements.define("lily-character-counter", CharacterCounter);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CharacterCounter", () => {
    test("renders a native span with role=status", () => {
        const host = render("<lily-character-counter></lily-character-counter>");

        const span = host.querySelector("span.character-counter") as HTMLSpanElement;
        expect(span.getAttribute("role")).toBe("status");
        expect(span.getAttribute("aria-live")).toBe("polite");
    });

    test("defaults count to 0 with no max", () => {
        const host = render("<lily-character-counter></lily-character-counter>");

        const span = host.querySelector("span")!;
        expect(span.textContent).toBe("0");
        expect(span.getAttribute("data-count")).toBe("0");
        expect(span.hasAttribute("data-max")).toBe(false);
    });

    test("shows count / max when max is provided", () => {
        const host = render('<lily-character-counter count="42" max="140"></lily-character-counter>');

        const span = host.querySelector("span")!;
        expect(span.textContent).toBe("42 / 140");
        expect(span.getAttribute("data-remaining")).toBe("98");
        expect(span.hasAttribute("data-over-limit")).toBe(false);
    });

    test("sets data-over-limit when count exceeds max", () => {
        const host = render('<lily-character-counter count="150" max="140"></lily-character-counter>');

        expect(host.querySelector("span")!.getAttribute("data-over-limit")).toBe("true");
    });

    test("uses label as aria-label", () => {
        const host = render('<lily-character-counter label="Characters remaining"></lily-character-counter>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Characters remaining");
    });

    test("updates when count changes externally", () => {
        const host = render('<lily-character-counter count="10" max="100"></lily-character-counter>');

        host.setAttribute("count", "20");

        expect(host.querySelector("span")!.textContent).toBe("20 / 100");
    });
});
