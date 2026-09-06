import { afterEach, describe, expect, test } from "vitest";

import { LatvijaPersonasKodsView } from "./latvija-personas-kods-view.js";

if (!customElements.get("lily-latvija-personas-kods-view")) {
    customElements.define("lily-latvija-personas-kods-view", LatvijaPersonasKodsView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LatvijaPersonasKodsView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-latvija-personas-kods-view label="Personas kods" value="090482-11234"></lily-latvija-personas-kods-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("latvija-personas-kods-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-latvija-personas-kods-view label="Personas kods" value="090482-11234"></lily-latvija-personas-kods-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Personas kods");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-latvija-personas-kods-view label="Personas kods" value="090482-11234"></lily-latvija-personas-kods-view>') as unknown as LatvijaPersonasKodsView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("090482-11234");
        expect(host.value).toBe("090482-11234");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-latvija-personas-kods-view label="Personas kods" value="090482-11234"></lily-latvija-personas-kods-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
