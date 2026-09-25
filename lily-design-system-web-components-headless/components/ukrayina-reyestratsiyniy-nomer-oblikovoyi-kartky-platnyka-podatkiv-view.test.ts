import { afterEach, describe, expect, test } from "vitest";

import { UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView } from "./ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view.js";

if (!customElements.get("lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view")) {
    customElements.define("lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view", UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value="3061219210"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value="3061219210"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Реєстраційний номер облікової картки платника податків (РНОКПП)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value="3061219210"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view>') as unknown as UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("3061219210");
        expect(host.value).toBe("3061219210");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view label="Реєстраційний номер облікової картки платника податків (РНОКПП)" value="3061219210"></lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
