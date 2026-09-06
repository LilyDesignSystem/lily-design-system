import { afterEach, describe, expect, test } from "vitest";

import { BreadcrumbLink } from "./breadcrumb-link.js";

if (!customElements.get("lily-breadcrumb-link")) {
    customElements.define("lily-breadcrumb-link", BreadcrumbLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BreadcrumbLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-breadcrumb-link href="/products">Products</lily-breadcrumb-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("breadcrumb-link");
        expect(a.getAttribute("href")).toBe("/products");
        expect(a.textContent).toBe("Products");
    });

    test("uses label as an aria-label override", () => {
        const host = render(
            '<lily-breadcrumb-link href="/products" label="Go to products">Products</lily-breadcrumb-link>',
        );

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Go to products");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-breadcrumb-link href="/x" class="extra">Go</lily-breadcrumb-link>');

        expect(host.querySelector("a")!.className).toBe("breadcrumb-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-breadcrumb-link href="/x" data-testid="crumb">Go</lily-breadcrumb-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("crumb");
    });

    test("moves children into the rendered anchor", () => {
        const host = render('<lily-breadcrumb-link href="/x"><span>Home</span></lily-breadcrumb-link>');

        expect(host.querySelector("a > span")!.textContent).toBe("Home");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-breadcrumb-link href="/x">Go</lily-breadcrumb-link>');

        (host as unknown as BreadcrumbLink).connectedCallback();

        expect(host.querySelectorAll("a.breadcrumb-link").length).toBe(1);
    });
});
