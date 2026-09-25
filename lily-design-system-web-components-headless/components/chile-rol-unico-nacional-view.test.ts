import { afterEach, describe, expect, test } from "vitest";

import { ChileRolUnicoNacionalView } from "./chile-rol-unico-nacional-view.js";

if (!customElements.get("lily-chile-rol-unico-nacional-view")) {
    customElements.define("lily-chile-rol-unico-nacional-view", ChileRolUnicoNacionalView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ChileRolUnicoNacionalView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-chile-rol-unico-nacional-view label="Rol Único Nacional (RUN)" value="12345678-K"></lily-chile-rol-unico-nacional-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("chile-rol-unico-nacional-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-chile-rol-unico-nacional-view label="Rol Único Nacional (RUN)" value="12345678-K"></lily-chile-rol-unico-nacional-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Rol Único Nacional (RUN)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-chile-rol-unico-nacional-view label="Rol Único Nacional (RUN)" value="12345678-K"></lily-chile-rol-unico-nacional-view>') as unknown as ChileRolUnicoNacionalView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("12345678-K");
        expect(host.value).toBe("12345678-K");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-chile-rol-unico-nacional-view label="Rol Único Nacional (RUN)" value="12345678-K"></lily-chile-rol-unico-nacional-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
