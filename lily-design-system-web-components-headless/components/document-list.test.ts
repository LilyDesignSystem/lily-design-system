import { afterEach, describe, expect, test } from "vitest";

import { DocumentList } from "./document-list.js";

if (!customElements.get("lily-document-list")) {
    customElements.define("lily-document-list", DocumentList);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("DocumentList", () => {
    test("renders a native unordered list", () => {
        const host = render("<lily-document-list></lily-document-list>");

        expect(host.querySelector("ul.document-list")).toBeTruthy();
    });

    test("aria-label is omitted when label is absent", () => {
        const host = render("<lily-document-list></lily-document-list>");

        expect(host.querySelector("ul")!.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label reflects a provided label", () => {
        const host = render('<lily-document-list label="Attachments"></lily-document-list>');

        expect(host.querySelector("ul")!.getAttribute("aria-label")).toBe("Attachments");
    });

    test("moves its children into the ul", () => {
        const host = render("<lily-document-list><li>Report.pdf</li></lily-document-list>");

        expect(host.querySelector("ul > li")!.textContent).toBe("Report.pdf");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-document-list class="extra"></lily-document-list>');

        expect(host.querySelector("ul")!.className).toBe("document-list extra");
    });

    test("passes through rest attributes to the ul", () => {
        const host = render('<lily-document-list data-testid="docs"></lily-document-list>');

        expect(host.querySelector("ul")!.getAttribute("data-testid")).toBe("docs");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render("<lily-document-list></lily-document-list>");

        (host as unknown as DocumentList).connectedCallback();

        expect(host.querySelectorAll("ul").length).toBe(1);
    });
});
