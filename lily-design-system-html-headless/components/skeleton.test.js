// skeleton.test.js
// Skeleton component test

const path = require("path");

describe("Skeleton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "skeleton.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.skeleton");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("skeleton");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.skeleton");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
