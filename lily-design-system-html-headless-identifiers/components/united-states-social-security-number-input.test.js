// united-states-social-security-number-input.test.js
// UnitedStatesSocialSecurityNumberInput component test

const path = require("path");

describe("UnitedStatesSocialSecurityNumberInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "united-states-social-security-number-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.united-states-social-security-number-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("united-states-social-security-number-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.united-states-social-security-number-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
