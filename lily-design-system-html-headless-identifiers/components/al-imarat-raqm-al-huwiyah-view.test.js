// al-imarat-raqm-al-huwiyah-view.test.js
// AlImaratRaqmAlHuwiyahView component test

const path = require("path");

describe("AlImaratRaqmAlHuwiyahView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "al-imarat-raqm-al-huwiyah-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.al-imarat-raqm-al-huwiyah-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("al-imarat-raqm-al-huwiyah-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.al-imarat-raqm-al-huwiyah-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
