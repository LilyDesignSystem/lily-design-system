import { afterEach, describe, expect, test } from "vitest";

import { Header } from "./header.js";

if (!customElements.get("lily-header")) {
    customElements.define("lily-header", Header);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Header", () => {
    test("renders a native header", () => {
        const host = render("<lily-header>Site title</lily-header>");

        expect(host.querySelector("header.header")).toBeTruthy();
    });

    test("renders no aria-label when label is absent", () => {
        const host = render("<lily-header>Site title</lily-header>");

        expect(host.querySelector("header")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-header label="Site header">Site title</lily-header>');

        expect(host.querySelector("header")!.getAttribute("aria-label")).toBe("Site header");
    });

    test("moves children into the header", () => {
        const host = render("<lily-header><h1>Site title</h1></lily-header>");

        expect(host.querySelector("header > h1")!.textContent).toBe("Site title");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-header class="extra">Content</lily-header>');

        expect(host.querySelector("header")!.className).toBe("header extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-header data-testid="header">Content</lily-header>');

        expect(host.querySelector("header")!.getAttribute("data-testid")).toBe("header");
    });
});
