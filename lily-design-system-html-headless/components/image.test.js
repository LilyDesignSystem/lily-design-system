// image.test.js
// Image component test

const path = require("path");

describe("Image", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "image.html"));
    });

    it("should render the img element with correct class", async function () {
        const el = await $("img.image");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("image");
    });

    it("takes its text alternative from alt, not aria-label", async function () {
        const el = await $("img.image");
        expect(await el.getAttribute("alt")).not.toBeNull();
        expect(await el.getAttribute("src")).not.toBeNull();
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
