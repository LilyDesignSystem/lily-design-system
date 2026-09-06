import { afterEach, describe, expect, test } from "vitest";

import { RelatedContent } from "./related-content.js";

if (!customElements.get("lily-related-content")) {
    customElements.define("lily-related-content", RelatedContent);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RelatedContent", () => {
    test("renders a native aside", () => {
        const host = render('<lily-related-content label="Related guidance"></lily-related-content>');

        const aside = host.querySelector("aside.related-content");
        expect(aside).toBeTruthy();
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-related-content label="Related guidance"></lily-related-content>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Related guidance");
    });

    test("moves its children into the aside", () => {
        const host = render(
            '<lily-related-content label="Related guidance"><ul><li><a href="/a">Guide A</a></li></ul></lily-related-content>',
        );

        expect(host.querySelector("aside > ul")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-related-content label="Related guidance" class="extra"></lily-related-content>');

        expect(host.querySelector("aside")!.className).toBe("related-content extra");
    });

    test("passes through rest attributes to the aside", () => {
        const host = render('<lily-related-content label="Related guidance" data-testid="rc"></lily-related-content>');

        expect(host.querySelector("aside")!.getAttribute("data-testid")).toBe("rc");
    });
});
