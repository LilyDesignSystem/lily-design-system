// red-orange-yellow-green-blue-view.test.js
// RedOrangeYellowGreenBlueView component test

const path = require("path");

describe("RedOrangeYellowGreenBlueView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "red-orange-yellow-green-blue-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.red-orange-yellow-green-blue-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("red-orange-yellow-green-blue-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.red-orange-yellow-green-blue-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
