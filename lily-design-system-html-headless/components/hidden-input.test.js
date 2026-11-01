// hidden-input.test.js
// HiddenInput component test

const path = require("path");

describe("HiddenInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "hidden-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.hidden-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("hidden-input");
    });

    it("is a hidden input with a name and a value, and no label", async function () {
        const el = await $("input.hidden-input");
        expect(await el.getAttribute("type")).toBe("hidden");
        expect(await el.getAttribute("name")).not.toBeNull();
        expect(await el.getAttribute("value")).not.toBeNull();
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
