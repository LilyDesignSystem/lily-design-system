import { afterEach, describe, expect, test } from "vitest";

import { ItaliaCodiceFiscaleView } from "./italia-codice-fiscale-view.js";

if (!customElements.get("lily-italia-codice-fiscale-view")) {
    customElements.define("lily-italia-codice-fiscale-view", ItaliaCodiceFiscaleView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ItaliaCodiceFiscaleView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-italia-codice-fiscale-view label="Codice Fiscale" value="RSSMRA85M01H501Z"></lily-italia-codice-fiscale-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("italia-codice-fiscale-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-italia-codice-fiscale-view label="Codice Fiscale" value="RSSMRA85M01H501Z"></lily-italia-codice-fiscale-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Codice Fiscale");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-italia-codice-fiscale-view label="Codice Fiscale" value="RSSMRA85M01H501Z"></lily-italia-codice-fiscale-view>') as unknown as ItaliaCodiceFiscaleView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("RSSMRA85M01H501Z");
        expect(host.value).toBe("RSSMRA85M01H501Z");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-italia-codice-fiscale-view label="Codice Fiscale" value="RSSMRA85M01H501Z"></lily-italia-codice-fiscale-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
