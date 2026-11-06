// australia-individual-healthcare-identifier-view.test.js
// AustraliaIndividualHealthcareIdentifierView component test

const path = require("path");

describe("AustraliaIndividualHealthcareIdentifierView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "australia-individual-healthcare-identifier-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.australia-individual-healthcare-identifier-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("australia-individual-healthcare-identifier-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.australia-individual-healthcare-identifier-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
