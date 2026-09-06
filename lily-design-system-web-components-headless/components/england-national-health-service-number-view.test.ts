import { afterEach, describe, expect, test } from "vitest";

import { EnglandNationalHealthServiceNumberView } from "./england-national-health-service-number-view.js";

if (!customElements.get("lily-england-national-health-service-number-view")) {
    customElements.define("lily-england-national-health-service-number-view", EnglandNationalHealthServiceNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EnglandNationalHealthServiceNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-england-national-health-service-number-view label="ID"></lily-england-national-health-service-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("england-national-health-service-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-england-national-health-service-number-view label="National Health Service Number"></lily-england-national-health-service-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("National Health Service Number");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-england-national-health-service-number-view label="ID"></lily-england-national-health-service-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-england-national-health-service-number-view label="ID" value="943 476 5919"></lily-england-national-health-service-number-view>') as unknown as EnglandNationalHealthServiceNumberView;

        expect(host.querySelector("span")!.textContent).toBe("943 476 5919");
        expect(host.value).toBe("943 476 5919");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
