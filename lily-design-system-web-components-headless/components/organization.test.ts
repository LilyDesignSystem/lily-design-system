import { afterEach, describe, expect, test } from "vitest";

import { Organization } from "./organization.js";

if (!customElements.get("lily-organization")) {
    customElements.define("lily-organization", Organization);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Organization", () => {
    test("renders a native article", () => {
        const host = render("<lily-organization>Acme Corp</lily-organization>");

        expect(host.querySelector("article.organization")).toBeTruthy();
    });

    test("renders no aria-label when label is absent", () => {
        const host = render("<lily-organization>Acme Corp</lily-organization>");

        expect(host.querySelector("article")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-organization label="Acme Corp">Content</lily-organization>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Acme Corp");
    });

    test("moves children into the article", () => {
        const host = render("<lily-organization><h2>Acme Corp</h2></lily-organization>");

        expect(host.querySelector("article > h2")!.textContent).toBe("Acme Corp");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-organization class="extra">Content</lily-organization>');

        expect(host.querySelector("article")!.className).toBe("organization extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-organization data-testid="org">Content</lily-organization>');

        expect(host.querySelector("article")!.getAttribute("data-testid")).toBe("org");
    });
});
