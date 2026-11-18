// island-kennitala-view.test.js
// IslandKennitalaView component test

const path = require("path");

describe("IslandKennitalaView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "island-kennitala-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.island-kennitala-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("island-kennitala-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.island-kennitala-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
