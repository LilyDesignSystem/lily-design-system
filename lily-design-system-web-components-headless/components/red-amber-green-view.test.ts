import { afterEach, describe, expect, test } from "vitest";

import { RedAmberGreenView } from "./red-amber-green-view.js";

if (!customElements.get("lily-red-amber-green-view")) {
    customElements.define("lily-red-amber-green-view", RedAmberGreenView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedAmberGreenView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-red-amber-green-view label="Project status"></lily-red-amber-green-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("red-amber-green-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-red-amber-green-view label="Project status"></lily-red-amber-green-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Project status");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-red-amber-green-view label="Project status" value="green"></lily-red-amber-green-view>') as unknown as RedAmberGreenView;

        expect(host.querySelector("span")!.textContent).toBe("green");
        expect(host.value).toBe("green");

        host.value = "red";
        expect(host.querySelector("span")!.textContent).toBe("red");
        expect(host.value).toBe("red");
    });

    test("defaults value to an empty string", () => {
        const host = render('<lily-red-amber-green-view label="Project status"></lily-red-amber-green-view>');

        expect(host.querySelector("span")!.textContent).toBe("");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-red-amber-green-view label="Project status" class="my-view"></lily-red-amber-green-view>');

        expect(host.querySelector("span")!.className).toBe("red-amber-green-view my-view");
    });
});
