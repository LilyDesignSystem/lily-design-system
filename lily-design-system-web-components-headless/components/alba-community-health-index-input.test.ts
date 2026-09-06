import { afterEach, describe, expect, test } from "vitest";

import { AlbaCommunityHealthIndexInput } from "./alba-community-health-index-input.js";

if (!customElements.get("lily-alba-community-health-index-input")) {
    customElements.define("lily-alba-community-health-index-input", AlbaCommunityHealthIndexInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("AlbaCommunityHealthIndexInput", () => {
    test("renders a native input type=text with the correct class", () => {
        const host = render('<lily-alba-community-health-index-input label="ID"></lily-alba-community-health-index-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("text");
        expect(input.className).toBe("alba-community-health-index-input");
    });

    test("autocomplete is always off, even if the consumer tries to override it", () => {
        const host = render('<lily-alba-community-health-index-input label="ID" autocomplete="on"></lily-alba-community-health-index-input>');

        expect(host.querySelector("input")!.getAttribute("autocomplete")).toBe("off");
    });

    test("seeds the initial value and exposes a live value property", () => {
        const host = render('<lily-alba-community-health-index-input label="ID" value="1505850123"></lily-alba-community-health-index-input>') as unknown as AlbaCommunityHealthIndexInput;

        expect(host.value).toBe("1505850123");

        host.value = "changed";
        expect((host.querySelector("input") as HTMLInputElement).value).toBe("changed");
        expect(host.value).toBe("changed");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-alba-community-health-index-input label="ID" required disabled></lily-alba-community-health-index-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-alba-community-health-index-input label="Community Health Index"></lily-alba-community-health-index-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Community Health Index");
    });
});
