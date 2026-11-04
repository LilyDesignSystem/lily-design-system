// image-cropper.test.js
// ImageCropper component test

const path = require("path");

describe("ImageCropper", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "image-cropper.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.image-cropper");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("image-cropper");
    });

    it("should have the application role", async function () {
        const el = await $("div.image-cropper");
        const role = await el.getAttribute("role");
        expect(role).toBe("application");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.image-cropper");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("Alt+ArrowLeft narrows the crop, with a real key", async function () {
        const el = await $("div.image-cropper");
        await browser.execute(() => document.querySelector("div.image-cropper").focus());
        await browser.keys(["Alt", "ArrowLeft", "Alt"]);
        expect(await el.getAttribute("data-crop-width")).toBe("99");
    });
});
