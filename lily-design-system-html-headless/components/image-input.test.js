// image-input.test.js
// ImageInput component test

const path = require("path");

describe("ImageInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "image-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.image-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("image-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.image-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
