// grail-layout.test.js
// GrailLayout component test

const path = require("path");

describe("GrailLayout", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "grail-layout.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.grail-layout");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("grail-layout");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.grail-layout");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
