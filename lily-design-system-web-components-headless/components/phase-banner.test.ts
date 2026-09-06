import { afterEach, describe, expect, test } from "vitest";

import { PhaseBanner } from "./phase-banner.js";

if (!customElements.get("lily-phase-banner")) {
    customElements.define("lily-phase-banner", PhaseBanner);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PhaseBanner", () => {
    test("the custom element itself is the wrapper div (self-is-the-wrapper)", () => {
        const host = render('<lily-phase-banner phase="Beta">This is a new service.</lily-phase-banner>');

        expect(host.className).toBe("phase-banner");
    });

    test("renders no role by default", () => {
        const host = render('<lily-phase-banner phase="Beta">This is a new service.</lily-phase-banner>');

        expect(host.hasAttribute("role")).toBe(false);
    });

    test("renders the phase in a strong element before the existing content", () => {
        const host = render('<lily-phase-banner phase="Beta">This is a new service.</lily-phase-banner>');

        const strong = host.querySelector("strong.phase-banner-phase")!;
        expect(strong.textContent).toBe("Beta");
        expect(host.firstElementChild).toBe(strong);
        expect(host.textContent).toBe("BetaThis is a new service.");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-phase-banner phase="Beta" class="extra">Feedback link.</lily-phase-banner>');

        expect(host.className).toBe("phase-banner extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-phase-banner phase="Beta">Feedback link.</lily-phase-banner>');

        (host as unknown as PhaseBanner).connectedCallback();

        expect(host.querySelectorAll("strong.phase-banner-phase").length).toBe(1);
    });
});
