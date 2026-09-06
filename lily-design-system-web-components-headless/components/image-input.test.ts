import { afterEach, describe, expect, test } from "vitest";

import { ImageInput } from "./image-input.js";

if (!customElements.get("lily-image-input")) {
    customElements.define("lily-image-input", ImageInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ImageInput", () => {
    test("renders a native input type=image", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit"></lily-image-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("image");
    });

    test("sets src from the src attribute", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit"></lily-image-input>');

        expect((host.querySelector("input") as HTMLInputElement).src).toContain("submit.png");
    });

    test("uses alt (not aria-label) as the accessible name", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit"></lily-image-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.alt).toBe("Submit");
        expect(input.hasAttribute("aria-label")).toBe(false);
    });

    test("width and height propagate to the inner input", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit" width="64" height="32"></lily-image-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.width).toBe(64);
        expect(input.height).toBe(32);
    });

    test("disabled propagates to the inner input", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit" disabled></lily-image-input>');

        expect((host.querySelector("input") as HTMLInputElement).disabled).toBe(true);
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit" class="my-extra"></lily-image-input>');

        expect(host.querySelector("input")!.className).toBe("image-input my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render('<lily-image-input src="submit.png" alt="Submit" id="submit-image"></lily-image-input>');

        expect(host.querySelector("input")!.id).toBe("submit-image");
    });
});
