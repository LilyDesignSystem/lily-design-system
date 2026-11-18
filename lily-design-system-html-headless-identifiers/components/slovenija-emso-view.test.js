// slovenija-emso-view.test.js
// SlovenijaEmsoView component test

const path = require("path");

describe("SlovenijaEmsoView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "slovenija-emso-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.slovenija-emso-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("slovenija-emso-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.slovenija-emso-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
