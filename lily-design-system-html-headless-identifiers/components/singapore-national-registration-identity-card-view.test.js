// singapore-national-registration-identity-card-view.test.js
// SingaporeNationalRegistrationIdentityCardView component test

const path = require("path");

describe("SingaporeNationalRegistrationIdentityCardView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "singapore-national-registration-identity-card-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.singapore-national-registration-identity-card-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("singapore-national-registration-identity-card-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.singapore-national-registration-identity-card-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
