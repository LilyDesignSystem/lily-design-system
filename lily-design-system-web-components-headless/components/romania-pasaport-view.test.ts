import { afterEach, describe, expect, test } from "vitest";

import { RomaniaPasaportView } from "./romania-pasaport-view.js";

if (!customElements.get("lily-romania-pasaport-view")) {
    customElements.define("lily-romania-pasaport-view", RomaniaPasaportView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RomaniaPasaportView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-romania-pasaport-view label="Pașaport"></lily-romania-pasaport-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("romania-pasaport-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-romania-pasaport-view label="Pașaport"></lily-romania-pasaport-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Pașaport");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-romania-pasaport-view label="Pașaport" value="AB123456"></lily-romania-pasaport-view>') as unknown as RomaniaPasaportView;

        expect(host.value).toBe("AB123456");
        expect(host.querySelector("span")!.textContent).toBe("AB123456");

        host.value = "CD654321";
        expect(host.querySelector("span")!.textContent).toBe("CD654321");
        expect(host.value).toBe("CD654321");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-romania-pasaport-view label="Pașaport"></lily-romania-pasaport-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
