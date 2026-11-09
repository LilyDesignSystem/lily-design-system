// error-message.test.js
// ErrorMessage component test

const path = require("path");

describe("ErrorMessage", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "error-message.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("p.error-message");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("error-message");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("p.error-message");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
