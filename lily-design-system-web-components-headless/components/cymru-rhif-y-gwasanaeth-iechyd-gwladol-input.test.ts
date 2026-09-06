import { afterEach, describe, expect, test } from "vitest";

import { CymruRhifYGwasanaethIechydGwladolInput } from "./cymru-rhif-y-gwasanaeth-iechyd-gwladol-input.js";

if (!customElements.get("lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input")) {
    customElements.define("lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input", CymruRhifYGwasanaethIechydGwladolInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("CymruRhifYGwasanaethIechydGwladolInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input label="ID"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("cymru-rhif-y-gwasanaeth-iechyd-gwladol-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input label="ID" autocomplete="on"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input label="ID" value="943 476 5919"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input>') as unknown as CymruRhifYGwasanaethIechydGwladolInput;

        expect(host.value).toBe("943 476 5919");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input label="ID" required disabled></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input label="Rhif y Gwasanaeth Iechyd Gwladol"></lily-cymru-rhif-y-gwasanaeth-iechyd-gwladol-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Rhif y Gwasanaeth Iechyd Gwladol");
    });
});
