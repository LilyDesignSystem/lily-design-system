import { afterEach, describe, expect, test } from "vitest";

import { YisraelTeudatZehutInput } from "./yisrael-teudat-zehut-input.js";

if (!customElements.get("lily-yisrael-teudat-zehut-input")) {
    customElements.define("lily-yisrael-teudat-zehut-input", YisraelTeudatZehutInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("YisraelTeudatZehutInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-yisrael-teudat-zehut-input label="Teudat Zehut (תעודת זהות)"></lily-yisrael-teudat-zehut-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("yisrael-teudat-zehut-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-yisrael-teudat-zehut-input label="Teudat Zehut (תעודת זהות)" autocomplete="on"></lily-yisrael-teudat-zehut-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-yisrael-teudat-zehut-input label="Teudat Zehut (תעודת זהות)" value="123456782"></lily-yisrael-teudat-zehut-input>') as unknown as YisraelTeudatZehutInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("123456782");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-yisrael-teudat-zehut-input label="Teudat Zehut (תעודת זהות)" required disabled></lily-yisrael-teudat-zehut-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-yisrael-teudat-zehut-input label="Teudat Zehut (תעודת זהות)"></lily-yisrael-teudat-zehut-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Teudat Zehut (תעודת זהות)");
    });
});
