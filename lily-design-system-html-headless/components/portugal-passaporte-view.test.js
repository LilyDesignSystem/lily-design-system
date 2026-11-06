// portugal-passaporte-view.test.js
// PortugalPassaporteView component test

const path = require("path");

describe("PortugalPassaporteView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "portugal-passaporte-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.portugal-passaporte-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("portugal-passaporte-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.portugal-passaporte-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
