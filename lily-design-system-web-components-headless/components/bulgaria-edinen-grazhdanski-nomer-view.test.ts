import { afterEach, describe, expect, test } from "vitest";

import { BulgariaEdinenGrazhdanskiNomerView } from "./bulgaria-edinen-grazhdanski-nomer-view.js";

if (!customElements.get("lily-bulgaria-edinen-grazhdanski-nomer-view")) {
    customElements.define("lily-bulgaria-edinen-grazhdanski-nomer-view", BulgariaEdinenGrazhdanskiNomerView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BulgariaEdinenGrazhdanskiNomerView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-view label="ID"></lily-bulgaria-edinen-grazhdanski-nomer-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("bulgaria-edinen-grazhdanski-nomer-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-view label="Edinen Grazhdanski Nomer"></lily-bulgaria-edinen-grazhdanski-nomer-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Edinen Grazhdanski Nomer");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-view label="ID"></lily-bulgaria-edinen-grazhdanski-nomer-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-bulgaria-edinen-grazhdanski-nomer-view label="ID" value="7523169263"></lily-bulgaria-edinen-grazhdanski-nomer-view>') as unknown as BulgariaEdinenGrazhdanskiNomerView;

        expect(host.querySelector("span")!.textContent).toBe("7523169263");
        expect(host.value).toBe("7523169263");

        host.value = "changed";
        expect(host.querySelector("span")!.textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });
});
