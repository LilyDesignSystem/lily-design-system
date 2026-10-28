// toggle-button.test.js
// ToggleButton component test

const path = require("path");

describe("ToggleButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "toggle-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.toggle-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("toggle-button");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.toggle-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
