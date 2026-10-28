// toast.test.js
// Toast component test

const path = require("path");

describe("Toast", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "toast.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.toast");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("toast");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.toast");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("status");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.toast");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
