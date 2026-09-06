import { afterEach, describe, expect, test } from "vitest";

import { ElladaDematerialisedSecuritiesSystemInput } from "./ellada-dematerialised-securities-system-input.js";

if (!customElements.get("lily-ellada-dematerialised-securities-system-input")) {
    customElements.define("lily-ellada-dematerialised-securities-system-input", ElladaDematerialisedSecuritiesSystemInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ElladaDematerialisedSecuritiesSystemInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-input label="ID"></lily-ellada-dematerialised-securities-system-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("ellada-dematerialised-securities-system-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-input label="ID" autocomplete="on"></lily-ellada-dematerialised-securities-system-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-input label="ID" value="1234567890"></lily-ellada-dematerialised-securities-system-input>') as unknown as ElladaDematerialisedSecuritiesSystemInput;

        expect(host.value).toBe("1234567890");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-input label="ID" required disabled></lily-ellada-dematerialised-securities-system-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-ellada-dematerialised-securities-system-input label="Dematerialised Securities System"></lily-ellada-dematerialised-securities-system-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Dematerialised Securities System");
    });
});
