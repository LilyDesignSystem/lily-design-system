import { afterEach, describe, expect, test } from "vitest";

import { SouthAfricaIdentityNumberView } from "./south-africa-identity-number-view.js";

if (!customElements.get("lily-south-africa-identity-number-view")) {
    customElements.define("lily-south-africa-identity-number-view", SouthAfricaIdentityNumberView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SouthAfricaIdentityNumberView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("south-africa-identity-number-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("South African Identity Number");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>') as unknown as SouthAfricaIdentityNumberView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("9001015008086");
        expect(host.value).toBe("9001015008086");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-south-africa-identity-number-view label="South African Identity Number" value="9001015008086"></lily-south-africa-identity-number-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
