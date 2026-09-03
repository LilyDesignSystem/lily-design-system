import { afterEach, describe, expect, test } from "vitest";

import { Badge } from "./badge.js";

if (!customElements.get("lily-badge")) {
    customElements.define("lily-badge", Badge);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Badge", () => {
    test("renders a native span with role=status", () => {
        const host = render("<lily-badge>New</lily-badge>");

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span.getAttribute("role")).toBe("status");
        expect(span.textContent).toBe("New");
    });

    test("defaults data-type to default", () => {
        const host = render("<lily-badge>New</lily-badge>");

        expect(host.querySelector("span")!.getAttribute("data-type")).toBe("default");
    });

    test("honours an explicit type", () => {
        const host = render('<lily-badge type="success">Active</lily-badge>');

        expect(host.querySelector("span")!.getAttribute("data-type")).toBe("success");
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-badge label="3 unread messages">3</lily-badge>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("3 unread messages");
    });
});
