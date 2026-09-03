import { afterEach, describe, expect, test, vi } from "vitest";

import { Coachmark } from "./coachmark.js";

if (!customElements.get("lily-coachmark")) {
    customElements.define("lily-coachmark", Coachmark);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Coachmark", () => {
    test("the custom element itself is the dialog (self-is-the-wrapper)", () => {
        const host = render('<lily-coachmark title="New feature" dismiss-label="Dismiss"></lily-coachmark>');

        expect(host.getAttribute("role")).toBe("dialog");
        expect(host.getAttribute("aria-modal")).toBe("false");
        expect(host.className).toBe("coachmark");
    });

    test("hidden reflects !open", () => {
        const closed = render('<lily-coachmark title="New feature" dismiss-label="Dismiss"></lily-coachmark>');
        expect(closed.hidden).toBe(true);

        const open = render('<lily-coachmark title="New feature" dismiss-label="Dismiss" open></lily-coachmark>');
        expect(open.hidden).toBe(false);
    });

    test("renders the title, referenced by aria-labelledby", () => {
        const host = render('<lily-coachmark title="New feature" dismiss-label="Dismiss" open></lily-coachmark>');

        const labelledbyId = host.getAttribute("aria-labelledby")!;
        expect(document.getElementById(labelledbyId)!.textContent).toBe("New feature");
    });

    test("renders the description when present, referenced by aria-describedby", () => {
        const host = render(
            '<lily-coachmark title="New feature" description="Try it out." dismiss-label="Dismiss" open></lily-coachmark>',
        );

        const describedbyId = host.getAttribute("aria-describedby")!;
        expect(document.getElementById(describedbyId)!.textContent).toBe("Try it out.");
    });

    test("omits aria-describedby when there is no description", () => {
        const host = render('<lily-coachmark title="New feature" dismiss-label="Dismiss" open></lily-coachmark>');

        expect(host.hasAttribute("aria-describedby")).toBe(false);
    });

    test("dismiss button uses dismiss-label as its accessible name", () => {
        const host = render('<lily-coachmark title="New feature" dismiss-label="Got it" open></lily-coachmark>');

        expect(host.querySelector(".coachmark-dismiss")!.getAttribute("aria-label")).toBe("Got it");
    });

    test("clicking dismiss fires lily-dismiss", () => {
        const host = render('<lily-coachmark title="New feature" dismiss-label="Dismiss" open></lily-coachmark>');
        const handler = vi.fn();
        host.addEventListener("lily-dismiss", handler);

        (host.querySelector(".coachmark-dismiss") as HTMLButtonElement).click();

        expect(handler).toHaveBeenCalled();
    });

    test("any pre-existing light-DOM children survive, appended after the generated elements", () => {
        const host = render(
            '<lily-coachmark title="New feature" dismiss-label="Dismiss" open><span class="extra">extra</span></lily-coachmark>',
        );

        expect(host.querySelector("span.extra")).toBeTruthy();
    });
});
