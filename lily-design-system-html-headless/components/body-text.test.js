// body-text.test.js
// BodyText component test

const path = require("path");

describe("BodyText", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "body-text.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.body-text");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("body-text");
    });

    it("should not have an aria-label attribute", async function () {
        const el = await $("div.body-text");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
