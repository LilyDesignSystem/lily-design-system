// password-input.test.js
// PasswordInput component test

const path = require("path");

describe("PasswordInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "password-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.password-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("password-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.password-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
