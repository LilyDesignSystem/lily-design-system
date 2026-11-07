// net-promoter-score-picker.test.js
// NetPromoterScorePicker component test

const path = require("path");

describe("NetPromoterScorePicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "net-promoter-score-picker.html"));
    });

    it("renders a fieldset radiogroup with an aria-label", async function () {
        const el = await $("fieldset.net-promoter-score-picker");
        await expect(el).toExist();
        expect(await el.getAttribute("role")).toBe("radiogroup");
        expect(await el.getAttribute("aria-label")).not.toBeNull();
    });

    it("holds eleven native radios, values 0 to 10, sharing one name", async function () {
        const radios = await browser.execute(() =>
            Array.from(
                document.querySelectorAll('.net-promoter-score-picker input[type="radio"]'),
            ).map((r) => [r.name, r.value]),
        );
        expect(radios).toEqual(Array.from({ length: 11 }, (_, n) => ["nps", String(n)]));
    });

    it("ArrowRight and ArrowLeft move the selection through the native radio group", async function () {
        const radios = await $$(".net-promoter-score-picker input[type=radio]");
        await radios[0].click();
        await browser.keys("ArrowRight");
        expect(await radios[1].isSelected()).toBe(true);
        await browser.keys("ArrowLeft");
        expect(await radios[0].isSelected()).toBe(true);
    });
});
