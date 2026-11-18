import { afterEach, describe, expect, test } from "vitest";

import { LuxembourgMatriculeView } from "./luxembourg-matricule-view.js";

if (!customElements.get("lily-luxembourg-matricule-view")) {
    customElements.define("lily-luxembourg-matricule-view", LuxembourgMatriculeView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LuxembourgMatriculeView", () => {
    test("renders a native span with the correct class", () => {
        const host = render(
            '<lily-luxembourg-matricule-view label="Numéro d\'Identification Nationale (Matricule)" value="1980010112345"></lily-luxembourg-matricule-view>',
        );

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("luxembourg-matricule-view");
    });

    test("uses label as the accessible name", () => {
        const host = render(
            '<lily-luxembourg-matricule-view label="Numéro d\'Identification Nationale (Matricule)" value="1980010112345"></lily-luxembourg-matricule-view>',
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
        ).toBe(`${"Numéro d'Identification Nationale (Matricule)"} `);
        expect(host.querySelector("span")!.hasAttribute("aria-label")).toBe(false);
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render(
            '<lily-luxembourg-matricule-view label="Numéro d\'Identification Nationale (Matricule)" value="1980010112345"></lily-luxembourg-matricule-view>',
        ) as unknown as LuxembourgMatriculeView;

        expect(
            (host.querySelector("span") as HTMLSpanElement).textContent?.replace(
                (host.querySelector("span") as HTMLSpanElement).querySelector(".screen-reader-span")
                    ?.textContent ?? "",
                "",
            ),
        ).toBe("1980010112345");
        expect(host.value).toBe("1980010112345");

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
