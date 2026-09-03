import { afterEach, describe, expect, test } from "vitest";

import { BreadcrumbList } from "./breadcrumb-list.js";

if (!customElements.get("lily-breadcrumb-list")) {
    customElements.define("lily-breadcrumb-list", BreadcrumbList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BreadcrumbList", () => {
    test("renders a native ordered list", () => {
        const host = render("<lily-breadcrumb-list></lily-breadcrumb-list>");

        expect(host.querySelector("ol.breadcrumb-list")).toBeTruthy();
    });

    test("moves its children into the ol", () => {
        const host = render("<lily-breadcrumb-list><li>Home</li></lily-breadcrumb-list>");

        expect(host.querySelector("ol > li")!.textContent).toBe("Home");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-breadcrumb-list class="extra"></lily-breadcrumb-list>');

        expect(host.querySelector("ol")!.className).toBe("breadcrumb-list extra");
    });

    test("passes through rest attributes to the ol", () => {
        const host = render('<lily-breadcrumb-list data-testid="trail"></lily-breadcrumb-list>');

        expect(host.querySelector("ol")!.getAttribute("data-testid")).toBe("trail");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-breadcrumb-list></lily-breadcrumb-list>");

        (host as unknown as BreadcrumbList).connectedCallback();

        expect(host.querySelectorAll("ol").length).toBe(1);
    });
});
