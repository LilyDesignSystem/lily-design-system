import { afterEach, describe, expect, test } from "vitest";

import { CymruRhifYGwasanaethIechydGwladolView } from "./cymru-rhif-y-gwasanaeth-iechyd-gwladol-view.js";

if (!customElements.get("lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view")) {
    customElements.define("lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view", CymruRhifYGwasanaethIechydGwladolView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CymruRhifYGwasanaethIechydGwladolView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view label="ID"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("cymru-rhif-y-gwasanaeth-iechyd-gwladol-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view label="Rhif y Gwasanaeth Iechyd Gwladol"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Rhif y Gwasanaeth Iechyd Gwladol");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view label="ID"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view label="ID" value="943 476 5919"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-view>') as unknown as CymruRhifYGwasanaethIechydGwladolView;

        expect(host.querySelector("span")!.textContent).toBe("943 476 5919");
        expect(host.value).toBe("943 476 5919");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
