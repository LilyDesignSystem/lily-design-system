// as-saudiyah-raqm-al-huwiyah-al-wataniyah-view.test.js
// AsSaudiyahRaqmAlHuwiyahAlWataniyahView component test

const path = require("path");

describe("AsSaudiyahRaqmAlHuwiyahAlWataniyahView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "as-saudiyah-raqm-al-huwiyah-al-wataniyah-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
