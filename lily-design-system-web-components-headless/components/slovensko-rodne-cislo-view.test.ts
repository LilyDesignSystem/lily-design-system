import { afterEach, describe, expect, test } from "vitest";

import { SlovenskoRodneCisloView } from "./slovensko-rodne-cislo-view.js";

if (!customElements.get("lily-slovensko-rodne-cislo-view")) {
    customElements.define("lily-slovensko-rodne-cislo-view", SlovenskoRodneCisloView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SlovenskoRodneCisloView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-slovensko-rodne-cislo-view label="Rodné číslo (RČ)"></lily-slovensko-rodne-cislo-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("slovensko-rodne-cislo-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-slovensko-rodne-cislo-view label="Rodné číslo (RČ)"></lily-slovensko-rodne-cislo-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Rodné číslo (RČ)");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-slovensko-rodne-cislo-view label="Rodné číslo (RČ)" value="9606234816"></lily-slovensko-rodne-cislo-view>') as unknown as SlovenskoRodneCisloView;

        expect(host.value).toBe("9606234816");
        expect(host.querySelector("span")!.textContent).toBe("9606234816");

        host.value = "0055998273";
        expect(host.querySelector("span")!.textContent).toBe("0055998273");
        expect(host.value).toBe("0055998273");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-slovensko-rodne-cislo-view label="Rodné číslo (RČ)"></lily-slovensko-rodne-cislo-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
