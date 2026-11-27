import { afterEach, describe, expect, test } from "vitest";

import { Character } from "./character.js";

if (!customElements.get("lily-character")) {
    customElements.define("lily-character", Character);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Character", () => {
    test("renders a native span with role=img by default", () => {
        const host = render('<lily-character label="Check mark">✓</lily-character>');

        const span = host.querySelector("span.character") as HTMLSpanElement;
        expect(span.getAttribute("role")).toBe("img");
        expect(span.getAttribute("aria-label")).toBe("Check mark");
    });

    test("decorative renders role=presentation and aria-hidden", () => {
        const host = render("<lily-character decorative>·</lily-character>");

        const span = host.querySelector("span")!;
        expect(span.getAttribute("role")).toBe("presentation");
        expect(span.getAttribute("aria-hidden")).toBe("true");
        expect(span.hasAttribute("aria-label")).toBe(false);
    });

    test("moves the character content into the span", () => {
        const host = render('<lily-character label="Check mark">✓</lily-character>');

        expect(host.querySelector("span")!.textContent).toBe("✓");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-character label="Check mark">✓</lily-character>');

        (host as unknown as Character).connectedCallback();

        expect(host.querySelectorAll("span.character").length).toBe(1);
    });

    test("shows a change to its attributes after it is mounted (P50-T28)", () => {
        document.body.innerHTML = `<lily-character label="Wizard">W</lily-character>`;
        const el = document.querySelector("lily-character")!;
        el.setAttribute("decorative", "");
        const s = el.querySelector("span.character")!;
        expect(s.getAttribute("aria-hidden")).toBe("true");
        expect(s.hasAttribute("aria-label")).toBe(false);
        el.removeAttribute("decorative");
        expect(s.getAttribute("role")).toBe("img");
        expect(s.getAttribute("aria-label")).toBe("Wizard");
    });
});
