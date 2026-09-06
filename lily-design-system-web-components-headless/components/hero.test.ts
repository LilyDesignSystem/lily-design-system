import { afterEach, describe, expect, test } from "vitest";

import { Hero } from "./hero.js";

if (!customElements.get("lily-hero")) {
    customElements.define("lily-hero", Hero);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Hero", () => {
    test("renders a native section", () => {
        const host = render('<lily-hero label="Welcome">Content</lily-hero>');

        expect(host.querySelector("section.hero")).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-hero label="Welcome">Content</lily-hero>');

        expect(host.querySelector("section")!.getAttribute("aria-label")).toBe("Welcome");
    });

    test("moves children into the section", () => {
        const host = render('<lily-hero label="Welcome"><h1>Big headline</h1></lily-hero>');

        expect(host.querySelector("section > h1")!.textContent).toBe("Big headline");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-hero label="Welcome" class="extra">Content</lily-hero>');

        expect(host.querySelector("section")!.className).toBe("hero extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-hero label="Welcome" data-testid="hero">Content</lily-hero>');

        expect(host.querySelector("section")!.getAttribute("data-testid")).toBe("hero");
    });
});
