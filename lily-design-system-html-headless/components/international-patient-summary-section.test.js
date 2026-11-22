// international-patient-summary-section.test.js
// InternationalPatientSummarySection component test

const path = require("path");

describe("InternationalPatientSummarySection", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "international-patient-summary-section.html"),
        );
    });

    it("renders a section named by its heading, with its key, code, status and words", async function () {
        const section = await $("section.international-patient-summary-section");
        expect(await section.getAttribute("aria-labelledby")).toBe(
            "international-patient-summary-problems-heading",
        );
        expect(await section.getAttribute("data-code")).toBe("11450-4");
        expect(await section.getAttribute("data-status")).toBe("not-recorded");
        expect(await $(".international-patient-summary-section-status").getText()).toBe(
            "Not recorded",
        );
        await expect($("details.international-patient-summary-section-narrative")).toExist();
    });

    it("carries its level, and the optional meta and warning sit between the status and the narrative", async function () {
        const section = await $("section.international-patient-summary-section");
        expect(await section.getAttribute("data-level")).toBe("required");
        const order = await browser.execute(() =>
            [...document.querySelector("section").children].map((c) => c.className.split(" ")[0]),
        );
        expect(order).toEqual([
            "international-patient-summary-section-heading",
            "international-patient-summary-section-status",
            "international-patient-summary-section-meta",
            "international-patient-summary-section-warning",
            "international-patient-summary-section-narrative",
        ]);
    });
});
