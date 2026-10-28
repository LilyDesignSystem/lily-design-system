// avatar-image.test.js
// AvatarImage component test

const path = require("path");

describe("AvatarImage", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "avatar-image.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.avatar-image");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("avatar-image");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.avatar-image");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
