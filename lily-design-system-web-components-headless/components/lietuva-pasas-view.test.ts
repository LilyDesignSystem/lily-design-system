import { afterEach, describe, expect, test } from "vitest";

import { LietuvaPasasView } from "./lietuva-pasas-view.js";

if (!customElements.get("lily-lietuva-pasas-view")) {
    customElements.define("lily-lietuva-pasas-view", LietuvaPasasView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LietuvaPasasView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-lietuva-pasas-view label="Pasas (Passport Number)" value="12345678"></lily-lietuva-pasas-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("lietuva-pasas-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-lietuva-pasas-view label="Pasas (Passport Number)" value="12345678"></lily-lietuva-pasas-view>',
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
        ).toBe(`${"Pasas (Passport Number)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-lietuva-pasas-view label="Pasas (Passport Number)" value="12345678"></lily-lietuva-pasas-view>',
        ) as unknown as LietuvaPasasView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("12345678");
        expect(host.value).toBe("12345678");

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
