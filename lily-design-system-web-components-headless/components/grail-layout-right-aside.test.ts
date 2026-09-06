import { afterEach, describe, expect, test } from "vitest";

import { GrailLayoutRightAside } from "./grail-layout-right-aside.js";

if (!customElements.get("lily-grail-layout-right-aside")) {
    customElements.define("lily-grail-layout-right-aside", GrailLayoutRightAside);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GrailLayoutRightAside", () => {
    test("renders a native aside", () => {
        const host = render("<lily-grail-layout-right-aside>Related links</lily-grail-layout-right-aside>");

        expect(host.querySelector("aside.grail-layout-right-aside")).toBeTruthy();
    });

    test("moves children into the aside", () => {
        const host = render("<lily-grail-layout-right-aside><nav>Nav</nav></lily-grail-layout-right-aside>");

        expect(host.querySelector("aside > nav")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-grail-layout-right-aside class="extra">Content</lily-grail-layout-right-aside>');

        expect(host.querySelector("aside")!.className).toBe("grail-layout-right-aside extra");
    });

    test("passes through rest attributes, including aria-label", () => {
        const host = render('<lily-grail-layout-right-aside aria-label="Related links">Content</lily-grail-layout-right-aside>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Related links");
    });

    test("passes through arbitrary data attributes", () => {
        const host = render('<lily-grail-layout-right-aside data-testid="aside">Content</lily-grail-layout-right-aside>');

        expect(host.querySelector("aside")!.getAttribute("data-testid")).toBe("aside");
    });
});
