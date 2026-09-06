import { afterEach, describe, expect, test } from "vitest";

import { ImageFileInput } from "./image-file-input.js";

if (!customElements.get("lily-image-file-input")) {
    customElements.define("lily-image-file-input", ImageFileInput);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ImageFileInput", () => {
    test("renders a native input type=file", () => {
        const host = render('<lily-image-file-input label="Profile photo"></lily-image-file-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.type).toBe("file");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-image-file-input label="Profile photo"></lily-image-file-input>');

        expect(host.querySelector("input")!.getAttribute("aria-label")).toBe("Profile photo");
    });

    test("defaults accept to image/*", () => {
        const host = render('<lily-image-file-input label="Profile photo"></lily-image-file-input>');

        expect((host.querySelector("input") as HTMLInputElement).accept).toBe("image/*");
    });

    test("accept can be narrowed", () => {
        const host = render(
            '<lily-image-file-input label="Profile photo" accept="image/png, image/jpeg"></lily-image-file-input>',
        );

        expect((host.querySelector("input") as HTMLInputElement).accept).toBe("image/png, image/jpeg");
    });

    test("required and disabled propagate to the inner input", () => {
        const host = render('<lily-image-file-input label="Profile photo" required disabled></lily-image-file-input>');

        const input = host.querySelector("input") as HTMLInputElement;
        expect(input.required).toBe(true);
        expect(input.disabled).toBe(true);
    });

    test("the consumer's class is appended to the base class", () => {
        const host = render('<lily-image-file-input label="Profile photo" class="my-extra"></lily-image-file-input>');

        expect(host.querySelector("input")!.className).toBe("image-file-input my-extra");
    });

    test("passes through rest attributes such as id", () => {
        const host = render('<lily-image-file-input label="Profile photo" id="avatar-input"></lily-image-file-input>');

        expect(host.querySelector("input")!.id).toBe("avatar-input");
    });
});
