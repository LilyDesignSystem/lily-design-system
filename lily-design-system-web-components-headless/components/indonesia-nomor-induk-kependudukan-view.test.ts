import { afterEach, describe, expect, test } from "vitest";

import { IndonesiaNomorIndukKependudukanView } from "./indonesia-nomor-induk-kependudukan-view.js";

if (!customElements.get("lily-indonesia-nomor-induk-kependudukan-view")) {
    customElements.define("lily-indonesia-nomor-induk-kependudukan-view", IndonesiaNomorIndukKependudukanView);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("IndonesiaNomorIndukKependudukanView", () => {
    test("renders a native span with the correct class", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-view label="Nomor Induk Kependudukan (NIK)" value="3171012501990001"></lily-indonesia-nomor-induk-kependudukan-view>');

        const span = host.querySelector("span") as HTMLSpanElement;
        expect(span).not.toBeNull();
        expect(span.className).toBe("indonesia-nomor-induk-kependudukan-view");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-view label="Nomor Induk Kependudukan (NIK)" value="3171012501990001"></lily-indonesia-nomor-induk-kependudukan-view>');

        expect(host.querySelector("span")!.getAttribute("aria-label")).toBe("Nomor Induk Kependudukan (NIK)");
    });

    test("seeds the initial value as textContent and exposes a live value property", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-view label="Nomor Induk Kependudukan (NIK)" value="3171012501990001"></lily-indonesia-nomor-induk-kependudukan-view>') as unknown as IndonesiaNomorIndukKependudukanView;

        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("3171012501990001");
        expect(host.value).toBe("3171012501990001");

        host.value = "changed";
        expect((host.querySelector("span") as HTMLSpanElement).textContent).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("has role=text so the identifier announces as a single unit", () => {
        const host = render('<lily-indonesia-nomor-induk-kependudukan-view label="Nomor Induk Kependudukan (NIK)" value="3171012501990001"></lily-indonesia-nomor-induk-kependudukan-view>');

        expect(host.querySelector("span")!.getAttribute("role")).toBe("text");
    });
});
