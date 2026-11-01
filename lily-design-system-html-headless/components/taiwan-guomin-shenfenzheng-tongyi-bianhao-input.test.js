// taiwan-guomin-shenfenzheng-tongyi-bianhao-input.test.js
// TaiwanGuominShenfenzhengTongyiBianhaoInput component test

const path = require("path");

describe("TaiwanGuominShenfenzhengTongyiBianhaoInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "taiwan-guomin-shenfenzheng-tongyi-bianhao-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.taiwan-guomin-shenfenzheng-tongyi-bianhao-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
