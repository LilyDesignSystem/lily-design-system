// belgique-numero-de-registre-national-view.test.js
// BelgiqueNumeroDeRegistreNationalView component test

const path = require("path");

describe("BelgiqueNumeroDeRegistreNationalView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "belgique-numero-de-registre-national-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.belgique-numero-de-registre-national-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("belgique-numero-de-registre-national-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.belgique-numero-de-registre-national-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
