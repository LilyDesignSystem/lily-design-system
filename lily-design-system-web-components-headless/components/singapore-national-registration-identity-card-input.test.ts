import { afterEach, describe, expect, test } from "vitest";

import { SingaporeNationalRegistrationIdentityCardInput } from "./singapore-national-registration-identity-card-input.js";

if (!customElements.get("lily-singapore-national-registration-identity-card-input")) {
    customElements.define("lily-singapore-national-registration-identity-card-input", SingaporeNationalRegistrationIdentityCardInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SingaporeNationalRegistrationIdentityCardInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-singapore-national-registration-identity-card-input label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)"></lily-singapore-national-registration-identity-card-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("singapore-national-registration-identity-card-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-singapore-national-registration-identity-card-input label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" autocomplete="on"></lily-singapore-national-registration-identity-card-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-singapore-national-registration-identity-card-input label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" value="S1234567D"></lily-singapore-national-registration-identity-card-input>') as unknown as SingaporeNationalRegistrationIdentityCardInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("S1234567D");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-singapore-national-registration-identity-card-input label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)" required disabled></lily-singapore-national-registration-identity-card-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-singapore-national-registration-identity-card-input label="National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)"></lily-singapore-national-registration-identity-card-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("National Registration Identity Card Number / Foreign Identification Number (NRIC/FIN)");
    });
});
