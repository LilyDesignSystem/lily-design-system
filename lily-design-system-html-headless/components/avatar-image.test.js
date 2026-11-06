// avatar-image.test.js
// AvatarImage component test

const path = require("path");

describe("AvatarImage", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "avatar-image.html"));
    });

    it("should render the img element with correct class", async function () {
        const el = await $("img.avatar-image");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("avatar-image");
    });
});
