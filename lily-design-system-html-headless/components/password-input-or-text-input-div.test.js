// password-input-or-text-input-div.test.js
// PasswordInputOrTextInputDiv component test

const path = require("path");

describe("PasswordInputOrTextInputDiv", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "password-input-or-text-input-div.html"),
        );
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.password-input-or-text-input-div");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("password-input-or-text-input-div");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.password-input-or-text-input-div");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
