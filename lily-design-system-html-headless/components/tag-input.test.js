// tag-input.test.js
// TagInput component test

const path = require("path");

describe("TagInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tag-input.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tag-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tag-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tag-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
