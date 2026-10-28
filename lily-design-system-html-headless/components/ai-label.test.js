// ai-label.test.js
// AiLabel component test

const path = require("path");

describe("AiLabel", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "ai-label.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.ai-label");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("ai-label");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.ai-label");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
