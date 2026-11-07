// review-date.test.js
// ReviewDate component test

const path = require("path");

describe("ReviewDate", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "review-date.html"));
    });

    it("should render a time element with the base class", async function () {
        const el = await $("time.review-date");
        await expect(el).toExist();
    });

    it("should have hidden text and a machine-readable datetime", async function () {
        const el = await $("time.review-date");
        expect(await el.getAttribute("aria-label")).toBeNull();
        expect(await (await $("time.review-date .screen-reader-span")).isExisting()).toBe(true);
        expect(await el.getAttribute("datetime")).toMatch(/^\d{4}-\d{2}-\d{2}/);
    });
});
