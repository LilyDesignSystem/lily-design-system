// duration-view.test.js
// DurationView component test

const path = require("path");

describe("DurationView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "duration-view.html"));
    });

    it("is a time whose datetime is the duration, holding the consumer's words", async function () {
        const root = await $("time.duration-view");
        await expect(root).toExist();
        expect(await root.getAttribute("datetime")).toBe("P3DT4H");
        expect(await root.getText()).toContain("3 days 4 hours");
        expect(await root.getAttribute("aria-label")).toBeNull();
    });
});
