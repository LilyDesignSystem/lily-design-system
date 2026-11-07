// code.test.js
// Code component test

const path = require("path");

describe("Code", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "code.html"));
    });

    it("should render the code element with correct class", async function () {
        const el = await $("code.code");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("code");
    });

    it("should name no <code>", async function () {
        const el = await $("code.code");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
