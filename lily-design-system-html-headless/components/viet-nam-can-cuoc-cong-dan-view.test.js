// viet-nam-can-cuoc-cong-dan-view.test.js
// VietNamCanCuocCongDanView component test

const path = require("path");

describe("VietNamCanCuocCongDanView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "viet-nam-can-cuoc-cong-dan-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.viet-nam-can-cuoc-cong-dan-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("viet-nam-can-cuoc-cong-dan-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.viet-nam-can-cuoc-cong-dan-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
