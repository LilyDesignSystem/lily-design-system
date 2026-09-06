import { afterEach, describe, expect, test } from "vitest";

import { RedOrangeYellowGreenBlueView } from "./red-orange-yellow-green-blue-view.js";

if (!customElements.get("lily-red-orange-yellow-green-blue-view")) {
    customElements.define("lily-red-orange-yellow-green-blue-view", RedOrangeYellowGreenBlueView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("RedOrangeYellowGreenBlueView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-red-orange-yellow-green-blue-view label="Risk level"></lily-red-orange-yellow-green-blue-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("red-orange-yellow-green-blue-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-red-orange-yellow-green-blue-view label="Risk level"></lily-red-orange-yellow-green-blue-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Risk level");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-red-orange-yellow-green-blue-view label="Risk level" value="yellow"></lily-red-orange-yellow-green-blue-view>') as unknown as RedOrangeYellowGreenBlueView;

        expect(host.querySelector("span")!.textContent).toBe("yellow");
        expect(host.value).toBe("yellow");

        host.value = "blue";
        expect(host.querySelector("span")!.textContent).toBe("blue");
        expect(host.value).toBe("blue");
    });

    test("defaults value to an empty string", () => {
        const host = render('<lily-red-orange-yellow-green-blue-view label="Risk level"></lily-red-orange-yellow-green-blue-view>');

        expect(host.querySelector("span")!.textContent).toBe("");
    });

    test("appends the consumer's class onto the base class", () => {
        const host = render('<lily-red-orange-yellow-green-blue-view label="Risk level" class="my-view"></lily-red-orange-yellow-green-blue-view>');

        expect(host.querySelector("span")!.className).toBe("red-orange-yellow-green-blue-view my-view");
    });
});
