// footnote.test.js
// Footnote component test

const path = require("path");

describe("Footnote", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "footnote.html"));
    });

    it("should render the aside element with correct class", async function () {
        const el = await $("span.footnote");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("footnote");
    });

    it('should have role="note"', async function () {
        const el = await $("span.footnote");
        const role = await el.getAttribute("role");
        expect(role).toBe("note");
    });

    it("is not named by its id", async function () {
        const el = await $("span.footnote");
        const label = await el.getAttribute("aria-label");
        expect(label).toBeNull();
    });
});
