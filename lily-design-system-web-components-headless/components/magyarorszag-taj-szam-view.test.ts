import { afterEach, describe, expect, test } from "vitest";

import { MagyarorszagTajSzamView } from "./magyarorszag-taj-szam-view.js";

if (!customElements.get("lily-magyarorszag-taj-szam-view")) {
    customElements.define("lily-magyarorszag-taj-szam-view", MagyarorszagTajSzamView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MagyarorszagTajSzamView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-magyarorszag-taj-szam-view label="Társadalombiztosítási Azonosító Jel (TAJ)" value="123 456 789"></lily-magyarorszag-taj-szam-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("magyarorszag-taj-szam-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-magyarorszag-taj-szam-view label="Társadalombiztosítási Azonosító Jel (TAJ)" value="123 456 789"></lily-magyarorszag-taj-szam-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Társadalombiztosítási Azonosító Jel (TAJ)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-magyarorszag-taj-szam-view label="Társadalombiztosítási Azonosító Jel (TAJ)" value="123 456 789"></lily-magyarorszag-taj-szam-view>') as unknown as MagyarorszagTajSzamView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123 456 789");
        expect(host.value).toBe("123 456 789");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-magyarorszag-taj-szam-view label="Társadalombiztosítási Azonosító Jel (TAJ)" value="123 456 789"></lily-magyarorszag-taj-szam-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
