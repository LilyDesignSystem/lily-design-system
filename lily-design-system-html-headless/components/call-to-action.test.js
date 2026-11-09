// call-to-action.test.js
// CallToAction component test

const path = require("path");

describe("CallToAction", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "call-to-action.html"));
    });

    it("should render the link element with correct class", async function () {
        const el = await $("a.call-to-action");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("call-to-action");
    });

    it("should not name the link when its text is enough", async function () {
        const el = await $("a.call-to-action");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
