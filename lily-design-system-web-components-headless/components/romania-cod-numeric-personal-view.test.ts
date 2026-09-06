import { afterEach, describe, expect, test } from "vitest";

import { RomaniaCodNumericPersonalView } from "./romania-cod-numeric-personal-view.js";

if (!customElements.get("lily-romania-cod-numeric-personal-view")) {
    customElements.define("lily-romania-cod-numeric-personal-view", RomaniaCodNumericPersonalView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RomaniaCodNumericPersonalView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-romania-cod-numeric-personal-view label="Cod Numeric Personal (CNP)"></lily-romania-cod-numeric-personal-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("romania-cod-numeric-personal-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-romania-cod-numeric-personal-view label="Cod Numeric Personal (CNP)"></lily-romania-cod-numeric-personal-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Cod Numeric Personal (CNP)");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-romania-cod-numeric-personal-view label="Cod Numeric Personal (CNP)" value="1900101221144"></lily-romania-cod-numeric-personal-view>') as unknown as RomaniaCodNumericPersonalView;

        expect(host.value).toBe("1900101221144");
        expect(host.querySelector("span")!.textContent).toBe("1900101221144");

        host.value = "2900101221159";
        expect(host.querySelector("span")!.textContent).toBe("2900101221159");
        expect(host.value).toBe("2900101221159");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-romania-cod-numeric-personal-view label="Cod Numeric Personal (CNP)"></lily-romania-cod-numeric-personal-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
