import { afterEach, describe, expect, test } from "vitest";

import { InfoState } from "./info-state.js";

if (!customElements.get("lily-info-state")) {
    customElements.define("lily-info-state", InfoState);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("InfoState", () => {
    test("renders a native section with role=status", () => {
        const host = render('<lily-info-state title="No results"></lily-info-state>');

        const section = host.querySelector("section.info-state")!;
        expect(section).toBeTruthy();
        expect(section.getAttribute("role")).toBe("status");
    });

    test("defaults data-level to info", () => {
        const host = render('<lily-info-state title="No results"></lily-info-state>');

        expect(host.querySelector("section")!.getAttribute("data-level")).toBe("info");
    });

    test("honours an explicit level", () => {
        const host = render('<lily-info-state title="No results" level="empty"></lily-info-state>');

        expect(host.querySelector("section")!.getAttribute("data-level")).toBe("empty");
    });

    test("aria-label defaults to title", () => {
        const host = render('<lily-info-state title="No results"></lily-info-state>');

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("No results");
    });

    test("label overrides the aria-label default", () => {
        const host = render('<lily-info-state title="No results" label="Search returned nothing"></lily-info-state>');

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("Search returned nothing");
    });

    test("title renders inside an h2", () => {
        const host = render('<lily-info-state title="No results"></lily-info-state>');

        expect(host.querySelector("h2.info-state-title")!.textContent).toBe("No results");
    });

    test("description renders inside a p when provided", () => {
        const host = render('<lily-info-state title="No results" description="Try a different search."></lily-info-state>');

        expect(host.querySelector("p.info-state-description")!.textContent).toBe("Try a different search.");
    });

    test("renders no description paragraph when description is absent", () => {
        const host = render('<lily-info-state title="No results"></lily-info-state>');

        expect(host.querySelector("p.info-state-description")).toBeNull();
    });

    test("a child flagged data-slot=illustration is moved above the title", () => {
        const host = render(
            '<lily-info-state title="No results">' +
                '<div data-slot="illustration">Picture</div>' +
                "</lily-info-state>",
        );
        const section = host.querySelector("section")!;

        expect(section.firstElementChild!.getAttribute("data-slot")).toBe("illustration");
        expect(section.querySelector("h2")!.previousElementSibling!.getAttribute("data-slot")).toBe("illustration");
    });

    test("unflagged children (the action area) render after the description", () => {
        const host = render(
            '<lily-info-state title="No results" description="Try again.">' +
                "<button>Reset</button>" +
                "</lily-info-state>",
        );
        const section = host.querySelector("section")!;

        expect(section.lastElementChild!.tagName).toBe("BUTTON");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-info-state title="No results" class="extra"></lily-info-state>');

        expect(host.querySelector("section")!.className).toBe("info-state extra");
    });
});
