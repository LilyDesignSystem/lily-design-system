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

    it("should have an aria-label attribute", async function () {
        const el = await $("span.as-saudiyah-raqm-al-huwiyah-al-wataniyah-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
