// details.test.js
// Details component test

const path = require("path");

describe("Details", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "details.html"));
    });

    it("should render the details element with correct class", async function () {
        const el = await $("details.details");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("details");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("details.details");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
