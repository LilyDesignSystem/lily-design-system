import { afterEach, describe, expect, test } from "vitest";

import { AlbaCommunityHealthIndexView } from "./alba-community-health-index-view.js";

if (!customElements.get("lily-alba-community-health-index-view")) {
    customElements.define("lily-alba-community-health-index-view", AlbaCommunityHealthIndexView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AlbaCommunityHealthIndexView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-alba-community-health-index-view label="ID"></lily-alba-community-health-index-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("alba-community-health-index-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-alba-community-health-index-view label="Community Health Index"></lily-alba-community-health-index-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Community Health Index");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-alba-community-health-index-view label="ID"></lily-alba-community-health-index-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-alba-community-health-index-view label="ID" value="1505850123"></lily-alba-community-health-index-view>') as unknown as AlbaCommunityHealthIndexView;

        expect(host.querySelector("span")!.textContent).toBe("1505850123");
        expect(host.value).toBe("1505850123");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
