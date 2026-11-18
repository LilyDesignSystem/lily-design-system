// al-imarat-raqm-al-huwiyah-input.test.js
// AlImaratRaqmAlHuwiyahInput component test

const path = require("path");

describe("AlImaratRaqmAlHuwiyahInput", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "al-imarat-raqm-al-huwiyah-input.html"),
        );
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.al-imarat-raqm-al-huwiyah-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("al-imarat-raqm-al-huwiyah-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.al-imarat-raqm-al-huwiyah-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should have autocomplete off", async function () {
        const el = await $("input.al-imarat-raqm-al-huwiyah-input");
        const value = await el.getAttribute("autocomplete");
        expect(value).toBe("off");
    });
});
