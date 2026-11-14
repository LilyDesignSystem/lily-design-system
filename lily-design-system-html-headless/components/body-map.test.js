// body-map.test.js
// BodyMap component test

const path = require("path");

describe("BodyMap", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "body-map.html"));
    });

    it("is a fieldset with a hidden drawing and a checkbox per region", async function () {
        await expect($("fieldset.body-map legend")).toHaveText("Where is the pain?");
        expect(await $(".body-map-figure").getAttribute("aria-hidden")).toBe("true");
        expect(await $$('input[type="checkbox"][name="sites"]').length).toBe(2);
    });

    it("Space toggles a region", async function () {
        const head = await $('input[value="head"]');
        await head.click();
        expect(await head.isSelected()).toBe(true);
        await browser.keys([" "]);
        expect(await head.isSelected()).toBe(false);
    });
});
