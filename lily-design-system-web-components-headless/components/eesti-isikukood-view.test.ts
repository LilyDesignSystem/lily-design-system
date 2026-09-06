import { afterEach, describe, expect, test } from "vitest";

import { EestiIsikukoodView } from "./eesti-isikukood-view.js";

if (!customElements.get("lily-eesti-isikukood-view")) {
    customElements.define("lily-eesti-isikukood-view", EestiIsikukoodView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("EestiIsikukoodView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-eesti-isikukood-view label="ID"></lily-eesti-isikukood-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("eesti-isikukood-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-eesti-isikukood-view label="Isikukood"></lily-eesti-isikukood-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Isikukood");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-eesti-isikukood-view label="ID"></lily-eesti-isikukood-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-eesti-isikukood-view label="ID" value="38001085718"></lily-eesti-isikukood-view>') as unknown as EestiIsikukoodView;

        expect(host.querySelector("span")!.textContent).toBe("38001085718");
        expect(host.value).toBe("38001085718");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
