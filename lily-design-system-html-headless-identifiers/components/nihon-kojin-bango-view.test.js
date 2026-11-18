// nihon-kojin-bango-view.test.js
// NihonKojinBangoView component test

const path = require("path");

describe("NihonKojinBangoView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "nihon-kojin-bango-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.nihon-kojin-bango-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("nihon-kojin-bango-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.nihon-kojin-bango-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
