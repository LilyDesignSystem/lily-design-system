import { afterEach, describe, expect, test } from "vitest";

import { SingaporeNationalRegistrationIdentityCardView } from "./singapore-national-registration-identity-card-view.js";

if (!customElements.get("lily-singapore-national-registration-identity-card-view")) {
    customElements.define("lily-singapore-national-registration-identity-card-view", SingaporeNationalRegistrationIdentityCardView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SingaporeNationalRegistrationIdentityCardView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-singapore-national-registration-identity-card-view label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value="S1234567D"></lily-singapore-national-registration-identity-card-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("singapore-national-registration-identity-card-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-singapore-national-registration-identity-card-view label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value="S1234567D"></lily-singapore-national-registration-identity-card-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-singapore-national-registration-identity-card-view label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value="S1234567D"></lily-singapore-national-registration-identity-card-view>') as unknown as SingaporeNationalRegistrationIdentityCardView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("S1234567D");
        expect(host.value).toBe("S1234567D");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-singapore-national-registration-identity-card-view label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value="S1234567D"></lily-singapore-national-registration-identity-card-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
