// qazaqstan-zheke-saikestendiru-nomiri-input.test.js
// QazaqstanZhekeSaikestendiruNomiriInput component test

const path = require("path");

describe("QazaqstanZhekeSaikestendiruNomiriInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "qazaqstan-zheke-saikestendiru-nomiri-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.qazaqstan-zheke-saikestendiru-nomiri-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("qazaqstan-zheke-saikestendiru-nomiri-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.qazaqstan-zheke-saikestendiru-nomiri-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.qazaqstan-zheke-saikestendiru-nomiri-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
