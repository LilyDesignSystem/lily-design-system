import { afterEach, describe, expect, test } from "vitest";

import { YisraelTeudatZehutView } from "./yisrael-teudat-zehut-view.js";

if (!customElements.get("lily-yisrael-teudat-zehut-view")) {
    customElements.define("lily-yisrael-teudat-zehut-view", YisraelTeudatZehutView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("YisraelTeudatZehutView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-yisrael-teudat-zehut-view label="Teudat Zehut (תעודת זהות)" value="123456782"></lily-yisrael-teudat-zehut-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("yisrael-teudat-zehut-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-yisrael-teudat-zehut-view label="Teudat Zehut (תעודת זהות)" value="123456782"></lily-yisrael-teudat-zehut-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Teudat Zehut (תעודת זהות)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-yisrael-teudat-zehut-view label="Teudat Zehut (תעודת זהות)" value="123456782"></lily-yisrael-teudat-zehut-view>') as unknown as YisraelTeudatZehutView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123456782");
        expect(host.value).toBe("123456782");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-yisrael-teudat-zehut-view label="Teudat Zehut (תעודת זהות)" value="123456782"></lily-yisrael-teudat-zehut-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
