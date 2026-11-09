import { afterEach, describe, expect, test } from "vitest";

import { CareCard } from "./care-card.js";

if (!customElements.get("lily-care-card")) {
    customElements.define("lily-care-card", CareCard);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CareCard", () => {
    test("renders a div with role=group", () => {
        const host = render(
            '<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>',
        );

        const root = host.querySelector("div.care-card") as HTMLElement;
        expect(root.getAttribute("role")).toBe("group");
    });

    test("renders an h2 with the heading text", () => {
        const host = render(
            '<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>',
        );

        expect(host.querySelector("h2")!.textContent).toBe("Speak to a GP if:");
    });

    test("defaults aria-label to the heading text", () => {
        const host = render(
            '<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>',
        );

        expect(host.querySelector("div.care-card")!.getAttribute("aria-label")).toBe(
            "Speak to a GP if:",
        );
    });

    test("label overrides the aria-label default", () => {
        const host = render(
            '<lily-care-card heading="Speak to a GP if:" label="Non-urgent care advice">Persistent symptoms.</lily-care-card>',
        );

        expect(host.querySelector("div.care-card")!.getAttribute("aria-label")).toBe(
            "Non-urgent care advice",
        );
    });

    test("defaults data-type to non-urgent", () => {
        const host = render(
            '<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>',
        );

        expect(host.querySelector("div.care-card")!.getAttribute("data-type")).toBe("non-urgent");
    });

    test("honours an explicit type", () => {
        const host = render(
            '<lily-care-card heading="Call 999 if:" type="immediate">Difficulty breathing.</lily-care-card>',
        );

        expect(host.querySelector("div.care-card")!.getAttribute("data-type")).toBe("immediate");
    });

    test("moves original content into the div, after the heading", () => {
        const host = render(
            '<lily-care-card heading="Call 999 if:">Difficulty breathing.</lily-care-card>',
        );

        const root = host.querySelector("div.care-card")!;
        expect(root.lastChild!.textContent).toBe("Difficulty breathing.");
    });
});
