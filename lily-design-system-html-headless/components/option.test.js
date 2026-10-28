// option.test.js
// Option component test

const path = require("path");

describe("Option", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "option.html"));
    });

    it("should render the option element with correct class", async function () {
        const el = await $("option.option");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("option");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("option.option");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
