// url-input.test.js
// UrlInput component test

const path = require("path");

describe("UrlInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "url-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.url-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("url-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.url-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
