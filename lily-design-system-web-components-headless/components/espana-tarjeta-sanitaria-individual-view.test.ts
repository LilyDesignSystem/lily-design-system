import { afterEach, describe, expect, test } from "vitest";

import { EspanaTarjetaSanitariaIndividualView } from "./espana-tarjeta-sanitaria-individual-view.js";

if (!customElements.get("lily-espana-tarjeta-sanitaria-individual-view")) {
    customElements.define("lily-espana-tarjeta-sanitaria-individual-view", EspanaTarjetaSanitariaIndividualView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EspanaTarjetaSanitariaIndividualView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-view label="ID"></lily-espana-tarjeta-sanitaria-individual-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("espana-tarjeta-sanitaria-individual-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-view label="Tarjeta Sanitaria Individual"></lily-espana-tarjeta-sanitaria-individual-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Tarjeta Sanitaria Individual");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-espana-tarjeta-sanitaria-individual-view label="ID" value="AA1234567"></lily-espana-tarjeta-sanitaria-individual-view>') as unknown as EspanaTarjetaSanitariaIndividualView;

        expect(host.querySelector("span")!.textContent).toBe("AA1234567");
        expect(host.value).toBe("AA1234567");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
