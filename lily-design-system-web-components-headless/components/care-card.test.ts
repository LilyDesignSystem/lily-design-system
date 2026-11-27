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

    test("shows a change to its attributes after it is mounted (P50-T28)", async () => {
        document.body.innerHTML = `<lily-care-card type="non-urgent" heading="Self care">Rest</lily-care-card>`;
        const el = document.querySelector("lily-care-card")!;
        const span = el.querySelector("div.care-card")!;
        el.setAttribute("type", "emergency");
        el.setAttribute("heading", "Call 999");
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(el.querySelector("div.care-card")).toBe(span);
        expect(span.getAttribute("data-type")).toBe("emergency");
        expect(span.querySelector("h2")!.textContent).toBe("Call 999");
        expect(span.getAttribute("aria-label")).toBe("Call 999");
        expect(span.textContent).toBe("Call 999Rest");
    });
});
