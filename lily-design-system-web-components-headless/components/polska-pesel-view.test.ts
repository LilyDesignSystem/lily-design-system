import { afterEach, describe, expect, test } from "vitest";

import { PolskaPeselView } from "./polska-pesel-view.js";

if (!customElements.get("lily-polska-pesel-view")) {
    customElements.define("lily-polska-pesel-view", PolskaPeselView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PolskaPeselView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-polska-pesel-view label="PESEL"></lily-polska-pesel-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("polska-pesel-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-polska-pesel-view label="PESEL"></lily-polska-pesel-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("PESEL");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-polska-pesel-view label="PESEL" value="44051401359"></lily-polska-pesel-view>') as unknown as PolskaPeselView;

        expect(host.value).toBe("44051401359");
        expect(host.querySelector("span")!.textContent).toBe("44051401359");

        host.value = "02070803628";
        expect(host.querySelector("span")!.textContent).toBe("02070803628");
        expect(host.value).toBe("02070803628");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-polska-pesel-view label="PESEL"></lily-polska-pesel-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
