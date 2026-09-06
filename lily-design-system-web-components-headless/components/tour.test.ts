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

    test("does not set role=dialog or aria-modal (owned by TourList, not Tour)", () => {
        const host = render('<lily-tour label="Getting started"></lily-tour>');

        expect(host.hasAttribute("role")).toBe(false);
        expect(host.hasAttribute("aria-modal")).toBe(false);
    });

    test("preserves consumer-supplied children (typically a TourList)", () => {
        const host = render('<lily-tour label="Getting started"><lily-tour-list label="Steps"></lily-tour-list></lily-tour>');

        expect(host.querySelector("lily-tour-list")).toBeTruthy();
    });

    test("merges the consumer's class attribute with the base class", () => {
        const host = render('<lily-tour label="Getting started" class="my-tour"></lily-tour>');

        expect(host.classList.contains("tour")).toBe(true);
        expect(host.classList.contains("my-tour")).toBe(true);
    });
});
