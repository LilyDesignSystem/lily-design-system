// international-patient-summary.test.js
// InternationalPatientSummary component test

const path = require("path");

describe("InternationalPatientSummary", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "international-patient-summary.html"),
        );
    });

    it("renders an article named by its label, banner first and details last", async function () {
        const article = await $("article.international-patient-summary");
        await expect(article).toExist();
        expect(await article.getAttribute("aria-label")).toBe("Patient summary");
        const classes = await browser.execute(() =>
            [...document.querySelector("article").children].map((c) => c.getAttribute("class")),
        );
        expect(classes[0]).toBe("international-patient-summary-banner");
        expect(classes[classes.length - 1]).toBe("international-patient-summary-details");
    });

    it("shows a missing required section in words, with a contents link to it", async function () {
        const missing = await $('section[data-section="medications"]');
        expect(await missing.getAttribute("data-status")).toBe("omitted");
        expect(await missing.getAttribute("data-required")).toBe("true");
        expect(await missing.$(".international-patient-summary-section-status").getText()).toBe(
            "Section missing from document",
        );
        const link = await $(
            'nav.international-patient-summary-contents a[href="#international-patient-summary-medications"]',
        );
        await expect(link).toExist();
    });
});
