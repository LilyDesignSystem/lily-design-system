import { afterEach, describe, expect, test } from "vitest";

import { IslandKennitalaView } from "./island-kennitala-view.js";

if (!customElements.get("lily-island-kennitala-view")) {
    customElements.define("lily-island-kennitala-view", IslandKennitalaView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IslandKennitalaView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-island-kennitala-view label="Kennitala" value="1207904929"></lily-island-kennitala-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("island-kennitala-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-island-kennitala-view label="Kennitala" value="1207904929"></lily-island-kennitala-view>',
        );

        expect(
            host
                .querySelector("span .screen-reader-span")
                ?.textContent?.replace(
                    host
                        .querySelector("span .screen-reader-span")
                        ?.querySelector(".screen-reader-span")?.textContent ?? "",
                    "",
                ),
        ).toBe(`${"Kennitala"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-island-kennitala-view label="Kennitala" value="1207904929"></lily-island-kennitala-view>',
        ) as unknown as IslandKennitalaView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1207904929");
        expect(host.value).toBe("1207904929");

        host.value = "changed";
        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
