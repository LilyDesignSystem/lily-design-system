// picture.test.js
// Picture component test

const path = require("path");

describe("Picture", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "picture.html"));
    });

    it("should render a picture with the base class as its first class", async function () {
        const el = await $("picture.picture");
        await expect(el).toExist();
        expect((await el.getAttribute("class")).split(" ")[0]).toBe("picture");
    });

    it("should hold a source and an img with alt, width and height", async function () {
        await expect($("picture.picture > source")).toExist();
        const img = await $("picture.picture > img");
        await expect(img).toExist();
        expect(await img.getAttribute("alt")).not.toBeNull();
        expect(await img.getAttribute("width")).not.toBeNull();
        expect(await img.getAttribute("height")).not.toBeNull();
    });

    it("should not ship inline styles", async function () {
        const el = await $("picture.picture");
        expect(await el.getAttribute("style")).toBeNull();
    });
});
