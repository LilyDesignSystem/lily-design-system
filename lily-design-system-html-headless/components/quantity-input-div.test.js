// quantity-input-div.test.js
// QuantityInputDiv component test

const path = require("path");

describe("QuantityInputDiv", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "quantity-input-div.html"));
    });

    it("should render the root element with correct class", async function () {
        const el = await $(".quantity-input-div");
        await expect(el).toExist();
    });

    it("should have an aria-label attribute", async function () {
        const el = await $(".quantity-input-div");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
