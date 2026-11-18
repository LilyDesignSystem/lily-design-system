// taiwan-guomin-shenfenzheng-tongyi-bianhao-view.test.js
// TaiwanGuominShenfenzhengTongyiBianhaoView component test

const path = require("path");

describe("TaiwanGuominShenfenzhengTongyiBianhaoView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "taiwan-guomin-shenfenzheng-tongyi-bianhao-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.taiwan-guomin-shenfenzheng-tongyi-bianhao-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("taiwan-guomin-shenfenzheng-tongyi-bianhao-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.taiwan-guomin-shenfenzheng-tongyi-bianhao-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
