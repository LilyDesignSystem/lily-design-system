// field.test.js
// Field component test

const path = require("path");

describe("Field", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "field.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.field");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("field");
    });

    it("should not name the generic div", async function () {
        const el = await $("div.field");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
