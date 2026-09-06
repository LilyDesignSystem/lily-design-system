import { afterEach, describe, expect, test } from "vitest";

import { Image } from "./image.js";

if (!customElements.get("lily-image")) {
    customElements.define("lily-image", Image);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("Image", () => {
    test("renders a plain img when no caption is provided", () => {
        const host = render('<lily-image src="/photo.jpg" alt="A sunset over the ocean"></lily-image>');

        const img = host.querySelector("img") as HTMLImageElement;
        expect(img.className).toBe("image");
        expect(img.getAttribute("src")).toBe("/photo.jpg");
        expect(img.alt).toBe("A sunset over the ocean");
        expect(host.querySelector("figure")).toBeNull();
    });

    test("renders a figure with figcaption when caption is provided", () => {
        const host = render('<lily-image src="/photo.jpg" alt="A sunset" caption="Photo by Jane Doe"></lily-image>');

        const figure = host.querySelector("figure")!;
        expect(figure.className).toBe("image");
        expect(figure.querySelector("img")!.alt).toBe("A sunset");
        expect(figure.querySelector("figcaption")!.textContent).toBe("Photo by Jane Doe");
    });

    test("propagates the loading attribute in both branches", () => {
        const withoutCaption = render('<lily-image src="/a.jpg" alt="A" loading="lazy"></lily-image>');
        expect(withoutCaption.querySelector("img")!.getAttribute("loading")).toBe("lazy");

        const withCaption = render('<lily-image src="/a.jpg" alt="A" caption="Caption" loading="eager"></lily-image>');
        expect(withCaption.querySelector("img")!.getAttribute("loading")).toBe("eager");
    });

    test("root class hook includes the consumer's class attribute", () => {
        const host = render('<lily-image src="/a.jpg" alt="A" class="wide"></lily-image>');

        expect(host.querySelector("img")!.className).toBe("image wide");
    });

    test("is idempotent if connectedCallback runs more than once", () => {
        const host = render('<lily-image src="/a.jpg" alt="A"></lily-image>');

        (host as unknown as Image).connectedCallback();

        expect(host.querySelectorAll("img").length).toBe(1);
    });
});
