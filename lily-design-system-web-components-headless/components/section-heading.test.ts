import { afterEach, describe, expect, test } from "vitest";

import { SectionHeading } from "./section-heading.js";

if (!customElements.get("lily-section-heading")) {
    customElements.define("lily-section-heading", SectionHeading);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SectionHeading", () => {
    test("renders a native header", () => {
        const host = render('<lily-section-heading heading="Our principles"></lily-section-heading>');

        expect(host.querySelector("header.section-heading")).toBeTruthy();
    });

    test("renders the heading as an h2 by default", () => {
        const host = render('<lily-section-heading heading="Our principles"></lily-section-heading>');

        const h = host.querySelector("h2.section-heading-heading");
        expect(h).toBeTruthy();
        expect(h!.textContent).toBe("Our principles");
    });

    test("renders the heading at the given level", () => {
        const host = render('<lily-section-heading heading="Designed for healthcare" level="3"></lily-section-heading>');

        expect(host.querySelector("h3.section-heading-heading")).toBeTruthy();
        expect(host.querySelector("h2")).toBeFalsy();
    });

    test("renders eyebrow only when provided", () => {
        const withEyebrow = render(
            '<lily-section-heading heading="Designed for healthcare" eyebrow="Why Lily"></lily-section-heading>',
        );
        const eyebrow = withEyebrow.querySelector("p.section-heading-eyebrow");
        expect(eyebrow).toBeTruthy();
        expect(eyebrow!.textContent).toBe("Why Lily");

        const without = render('<lily-section-heading heading="Our principles"></lily-section-heading>');
        expect(without.querySelector("p.section-heading-eyebrow")).toBeFalsy();
    });

    test("renders subtitle only when provided", () => {
        const withSubtitle = render(
            '<lily-section-heading heading="Designed for healthcare" subtitle="Patient-first."></lily-section-heading>',
        );
        const subtitle = withSubtitle.querySelector("p.section-heading-subtitle");
        expect(subtitle).toBeTruthy();
        expect(subtitle!.textContent).toBe("Patient-first.");

        const without = render('<lily-section-heading heading="Our principles"></lily-section-heading>');
        expect(without.querySelector("p.section-heading-subtitle")).toBeFalsy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-section-heading heading="Our principles" class="extra"></lily-section-heading>');

        expect(host.querySelector("header")!.className).toBe("section-heading extra");
    });

    test("passes through rest attributes to the header", () => {
        const host = render('<lily-section-heading heading="Our principles" data-testid="sh"></lily-section-heading>');

        expect(host.querySelector("header")!.getAttribute("data-testid")).toBe("sh");
    });
});
