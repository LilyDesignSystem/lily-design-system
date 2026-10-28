// avatar.test.js
// Avatar component test

const path = require("path");

describe("Avatar", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "avatar.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.avatar");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("avatar");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.avatar");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
