import { afterEach, describe, expect, test } from "vitest";

import { RossiyaSnilsView } from "./rossiya-snils-view.js";

if (!customElements.get("lily-rossiya-snils-view")) {
    customElements.define("lily-rossiya-snils-view", RossiyaSnilsView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RossiyaSnilsView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-rossiya-snils-view label="СНИЛС (SNILS)" value="112-233-445 95"></lily-rossiya-snils-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("rossiya-snils-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-rossiya-snils-view label="СНИЛС (SNILS)" value="112-233-445 95"></lily-rossiya-snils-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("СНИЛС (SNILS)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-rossiya-snils-view label="СНИЛС (SNILS)" value="112-233-445 95"></lily-rossiya-snils-view>') as unknown as RossiyaSnilsView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("112-233-445 95");
        expect(host.value).toBe("112-233-445 95");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-rossiya-snils-view label="СНИЛС (SNILS)" value="112-233-445 95"></lily-rossiya-snils-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
