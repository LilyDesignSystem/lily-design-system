// bulgaria-edinen-grazhdanski-nomer-view.test.js
// BulgariaEdinenGrazhdanskiNomerView component test

const path = require("path");

describe("BulgariaEdinenGrazhdanskiNomerView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "bulgaria-edinen-grazhdanski-nomer-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.bulgaria-edinen-grazhdanski-nomer-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("bulgaria-edinen-grazhdanski-nomer-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.bulgaria-edinen-grazhdanski-nomer-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
