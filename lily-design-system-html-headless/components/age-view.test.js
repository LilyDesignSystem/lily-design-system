// age-view.test.js
// AgeView component test

const path = require("path");

describe("AgeView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "age-view.html"));
    });

    it("renders the consumer's words and the duration as data", async function () {
        const root = await $("span.age-view");
        await expect(root).toExist();
        expect(await root.getAttribute("data-duration")).toBe("P23D");
        expect(await root.getAttribute("aria-label")).toBeNull();
    });
});
