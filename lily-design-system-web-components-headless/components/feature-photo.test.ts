import { afterEach, describe, expect, test } from "vitest";

import { FeaturePhoto } from "./feature-photo.js";

if (!customElements.get("lily-feature-photo")) {
    customElements.define("lily-feature-photo", FeaturePhoto);
}

afterEach(() => {
    document.body.innerHTML = "";
});

function render(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.firstElementChild as HTMLElement;
}

describe("FeaturePhoto", () => {
    test("renders a figure with an img sourced from src/alt", () => {
        const host = render('<lily-feature-photo src="/dog.jpg" alt="A rescue dog"></lily-feature-photo>');

        const img = host.querySelector("img") as HTMLImageElement;
        expect(img.getAttribute("src")).toBe("/dog.jpg");
        expect(img.alt).toBe("A rescue dog");
    });

    test("defaults loading to lazy", () => {
        const host = render('<lily-feature-photo src="/dog.jpg" alt="A rescue dog"></lily-feature-photo>');

        expect((host.querySelector("img") as HTMLImageElement).loading).toBe("lazy");
    });

    test("honours an explicit eager loading value", () => {
        const host = render('<lily-feature-photo src="/dog.jpg" alt="A rescue dog" loading="eager"></lily-feature-photo>');

        expect((host.querySelector("img") as HTMLImageElement).loading).toBe("eager");
    });

    test("sets width and height when given", () => {
        const host = render('<lily-feature-photo src="/dog.jpg" alt="A rescue dog" width="640" height="480"></lily-feature-photo>');

        const img = host.querySelector("img") as HTMLImageElement;
        expect(img.width).toBe(640);
        expect(img.height).toBe(480);
    });

    test("distributes slot=caption and slot=credit children into a figcaption", () => {
        const host = render(
            '<lily-feature-photo src="/dog.jpg" alt="A rescue dog">' +
                '<span slot="caption">A rescue dog at the shelter.</span>' +
                '<span slot="credit">Photo: Jane Doe</span>' +
                "</lily-feature-photo>",
        );

        const figcaption = host.querySelector("figcaption")!;
        expect(figcaption.textContent).toContain("A rescue dog at the shelter.");
        expect(figcaption.textContent).toContain("Photo: Jane Doe");
    });

    test("renders no figcaption when neither slot is supplied", () => {
        const host = render('<lily-feature-photo src="/dog.jpg" alt="A rescue dog"></lily-feature-photo>');

        expect(host.querySelector("figcaption")).toBeNull();
    });
});
