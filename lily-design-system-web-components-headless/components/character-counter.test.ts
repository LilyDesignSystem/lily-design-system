import { afterEach, describe, expect, test, vi } from "vitest";

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
    test("renders a span holding an aria-hidden count and a hidden role=status", () => {
        const host = render("<lily-character-counter></lily-character-counter>");

        const span = host.querySelector("span.character-counter") as HTMLSpanElement;
        expect(span.hasAttribute("role")).toBe(false);
        expect(span.hasAttribute("aria-live")).toBe(false);
        expect(span.querySelector(".character-counter-text")!.getAttribute("aria-hidden")).toBe(
            "true",
        );
        const status = span.querySelector(".character-counter-status")!;
        expect(status.getAttribute("role")).toBe("status");
        expect(status.classList.contains("screen-reader-span")).toBe(true);
        expect(status.textContent).toBe("0");
    });

    test("defaults count to 0 with no max", () => {
        const host = render("<lily-character-counter></lily-character-counter>");

        const span = host.querySelector("span")!;
        expect(span.querySelector(".character-counter-text")!.textContent).toBe("0");
        expect(span.getAttribute("data-count")).toBe("0");
        expect(span.hasAttribute("data-max")).toBe(false);
    });

    test("shows count / max when max is provided", () => {
        const host = render(
            '<lily-character-counter count="42" max="140"></lily-character-counter>',
        );

        const span = host.querySelector("span")!;
        expect(span.querySelector(".character-counter-text")!.textContent).toBe("42 / 140");
        expect(span.getAttribute("data-remaining")).toBe("98");
        expect(span.hasAttribute("data-over-limit")).toBe(false);
    });

    test("sets data-over-limit when count exceeds max", () => {
        const host = render(
            '<lily-character-counter count="150" max="140"></lily-character-counter>',
        );

        expect(host.querySelector("span")!.getAttribute("data-over-limit")).toBe("true");
    });

    test("uses label as aria-label", () => {
        const host = render(
            '<lily-character-counter label="Characters remaining"></lily-character-counter>',
        );

        expect(host.querySelector(".character-counter-status")!.getAttribute("aria-label")).toBe(
            "Characters remaining",
        );
    });

    test("updates when count changes externally", () => {
        const host = render(
            '<lily-character-counter count="10" max="100"></lily-character-counter>',
        );

        host.setAttribute("count", "20");

        expect(host.querySelector(".character-counter-text")!.textContent).toBe("20 / 100");
    });

    test("a run of changes is announced once, after the pause", () => {
        vi.useFakeTimers();
        const host = render('<lily-character-counter count="0" max="10"></lily-character-counter>');
        const status = host.querySelector(".character-counter-status")!;
        for (const count of ["1", "2", "3", "4"]) {
            host.setAttribute("count", count);
            vi.advanceTimersByTime(300);
        }
        expect(status.textContent).toBe("0 / 10");
        vi.advanceTimersByTime(1000);
        expect(status.textContent).toBe("4 / 10");
        vi.useRealTimers();
    });
});
