import { afterEach, describe, expect, test } from "vitest";

import { MisrAlRaqmAlQawmiView } from "./misr-al-raqm-al-qawmi-view.js";

if (!customElements.get("lily-misr-al-raqm-al-qawmi-view")) {
    customElements.define("lily-misr-al-raqm-al-qawmi-view", MisrAlRaqmAlQawmiView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("MisrAlRaqmAlQawmiView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("misr-al-raqm-al-qawmi-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("الرقم القومي (National Number)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>') as unknown as MisrAlRaqmAlQawmiView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("29001011234567");
        expect(host.value).toBe("29001011234567");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-misr-al-raqm-al-qawmi-view label="الرقم القومي (National Number)" value="29001011234567"></lily-misr-al-raqm-al-qawmi-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
