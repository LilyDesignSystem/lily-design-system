import { afterEach, describe, expect, test } from "vitest";

import { SearchInput } from "./search-input.js";

if (!customElements.get("lily-search-input")) {
    customElements.define("lily-search-input", SearchInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("SearchInput", () => {
    test("renders a native input type=search", () => {
        const host = render('<lily-search-input label="Search"></lily-search-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("search");
    });

    test("has role=searchbox", () => {
        const host = render('<lily-search-input label="Search"></lily-search-input>');

        expect(host.querySelector("input")!.getAttribute("role")).toBe("searchbox");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-search-input label="Search"></lily-search-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Search");
    });

    test("seeds the initial value from the value attribute", () => {
        const host = render('<lily-search-input label="Search" value="cats"></lily-search-input>');

        expect((host.querySelector("input") as HTMLInputElement).value).toBe("cats");
    });

    test("exposes a live value property proxying the inner input", () => {
        const host = render('<lily-search-input label="Search"></lily-search-input>') as unknown as SearchInput;
        const input = host.querySelector("input") as HTMLInputElement;

        host.value = "dogs";

        expect(input.value).toBe("dogs");
        expect(host.value).toBe("dogs");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-search-input label="Search" required disabled></lily-search-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("passes through rest attributes such as placeholder", () => {
        const host = render('<lily-search-input label="Search" placeholder="e.g. cats"></lily-search-input>');

        expect(host.querySelector("input")!.getAttribute("placeholder")).toBe("e.g. cats");
    });
});
