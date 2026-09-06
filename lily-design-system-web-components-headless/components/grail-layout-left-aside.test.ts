import { afterEach, describe, expect, test } from "vitest";

import { GrailLayoutLeftAside } from "./grail-layout-left-aside.js";

if (!customElements.get("lily-grail-layout-left-aside")) {
    customElements.define("lily-grail-layout-left-aside", GrailLayoutLeftAside);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("GrailLayoutLeftAside", () => {
    test("renders a native aside", () => {
        const host = render("<lily-grail-layout-left-aside>Filters</lily-grail-layout-left-aside>");

        expect(host.querySelector("aside.grail-layout-left-aside")).toBeTruthy();
    });

    test("moves children into the aside", () => {
        const host = render("<lily-grail-layout-left-aside><nav>Nav</nav></lily-grail-layout-left-aside>");

        expect(host.querySelector("aside > nav")).toBeTruthy();
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-grail-layout-left-aside class="extra">Content</lily-grail-layout-left-aside>');

        expect(host.querySelector("aside")!.className).toBe("grail-layout-left-aside extra");
    });

    test("passes through rest attributes, including aria-label", () => {
        const host = render('<lily-grail-layout-left-aside aria-label="Filters">Content</lily-grail-layout-left-aside>');

        expect(host.querySelector("aside")!.getAttribute("aria-label")).toBe("Filters");
    });

    test("passes through arbitrary data attributes", () => {
        const host = render('<lily-grail-layout-left-aside data-testid="aside">Content</lily-grail-layout-left-aside>');

        expect(host.querySelector("aside")!.getAttribute("data-testid")).toBe("aside");
    });
});
