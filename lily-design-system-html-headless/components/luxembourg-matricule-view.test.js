// luxembourg-matricule-view.test.js
// LuxembourgMatriculeView component test

const path = require("path");

describe("LuxembourgMatriculeView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "luxembourg-matricule-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.luxembourg-matricule-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("luxembourg-matricule-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.luxembourg-matricule-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
