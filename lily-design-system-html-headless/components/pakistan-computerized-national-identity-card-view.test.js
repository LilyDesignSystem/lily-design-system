// pakistan-computerized-national-identity-card-view.test.js
// PakistanComputerizedNationalIdentityCardView component test

const path = require("path");

describe("PakistanComputerizedNationalIdentityCardView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" +
                path.resolve(__dirname, "pakistan-computerized-national-identity-card-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.pakistan-computerized-national-identity-card-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("pakistan-computerized-national-identity-card-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.pakistan-computerized-national-identity-card-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
