import { afterEach, describe, expect, test } from "vitest";

import { PaginationLink } from "./pagination-link.js";

if (!customElements.get("lily-pagination-link")) {
    customElements.define("lily-pagination-link", PaginationLink);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PaginationLink", () => {
    test("renders a native anchor with the given href", () => {
        const host = render('<lily-pagination-link href="?page=2">2</lily-pagination-link>');

        const a = host.querySelector("a") as HTMLAnchorElement;
        expect(a.className).toBe("pagination-link");
        expect(a.getAttribute("href")).toBe("?page=2");
        expect(a.textContent).toBe("2");
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-pagination-link href="?page=2" label="Go to page 2">2</lily-pagination-link>');

        expect(host.querySelector("a")!.getAttribute("aria-label")).toBe("Go to page 2");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-pagination-link href="?page=1" class="extra">1</lily-pagination-link>');

        expect(host.querySelector("a")!.className).toBe("pagination-link extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-pagination-link href="?page=1" data-testid="page-link">1</lily-pagination-link>');

        expect(host.querySelector("a")!.getAttribute("data-testid")).toBe("page-link");
    });

    test("moves children into the rendered anchor", () => {
        const host = render('<lily-pagination-link href="?page=1"><span>1</span></lily-pagination-link>');

        expect(host.querySelector("a > span")!.textContent).toBe("1");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-pagination-link href="?page=1">1</lily-pagination-link>');

        (host as unknown as PaginationLink).connectedCallback();

        expect(host.querySelectorAll("a.pagination-link").length).toBe(1);
    });
});
