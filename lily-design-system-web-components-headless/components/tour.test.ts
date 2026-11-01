import { afterEach, describe, expect, test } from "vitest";

import { Tour } from "./tour.js";

if (!customElements.get("lily-tour")) {
    customElements.define("lily-tour", Tour);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Tour", () => {
    test("carries the base class", () => {
        const host = render('<lily-tour label="Getting started"></lily-tour>');

        expect(host.classList.contains("tour")).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-tour label="Patient record system walkthrough"></lily-tour>');

        expect(host.getAttribute("aria-label")).toBe("Patient record system walkthrough");
    });

    test("is a non-modal role=dialog with tabindex -1, like Svelte (no aria-modal)", () => {
        const host = render('<lily-tour label="Getting started" active></lily-tour>');

        expect(host.getAttribute("role")).toBe("dialog");
        expect(host.hasAttribute("aria-modal")).toBe(false);
        expect(host.tabIndex).toBe(-1);
    });

    test("is hidden until active, and shown while active", () => {
        const host = render('<lily-tour label="Getting started"></lily-tour>');

        expect(host.hidden).toBe(true);
        host.setAttribute("active", "");
        expect(host.hidden).toBe(false);
    });

    test("Escape removes active and dispatches lily-close", () => {
        const host = render(
            '<lily-tour label="Getting started" active><button>Next</button></lily-tour>',
        );
        let closed = 0;
        host.addEventListener("lily-close", () => closed++);

        host.querySelector("button")!.dispatchEvent(
            new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
        );

        expect(host.hasAttribute("active")).toBe(false);
        expect(host.hidden).toBe(true);
        expect(closed).toBe(1);
        host.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
        expect(closed).toBe(1);
    });

    test("preserves consumer-supplied children (typically a TourList)", () => {
        const host = render(
            '<lily-tour label="Getting started"><lily-tour-list label="Steps"></lily-tour-list></lily-tour>',
        );

        expect(host.querySelector("lily-tour-list")).toBeTruthy();
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-tour label="Getting started" class="my-tour"></lily-tour>');

        expect(host.classList.contains("tour")).toBe(true);
        expect(host.classList.contains("my-tour")).toBe(true);
    });
});
