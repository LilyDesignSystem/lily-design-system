// email-link.test.js
// EmailLink component test

const path = require("path");

describe("EmailLink", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "email-link.html"));
    });

    it("should render the a element with correct class", async function () {
        const el = await $("a.email-link");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("email-link");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("a.email-link");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
