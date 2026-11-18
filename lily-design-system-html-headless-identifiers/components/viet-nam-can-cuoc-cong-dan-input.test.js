// viet-nam-can-cuoc-cong-dan-input.test.js
// VietNamCanCuocCongDanInput component test

const path = require("path");

describe("VietNamCanCuocCongDanInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "viet-nam-can-cuoc-cong-dan-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.viet-nam-can-cuoc-cong-dan-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("viet-nam-can-cuoc-cong-dan-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.viet-nam-can-cuoc-cong-dan-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.viet-nam-can-cuoc-cong-dan-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
