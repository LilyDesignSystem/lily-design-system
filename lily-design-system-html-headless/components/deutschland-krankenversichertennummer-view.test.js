// deutschland-krankenversichertennummer-view.test.js
// DeutschlandKrankenversichertennummerView component test

const path = require("path");

describe("DeutschlandKrankenversichertennummerView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "deutschland-krankenversichertennummer-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.deutschland-krankenversichertennummer-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("deutschland-krankenversichertennummer-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.deutschland-krankenversichertennummer-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
