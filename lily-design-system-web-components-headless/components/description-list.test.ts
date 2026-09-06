import { afterEach, describe, expect, test } from "vitest";

import { DescriptionList } from "./description-list.js";

if (!customElements.get("lily-description-list")) {
    customElements.define("lily-description-list", DescriptionList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DescriptionList", () => {
    test("renders a native description list", () => {
        const host = render("<lily-description-list></lily-description-list>");

        expect(host.querySelector("dl.description-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-description-list></lily-description-list>");

        expect(host.querySelector("dl")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-description-list label="Metadata"></lily-description-list>');

        expect(host.querySelector("dl")!.getAttribute("aria-label")).toBe("Metadata");
    });

    test("moves its children into the dl", () => {
        const host = render("<lily-description-list><dt>Name</dt><dd>Widget</dd></lily-description-list>");

        expect(host.querySelector("dl > dt")!.textContent).toBe("Name");
        expect(host.querySelector("dl > dd")!.textContent).toBe("Widget");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-description-list class="extra"></lily-description-list>');

        expect(host.querySelector("dl")!.className).toBe("description-list extra");
    });

    test("passes through rest attributes to the dl", () => {
        const host = render('<lily-description-list data-testid="meta"></lily-description-list>');

        expect(host.querySelector("dl")!.getAttribute("data-testid")).toBe("meta");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-description-list></lily-description-list>");

        (host as unknown as DescriptionList).connectedCallback();

        expect(host.querySelectorAll("dl").length).toBe(1);
    });
});
