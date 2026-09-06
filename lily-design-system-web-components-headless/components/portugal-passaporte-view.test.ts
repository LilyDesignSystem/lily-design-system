import { afterEach, describe, expect, test } from "vitest";

import { PortugalPassaporteView } from "./portugal-passaporte-view.js";

if (!customElements.get("lily-portugal-passaporte-view")) {
    customElements.define("lily-portugal-passaporte-view", PortugalPassaporteView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PortugalPassaporteView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-portugal-passaporte-view label="Passaporte"></lily-portugal-passaporte-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("portugal-passaporte-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-portugal-passaporte-view label="Passaporte"></lily-portugal-passaporte-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Passaporte");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-portugal-passaporte-view label="Passaporte" value="N123456"></lily-portugal-passaporte-view>') as unknown as PortugalPassaporteView;

        expect(host.value).toBe("N123456");
        expect(host.querySelector("span")!.textContent).toBe("N123456");

        host.value = "P654321";
        expect(host.querySelector("span")!.textContent).toBe("P654321");
        expect(host.value).toBe("P654321");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-portugal-passaporte-view label="Passaporte"></lily-portugal-passaporte-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
