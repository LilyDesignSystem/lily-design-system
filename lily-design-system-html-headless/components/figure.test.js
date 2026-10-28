// figure.test.js
// Figure component test

const path = require("path");

describe("Figure", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "figure.html"));
    });

    it("should render the figure element with correct class", async function () {
        const el = await $("figure.figure");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("figure");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("figure.figure");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
