import { afterEach, describe, expect, test } from "vitest";

import { ImageCropper } from "./image-cropper.js";

if (!customElements.get("lily-image-cropper")) {
    customElements.define("lily-image-cropper", ImageCropper);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("ImageCropper", () => {
    test("renders as itself with the base class", () => {
        const host = render('<lily-image-cropper label="Crop your profile photo"><img src="a.jpg" alt="A" /></lily-image-cropper>');

        expect(host.tagName.toLowerCase()).toBe("lily-image-cropper");
        expect(host.className).toBe("image-cropper");
    });

    test("has role=application", () => {
        const host = render('<lily-image-cropper label="Crop your profile photo"></lily-image-cropper>');

        expect(host.getAttribute("role")).toBe("application");
    });

    test("uses label as the accessible name", () => {
        const host = render('<lily-image-cropper label="Crop your profile photo"></lily-image-cropper>');

        expect(host.getAttribute("aria-label")).toBe("Crop your profile photo");
    });

    test("preserves the image/overlay children in place", () => {
        const host = render('<lily-image-cropper label="Crop"><img src="a.jpg" alt="A" /></lily-image-cropper>');

        expect(host.querySelector("img")).not.toBeNull();
    });

    test("appends the consumer's class hook to the base class", () => {
        const host = render('<lily-image-cropper label="Crop" class="avatar-editor"></lily-image-cropper>');

        expect(host.className).toBe("image-cropper avatar-editor");
    });
});
