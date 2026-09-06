import { afterEach, describe, expect, test } from "vitest";

import { Icon } from "./icon.js";

if (!customElements.get("lily-icon")) {
    customElements.define("lily-icon", Icon);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Icon", () => {
    test("renders a span with the correct class", () => {
        const host = render('<lily-icon label="Close">x</lily-icon>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("icon");
    });

    test("has role=img and aria-label for a meaningful icon", () => {
        const host = render('<lily-icon label="Close">x</lily-icon>');

        const span = host.querySelector("span")!;
        expect(span.getAttribute("role")).toBe("img");
        expect(span.getAttribute("aria-label")).toBe("Close");
    });

    test("is aria-hidden with no role for a decorative icon", () => {
        const host = render("<lily-icon decorative>*</lily-icon>");

        const span = host.querySelector("span")!;
        expect(span.getAttribute("aria-hidden")).toBe("true");
        expect(span.hasAttribute("role")).toBe(false);
    });

    test("moves children into the inner span", () => {
        const host = render('<lily-icon label="Search">Q</lily-icon>');

        expect(host.querySelector("span")!.textContent).toBe("Q");
    });

    test("passes through rest attributes and the class hook", () => {
        const host = render('<lily-icon label="Search" class="extra" data-testid="search-icon">Q</lily-icon>');

        const span = host.querySelector("span")!;
        expect(span.className).toBe("icon extra");
        expect(span.getAttribute("data-testid")).toBe("search-icon");
    });
});
