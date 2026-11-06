// avatar-text.test.js
// AvatarText component test

const path = require("path");

describe("AvatarText", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "avatar-text.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.avatar-text");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("avatar-text");
    });

    it("should not have an aria-label attribute", async function () {
        const el = await $("div.avatar-text");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
