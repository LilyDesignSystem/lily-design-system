// email-input.test.js
// EmailInput component test

const path = require("path");

describe("EmailInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "email-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.email-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("email-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.email-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
