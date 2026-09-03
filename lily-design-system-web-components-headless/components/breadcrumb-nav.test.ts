import { afterEach, describe, expect, test } from "vitest";

import { BreadcrumbNav } from "./breadcrumb-nav.js";

if (!customElements.get("lily-breadcrumb-nav")) {
    customElements.define("lily-breadcrumb-nav", BreadcrumbNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BreadcrumbNav", () => {
    test("renders a native nav landmark", () => {
        const host = render('<lily-breadcrumb-nav label="Breadcrumb"><ol></ol></lily-breadcrumb-nav>');

        expect(host.querySelector("nav.breadcrumb-nav")).toBeTruthy();
    });

    test("uses label as the landmark's accessible name", () => {
        const host = render('<lily-breadcrumb-nav label="Breadcrumb"></lily-breadcrumb-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Breadcrumb");
    });

    test("moves its children into the nav", () => {
        const host = render('<lily-breadcrumb-nav label="Breadcrumb"><ol id="trail"></ol></lily-breadcrumb-nav>');

        expect(host.querySelector("nav > #trail")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-breadcrumb-nav label="Breadcrumb" class="extra"></lily-breadcrumb-nav>');

        expect(host.querySelector("nav")!.className).toBe("breadcrumb-nav extra");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-breadcrumb-nav label="Breadcrumb"></lily-breadcrumb-nav>');

        (host as unknown as BreadcrumbNav).connectedCallback();

        expect(host.querySelectorAll("nav").length).toBe(1);
    });
});
