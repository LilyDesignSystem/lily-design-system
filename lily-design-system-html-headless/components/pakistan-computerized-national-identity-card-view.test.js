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

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.pakistan-computerized-national-identity-card-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
