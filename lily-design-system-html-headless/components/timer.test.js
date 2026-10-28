// timer.test.js
// Timer component test

const path = require("path");

describe("Timer", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "timer.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.timer");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("timer");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.timer");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
