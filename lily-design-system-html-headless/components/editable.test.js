// editable.test.js
// Editable component test

const path = require("path");

describe("Editable", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "editable.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.editable");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("editable");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.editable");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
