// addressograph-box.test.js
// AddressographBox component test

const path = require("path");

describe("AddressographBox", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "addressograph-box.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.addressograph-box");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("addressograph-box");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.addressograph-box");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should be a group, so that its label is valid", async function () {
        const el = await $(".addressograph-box");
        expect(await el.getAttribute("role")).toBe("group");
    });
});
