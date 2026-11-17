// record-provenance-view.test.js
// RecordProvenanceView component test

const path = require("path");

describe("RecordProvenanceView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "record-provenance-view.html"));
    });

    it("renders its states as data and words, the signature state first", async function () {
        const root = await $("span.record-provenance-view");
        await expect(root).toExist();
        expect(await root.getAttribute("data-attestation")).toBe("pending");
        expect(await root.getAttribute("data-source")).toBe("device");
        const parts = await root.$$(":scope > *");
        expect(await parts[0].getAttribute("class")).toBe("record-provenance-view-attestation");
        expect(await $(".record-provenance-view-recorded").getAttribute("datetime")).toBe("2026-11-03T09:00");
    });
});
