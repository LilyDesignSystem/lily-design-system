// numeric-rating-scale-picker.test.js
// NumericRatingScalePicker component test

const path = require("path");

describe("NumericRatingScalePicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "numeric-rating-scale-picker.html"));
    });

    it("is a fieldset with eleven radios and described ends", async function () {
        await expect($("fieldset.numeric-rating-scale-picker legend")).toHaveText(
            "How bad is your pain now?",
        );
        expect(await $$('input[type="radio"]').length).toBe(11);
        expect(await $('input[value="0"]').getAttribute("aria-describedby")).toBe("nrs-demo-min");
        expect(await $('input[value="10"]').getAttribute("aria-describedby")).toBe("nrs-demo-max");
    });

    it("arrow keys move and choose", async function () {
        await $('input[value="3"]').click();
        await browser.keys(["ArrowRight"]);
        expect(await $('input[value="4"]').isSelected()).toBe(true);
    });
});
