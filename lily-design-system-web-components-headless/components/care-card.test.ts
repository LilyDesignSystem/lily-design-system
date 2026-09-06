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
    test("renders a native section with role=region", () => {
        const host = render('<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>');

        const section = host.querySelector("section.care-card") as HTMLElement;
        expect(section.getAttribute("role")).toBe("region");
    });

    test("renders an h2 with the heading text", () => {
        const host = render('<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>');

        expect(host.querySelector("h2")!.textContent).toBe("Speak to a GP if:");
    });

    test("defaults aria-label to the heading text", () => {
        const host = render('<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>');

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("Speak to a GP if:");
    });

    test("label overrides the aria-label default", () => {
        const host = render(
            '<lily-care-card heading="Speak to a GP if:" label="Non-urgent care advice">Persistent symptoms.</lily-care-card>',
        );

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("Non-urgent care advice");
    });

    test("defaults data-type to non-urgent", () => {
        const host = render('<lily-care-card heading="Speak to a GP if:">Persistent symptoms.</lily-care-card>');

        expect(host.querySelector("section")!.getAttribute("data-type")).toBe("non-urgent");
    });

    test("honours an explicit type", () => {
        const host = render('<lily-care-card heading="Call 999 if:" type="immediate">Difficulty breathing.</lily-care-card>');

        expect(host.querySelector("section")!.getAttribute("data-type")).toBe("immediate");
    });

    test("moves original content into the section, after the heading", () => {
        const host = render('<lily-care-card heading="Call 999 if:">Difficulty breathing.</lily-care-card>');

        const section = host.querySelector("section")!;
        expect(section.lastChild!.textContent).toBe("Difficulty breathing.");
    });
});
