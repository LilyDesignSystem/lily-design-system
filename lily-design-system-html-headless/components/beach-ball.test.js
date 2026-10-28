// beach-ball.test.js
// BeachBall component test

const path = require("path");

describe("BeachBall", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "beach-ball.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.beach-ball");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("beach-ball");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.beach-ball");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
