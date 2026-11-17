// record-provenance-view.test.js
// RecordProvenanceView component test

const path = require("path");

describe("RecordProvenanceView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "record-provenance-view.html"));
    });

    it("should render the root element with correct class", async function () {
        const el = await $(".record-provenance-view");
        await expect(el).toExist();
    });

    it("should have an aria-label attribute", async function () {
        const el = await $(".record-provenance-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
