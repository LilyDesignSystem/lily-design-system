import { afterEach, describe, expect, test } from "vitest";

import { FranceNumeroDIdentificationAuRepertoireView } from "./france-numero-d-identification-au-repertoire-view.js";

if (!customElements.get("lily-france-numero-d-identification-au-repertoire-view")) {
    customElements.define("lily-france-numero-d-identification-au-repertoire-view", FranceNumeroDIdentificationAuRepertoireView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FranceNumeroDIdentificationAuRepertoireView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-view label="ID"></lily-france-numero-d-identification-au-repertoire-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("france-numero-d-identification-au-repertoire-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-view label="Numéro d\'Identification au Répertoire"></lily-france-numero-d-identification-au-repertoire-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Numéro d'Identification au Répertoire");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-france-numero-d-identification-au-repertoire-view label="ID" value="1 85 05 75 116 001 23"></lily-france-numero-d-identification-au-repertoire-view>') as unknown as FranceNumeroDIdentificationAuRepertoireView;

        expect(host.querySelector("span")!.textContent).toBe("1 85 05 75 116 001 23");
        expect(host.value).toBe("1 85 05 75 116 001 23");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
