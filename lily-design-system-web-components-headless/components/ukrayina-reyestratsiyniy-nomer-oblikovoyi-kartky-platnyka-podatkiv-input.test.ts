import { afterEach, describe, expect, test } from "vitest";

import { UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput } from "./ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input.js";

if (!customElements.get("lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input")) {
    customElements.define("lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input", UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input label="Реєстраційний номер облікової картки платника податків (РНОКПП)"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input");
    });

    test("always forces autocomplete to off, even if the consumer tries to override it", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input label="Реєстраційний номер облікової картки платника податків (РНОКПП)" autocomplete="on"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value from the value attribute and exposes a live value property", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value="3061219210"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input>') as unknown as UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivInput;

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("3061219210");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input label="Реєстраційний номер облікової картки платника податків (РНОКПП)" required disabled></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input label="Реєстраційний номер облікової картки платника податків (РНОКПП)"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Реєстраційний номер облікової картки платника податків (РНОКПП)");
    });
});
