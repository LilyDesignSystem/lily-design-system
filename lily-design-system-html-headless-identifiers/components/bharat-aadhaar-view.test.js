// bharat-aadhaar-view.test.js
// BharatAadhaarView component test

const path = require("path");

describe("BharatAadhaarView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "bharat-aadhaar-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.bharat-aadhaar-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("bharat-aadhaar-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.bharat-aadhaar-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
