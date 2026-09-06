import { afterEach, describe, expect, test } from "vitest";

import { LietuvaAsmensKodasView } from "./lietuva-asmens-kodas-view.js";

if (!customElements.get("lily-lietuva-asmens-kodas-view")) {
    customElements.define("lily-lietuva-asmens-kodas-view", LietuvaAsmensKodasView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("LietuvaAsmensKodasView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-lietuva-asmens-kodas-view label="Asmens kodas" value="38801234567"></lily-lietuva-asmens-kodas-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("lietuva-asmens-kodas-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-lietuva-asmens-kodas-view label="Asmens kodas" value="38801234567"></lily-lietuva-asmens-kodas-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Asmens kodas");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-lietuva-asmens-kodas-view label="Asmens kodas" value="38801234567"></lily-lietuva-asmens-kodas-view>') as unknown as LietuvaAsmensKodasView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("38801234567");
        expect(host.value).toBe("38801234567");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-lietuva-asmens-kodas-view label="Asmens kodas" value="38801234567"></lily-lietuva-asmens-kodas-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
