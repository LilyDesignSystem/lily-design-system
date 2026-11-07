// citation.test.js
// Citation component test

const path = require("path");

describe("Citation", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "citation.html"));
    });

    it("should render the cite element with correct class", async function () {
        const el = await $("cite.citation");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("citation");
    });

    it("should name no <cite>", async function () {
        const el = await $("cite.citation");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
