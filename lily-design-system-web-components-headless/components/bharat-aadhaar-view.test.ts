import { afterEach, describe, expect, test } from "vitest";

import { BharatAadhaarView } from "./bharat-aadhaar-view.js";

if (!customElements.get("lily-bharat-aadhaar-view")) {
    customElements.define("lily-bharat-aadhaar-view", BharatAadhaarView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BharatAadhaarView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-bharat-aadhaar-view label="Aadhaar (आधार)" value="234567890123"></lily-bharat-aadhaar-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("bharat-aadhaar-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-bharat-aadhaar-view label="Aadhaar (आधार)" value="234567890123"></lily-bharat-aadhaar-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Aadhaar (आधार)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-bharat-aadhaar-view label="Aadhaar (आधार)" value="234567890123"></lily-bharat-aadhaar-view>') as unknown as BharatAadhaarView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("234567890123");
        expect(host.value).toBe("234567890123");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-bharat-aadhaar-view label="Aadhaar (आधार)" value="234567890123"></lily-bharat-aadhaar-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
