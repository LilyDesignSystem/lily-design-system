// notification.test.js
// Notification component test

const path = require("path");

describe("Notification", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "notification.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.notification");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("notification");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.notification");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("status");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.notification");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
