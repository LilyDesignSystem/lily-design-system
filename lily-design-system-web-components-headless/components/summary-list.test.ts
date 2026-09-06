import { afterEach, describe, expect, test } from "vitest";

import { SummaryList } from "./summary-list.js";

if (!customElements.get("lily-summary-list")) {
    customElements.define("lily-summary-list", SummaryList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SummaryList", () => {
    test("renders a native description list", () => {
        const host = render('<lily-summary-list label="Order summary"></lily-summary-list>');

        expect(host.querySelector("dl.summary-list")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-summary-list label="Order summary"></lily-summary-list>');

        expect(host.querySelector("dl")!.getAttribute("aria-label")).toBe("Order summary");
    });

    test("moves its children into the dl", () => {
        const host = render('<lily-summary-list label="Order summary"><dt>Product</dt><dd>Widget</dd></lily-summary-list>');

        expect(host.querySelector("dl > dt")!.textContent).toBe("Product");
        expect(host.querySelector("dl > dd")!.textContent).toBe("Widget");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-summary-list label="Order summary" class="extra"></lily-summary-list>');

        expect(host.querySelector("dl")!.className).toBe("summary-list extra");
    });

    test("passes through rest attributes to the dl", () => {
        const host = render('<lily-summary-list label="Order summary" data-testid="summary"></lily-summary-list>');

        expect(host.querySelector("dl")!.getAttribute("data-testid")).toBe("summary");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-summary-list label="Order summary"></lily-summary-list>');

        (host as unknown as SummaryList).connectedCallback();

        expect(host.querySelectorAll("dl").length).toBe(1);
    });
});
