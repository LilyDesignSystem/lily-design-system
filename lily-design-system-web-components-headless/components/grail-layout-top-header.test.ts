import { afterEach, describe, expect, test } from "vitest";

import { GrailLayoutTopHeader } from "./grail-layout-top-header.js";

if (!customElements.get("lily-grail-layout-top-header")) {
    customElements.define("lily-grail-layout-top-header", GrailLayoutTopHeader);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GrailLayoutTopHeader", () => {
    test("renders a native header", () => {
        const host = render("<lily-grail-layout-top-header>Site header</lily-grail-layout-top-header>");

        expect(host.querySelector("header.grail-layout-top-header")).toBeTruthy();
    });

    test("moves children into the header", () => {
        const host = render("<lily-grail-layout-top-header><nav>Nav</nav></lily-grail-layout-top-header>");

        expect(host.querySelector("header > nav")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-grail-layout-top-header class="extra">Content</lily-grail-layout-top-header>');

        expect(host.querySelector("header")!.className).toBe("grail-layout-top-header extra");
    });

    test("passes through rest attributes, including aria-label", () => {
        const host = render('<lily-grail-layout-top-header aria-label="Site header">Content</lily-grail-layout-top-header>');

        expect(host.querySelector("header")!.getAttribute("aria-label")).toBe("Site header");
    });

    test("passes through arbitrary data attributes", () => {
        const host = render('<lily-grail-layout-top-header data-testid="header">Content</lily-grail-layout-top-header>');

        expect(host.querySelector("header")!.getAttribute("data-testid")).toBe("header");
    });
});
