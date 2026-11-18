// hanguk-jumin-deungnok-beonho-view.test.js
// HangukJuminDeungnokBeonhoView component test

const path = require("path");

describe("HangukJuminDeungnokBeonhoView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "hanguk-jumin-deungnok-beonho-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.hanguk-jumin-deungnok-beonho-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("hanguk-jumin-deungnok-beonho-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.hanguk-jumin-deungnok-beonho-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
