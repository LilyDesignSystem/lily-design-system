const path = require("path");
const { runPattern } = require("../../shared/pattern-browser.cjs");

describe("ImageCropper pattern", function () {
    it("meets the cropper contract", async function () {
        await browser.url("file://" + path.resolve(__dirname, "image-cropper.html"));
        await runPattern(browser, "cropper", ".image-cropper", "image-cropper", "Crop");
    });
});
