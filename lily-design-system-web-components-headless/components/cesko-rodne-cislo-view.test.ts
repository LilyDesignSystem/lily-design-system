import { afterEach, describe, expect, test } from "vitest";

import { CeskoRodneCisloView } from "./cesko-rodne-cislo-view.js";

if (!customElements.get("lily-cesko-rodne-cislo-view")) {
    customElements.define("lily-cesko-rodne-cislo-view", CeskoRodneCisloView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CeskoRodneCisloView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-cesko-rodne-cislo-view label="ID"></lily-cesko-rodne-cislo-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("cesko-rodne-cislo-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-cesko-rodne-cislo-view label="Rodné Číslo"></lily-cesko-rodne-cislo-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Rodné Číslo");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-cesko-rodne-cislo-view label="ID"></lily-cesko-rodne-cislo-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-cesko-rodne-cislo-view label="ID" value="855323/1237"></lily-cesko-rodne-cislo-view>') as unknown as CeskoRodneCisloView;

        expect(host.querySelector("span")!.textContent).toBe("855323/1237");
        expect(host.value).toBe("855323/1237");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
