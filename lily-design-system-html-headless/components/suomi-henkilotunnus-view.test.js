// suomi-henkilotunnus-view.test.js
// SuomiHenkilotunnusView component test

const path = require("path");

describe("SuomiHenkilotunnusView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "suomi-henkilotunnus-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.suomi-henkilotunnus-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("suomi-henkilotunnus-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.suomi-henkilotunnus-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
