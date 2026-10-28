// action-link.test.js
// ActionLink component test

const path = require("path");

describe("ActionLink", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "action-link.html"));
    });

    it("should render the a element with correct class", async function () {
        const el = await $("a.action-link");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("action-link");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("a.action-link");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
