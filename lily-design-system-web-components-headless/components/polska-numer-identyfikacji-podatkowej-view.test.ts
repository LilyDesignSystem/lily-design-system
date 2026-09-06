import { afterEach, describe, expect, test } from "vitest";

import { PolskaNumerIdentyfikacjiPodatkowejView } from "./polska-numer-identyfikacji-podatkowej-view.js";

if (!customElements.get("lily-polska-numer-identyfikacji-podatkowej-view")) {
    customElements.define("lily-polska-numer-identyfikacji-podatkowej-view", PolskaNumerIdentyfikacjiPodatkowejView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("PolskaNumerIdentyfikacjiPodatkowejView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-view label="Numer Identyfikacji Podatkowej (NIP)"></lily-polska-numer-identyfikacji-podatkowej-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("polska-numer-identyfikacji-podatkowej-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-view label="Numer Identyfikacji Podatkowej (NIP)"></lily-polska-numer-identyfikacji-podatkowej-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Numer Identyfikacji Podatkowej (NIP)");
    });

    test("seeds the initial value as text content and exposes a live value property", () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-view label="Numer Identyfikacji Podatkowej (NIP)" value="1234563218"></lily-polska-numer-identyfikacji-podatkowej-view>') as unknown as PolskaNumerIdentyfikacjiPodatkowejView;

        expect(host.value).toBe("1234563218");
        expect(host.querySelector("span")!.textContent).toBe("1234563218");

        host.value = "5252445218";
        expect(host.querySelector("span")!.textContent).toBe("5252445218");
        expect(host.value).toBe("5252445218");
    });

    test('sets role="text" so the identifier announces as a single unit', () => {
        const host = render('<lily-polska-numer-identyfikacji-podatkowej-view label="Numer Identyfikacji Podatkowej (NIP)"></lily-polska-numer-identyfikacji-podatkowej-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
