import { afterEach, describe, expect, test } from "vitest";

import { SlovenskoPasView } from "./slovensko-pas-view.js";

if (!customElements.get("lily-slovensko-pas-view")) {
    customElements.define("lily-slovensko-pas-view", SlovenskoPasView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlovenskoPasView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-slovensko-pas-view label="Pas"></lily-slovensko-pas-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("slovensko-pas-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slovensko-pas-view label="Pas"></lily-slovensko-pas-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Pas");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-slovensko-pas-view label="Pas" value="AB1234567"></lily-slovensko-pas-view>') as unknown as SlovenskoPasView;

        expect(host.value).toBe("AB1234567");
        expect(host.querySelector("span")!.textContent).toBe("AB1234567");

        host.value = "CD7654321";
        expect(host.querySelector("span")!.textContent).toBe("CD7654321");
        expect(host.value).toBe("CD7654321");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-slovensko-pas-view label="Pas"></lily-slovensko-pas-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
