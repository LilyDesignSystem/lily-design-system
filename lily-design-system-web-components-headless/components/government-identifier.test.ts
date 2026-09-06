import { afterEach, describe, expect, test } from "vitest";

import { GovernmentIdentifier } from "./government-identifier.js";

if (!customElements.get("lily-government-identifier")) {
    customElements.define("lily-government-identifier", GovernmentIdentifier);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GovernmentIdentifier", () => {
    test("renders a native section with aria-label", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency"></lily-government-identifier>',
        );

        const section = host.querySelector("section.government-identifier")!;
        expect(section).toBeTruthy();
        expect(section.getAttribute("aria-label")).toBe("Agency identifier");
    });

    test("renders the agency name in a span when no agency-href is given", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency"></lily-government-identifier>',
        );

        const agency = host.querySelector(".government-identifier-agency")!;
        expect(agency.querySelector("span")!.textContent).toBe("Example Agency");
        expect(agency.querySelector("a")).toBeNull();
    });

    test("wraps the agency name in a link when agency-href is given", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency" agency-href="https://example.gov"></lily-government-identifier>',
        );

        const a = host.querySelector(".government-identifier-agency a") as HTMLAnchorElement;
        expect(a).toBeTruthy();
        expect(a.getAttribute("href")).toBe("https://example.gov");
        expect(a.textContent).toBe("Example Agency");
    });

    test("renders a logo image only when logo-url is provided", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency"></lily-government-identifier>',
        );
        expect(host.querySelector(".government-identifier-logo")).toBeNull();

        const host2 = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency" logo-url="/seal.png" logo-alt="Agency seal"></lily-government-identifier>',
        );
        const img = host2.querySelector(".government-identifier-logo") as HTMLImageElement;
        expect(img).toBeTruthy();
        expect(img.alt).toBe("Agency seal");
    });

    test("renders a description paragraph only when provided", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency" description="A federal agency."></lily-government-identifier>',
        );

        expect(host.querySelector(".government-identifier-description")!.textContent).toBe("A federal agency.");
    });

    test("moves children into a labelled nav when children are provided", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency"><ul id="links"></ul></lily-government-identifier>',
        );

        const nav = host.querySelector("nav.government-identifier-links")!;
        expect(nav).toBeTruthy();
        expect(nav.getAttribute("aria-label")).toBe("Agency identifier");
        expect(nav.querySelector("#links")).toBeTruthy();
    });

    test("omits the nav entirely when no children are provided", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency"></lily-government-identifier>',
        );

        expect(host.querySelector("nav.government-identifier-links")).toBeNull();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render(
            '<lily-government-identifier label="Agency identifier" agency-name="Example Agency" class="extra"></lily-government-identifier>',
        );

        expect(host.querySelector("section")!.className).toBe("government-identifier extra");
    });
});
