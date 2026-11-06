// misr-al-raqm-al-qawmi-view.test.js
// MisrAlRaqmAlQawmiView component test

const path = require("path");

describe("MisrAlRaqmAlQawmiView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "misr-al-raqm-al-qawmi-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.misr-al-raqm-al-qawmi-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("misr-al-raqm-al-qawmi-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.misr-al-raqm-al-qawmi-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
