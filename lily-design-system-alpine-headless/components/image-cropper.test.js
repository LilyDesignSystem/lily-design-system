// image-cropper.test.js
// ImageCropper component test (vitest + jsdom + Alpine)
import { describe, it, expect, vi } from "vitest";
import { mount, tick } from "../test/mount.js";

const el = () => document.querySelector("div.image-cropper");

describe("ImageCropper", () => {
    it("renders the element with its base class", async () => {
        await mount("image-cropper");
        expect(el()).not.toBeNull();
        expect(el().classList.contains("image-cropper")).toBe(true);
    });

    it("is a named application", async () => {
        await mount("image-cropper");
        expect(document.querySelector("div.image-cropper").getAttribute("role")).toBe(
            "application",
        );
    });
    it("Alt+ArrowLeft narrows the crop", async () => {
        await mount("image-cropper");
        const root = document.querySelector("div.image-cropper");
        root.dispatchEvent(
            new KeyboardEvent("keydown", {
                key: "ArrowLeft",
                altKey: true,
                bubbles: true,
                cancelable: true,
            }),
        );
        expect(root.getAttribute("data-crop-width")).toBe("99");
    });
    it("starts as the whole image", async () => {
        await mount("image-cropper");
        expect(document.querySelector("div.image-cropper").getAttribute("data-crop-width")).toBe(
            "100",
        );
    });
});
