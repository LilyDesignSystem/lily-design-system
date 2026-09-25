import { afterEach, describe, expect, test } from "vitest";

import { OsterreichSozialversicherungsnummerView } from "./osterreich-sozialversicherungsnummer-view.js";

if (!customElements.get("lily-osterreich-sozialversicherungsnummer-view")) {
    customElements.define("lily-osterreich-sozialversicherungsnummer-view", OsterreichSozialversicherungsnummerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("OsterreichSozialversicherungsnummerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-view label="Sozialversicherungsnummer (SVNR)" value="1234 010180"></lily-osterreich-sozialversicherungsnummer-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("osterreich-sozialversicherungsnummer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-view label="Sozialversicherungsnummer (SVNR)" value="1234 010180"></lily-osterreich-sozialversicherungsnummer-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Sozialversicherungsnummer (SVNR)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-view label="Sozialversicherungsnummer (SVNR)" value="1234 010180"></lily-osterreich-sozialversicherungsnummer-view>') as unknown as OsterreichSozialversicherungsnummerView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("1234 010180");
        expect(host.value).toBe("1234 010180");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-osterreich-sozialversicherungsnummer-view label="Sozialversicherungsnummer (SVNR)" value="1234 010180"></lily-osterreich-sozialversicherungsnummer-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
