import { afterEach, describe, expect, test } from "vitest";

import { PaginationNav } from "./pagination-nav.js";

if (!customElements.get("lily-pagination-nav")) {
    customElements.define("lily-pagination-nav", PaginationNav);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PaginationNav", () => {
    test("renders a native nav", () => {
        const host = render('<lily-pagination-nav label="Pagination"><ol><li>1</li></ol></lily-pagination-nav>');

        expect(host.querySelector("nav.pagination-nav")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-pagination-nav label="Pagination"></lily-pagination-nav>');

        expect(host.querySelector("nav")!.getAttribute("aria-label")).toBe("Pagination");
    });

    test("moves children into the nav", () => {
        const host = render('<lily-pagination-nav label="Pagination"><ol><li>1</li></ol></lily-pagination-nav>');

        expect(host.querySelector("nav > ol")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-pagination-nav label="Pagination" class="extra"></lily-pagination-nav>');

        expect(host.querySelector("nav")!.className).toBe("pagination-nav extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-pagination-nav label="Pagination" data-testid="pagination"></lily-pagination-nav>');

        expect(host.querySelector("nav")!.getAttribute("data-testid")).toBe("pagination");
    });
});
