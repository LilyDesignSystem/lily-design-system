import { afterEach, describe, expect, test } from "vitest";

import { BrasilCartaoNacionalDeSaudeView } from "./brasil-cartao-nacional-de-saude-view.js";

if (!customElements.get("lily-brasil-cartao-nacional-de-saude-view")) {
    customElements.define("lily-brasil-cartao-nacional-de-saude-view", BrasilCartaoNacionalDeSaudeView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("BrasilCartaoNacionalDeSaudeView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-view label="Cartão Nacional de Saúde (CNS)" value="123 4567 8901 234"></lily-brasil-cartao-nacional-de-saude-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("brasil-cartao-nacional-de-saude-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-view label="Cartão Nacional de Saúde (CNS)" value="123 4567 8901 234"></lily-brasil-cartao-nacional-de-saude-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Cartão Nacional de Saúde (CNS)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-view label="Cartão Nacional de Saúde (CNS)" value="123 4567 8901 234"></lily-brasil-cartao-nacional-de-saude-view>') as unknown as BrasilCartaoNacionalDeSaudeView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("123 4567 8901 234");
        expect(host.value).toBe("123 4567 8901 234");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-brasil-cartao-nacional-de-saude-view label="Cartão Nacional de Saúde (CNS)" value="123 4567 8901 234"></lily-brasil-cartao-nacional-de-saude-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
