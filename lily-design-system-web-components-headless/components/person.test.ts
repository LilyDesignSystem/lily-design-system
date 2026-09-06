import { afterEach, describe, expect, test } from "vitest";

import { Person } from "./person.js";

if (!customElements.get("lily-person")) {
    customElements.define("lily-person", Person);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Person", () => {
    test("renders a native article", () => {
        const host = render("<lily-person>Ada Lovelace</lily-person>");

        expect(host.querySelector("article.person")).toBeTruthy();
    });

    test("renders no aria-label when label is absent", () => {
        const host = render("<lily-person>Ada Lovelace</lily-person>");

        expect(host.querySelector("article")!.hasAttribute("aria-label")).toBe(false);
    });

    test("uses label as an aria-label override", () => {
        const host = render('<lily-person label="Ada Lovelace">Content</lily-person>');

        expect(host.querySelector("article")!.getAttribute("aria-label")).toBe("Ada Lovelace");
    });

    test("moves children into the article", () => {
        const host = render("<lily-person><h2>Ada Lovelace</h2></lily-person>");

        expect(host.querySelector("article > h2")!.textContent).toBe("Ada Lovelace");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-person class="extra">Content</lily-person>');

        expect(host.querySelector("article")!.className).toBe("person extra");
    });

    test("passes through rest attributes", () => {
        const host = render('<lily-person data-testid="person">Content</lily-person>');

        expect(host.querySelector("article")!.getAttribute("data-testid")).toBe("person");
    });
});
