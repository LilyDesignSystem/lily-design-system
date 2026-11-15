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
});
