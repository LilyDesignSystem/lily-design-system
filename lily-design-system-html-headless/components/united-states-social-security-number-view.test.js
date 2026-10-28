// united-states-social-security-number-view.test.js
// UnitedStatesSocialSecurityNumberView component test

const path = require("path");

describe("UnitedStatesSocialSecurityNumberView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "united-states-social-security-number-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.united-states-social-security-number-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("united-states-social-security-number-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.united-states-social-security-number-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
