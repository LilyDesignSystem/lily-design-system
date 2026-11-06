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

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.united-states-social-security-number-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
