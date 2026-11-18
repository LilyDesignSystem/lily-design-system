// qazaqstan-zheke-saikestendiru-nomiri-view.test.js
// QazaqstanZhekeSaikestendiruNomiriView component test

const path = require("path");

describe("QazaqstanZhekeSaikestendiruNomiriView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "qazaqstan-zheke-saikestendiru-nomiri-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.qazaqstan-zheke-saikestendiru-nomiri-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("qazaqstan-zheke-saikestendiru-nomiri-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.qazaqstan-zheke-saikestendiru-nomiri-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
