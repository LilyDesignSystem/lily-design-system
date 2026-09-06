import { afterEach, describe, expect, test } from "vitest";

import { SuomiHenkilotunnusView } from "./suomi-henkilotunnus-view.js";

if (!customElements.get("lily-suomi-henkilotunnus-view")) {
    customElements.define("lily-suomi-henkilotunnus-view", SuomiHenkilotunnusView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SuomiHenkilotunnusView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-suomi-henkilotunnus-view label="Henkilötunnus (HETU)"></lily-suomi-henkilotunnus-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("suomi-henkilotunnus-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-suomi-henkilotunnus-view label="Henkilötunnus (HETU)"></lily-suomi-henkilotunnus-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Henkilötunnus (HETU)");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-suomi-henkilotunnus-view label="Henkilötunnus (HETU)" value="131052-308T"></lily-suomi-henkilotunnus-view>') as unknown as SuomiHenkilotunnusView;

        expect(host.value).toBe("131052-308T");
        expect(host.querySelector("span")!.textContent).toBe("131052-308T");

        host.value = "010199-9021";
        expect(host.querySelector("span")!.textContent).toBe("010199-9021");
        expect(host.value).toBe("010199-9021");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-suomi-henkilotunnus-view label="Henkilötunnus (HETU)"></lily-suomi-henkilotunnus-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
