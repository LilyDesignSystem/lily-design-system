// pin-input-div.test.js
// PinInputDiv component test

const path = require("path");

describe("PinInputDiv", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "pin-input-div.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.pin-input-div");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("pin-input-div");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.pin-input-div");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
