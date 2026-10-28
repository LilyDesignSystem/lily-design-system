// tag-group.test.js
// TagGroup component test

const path = require("path");

describe("TagGroup", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tag-group.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.tag-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("tag-group");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.tag-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
