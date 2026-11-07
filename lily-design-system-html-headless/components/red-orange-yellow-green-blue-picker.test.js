// red-orange-yellow-green-blue-picker.test.js
// RedOrangeYellowGreenBluePicker component test

const path = require("path");

describe("RedOrangeYellowGreenBluePicker", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "red-orange-yellow-green-blue-picker.html"),
        );
    });

    it("renders a fieldset radiogroup with an aria-label", async function () {
        const el = await $("fieldset.red-orange-yellow-green-blue-picker");
        await expect(el).toExist();
        expect(await el.getAttribute("role")).toBe("radiogroup");
        expect(await el.getAttribute("aria-label")).not.toBeNull();
    });

    it("holds one native radio per status, sharing one name", async function () {
        const radios = await browser.execute(() =>
            Array.from(
                document.querySelectorAll(
                    '.red-orange-yellow-green-blue-picker input[type="radio"]',
                ),
            ).map((r) => [r.name, r.value]),
        );
        expect(radios).toEqual(
            ["red", "orange", "yellow", "green", "blue"].map((v) => ["status", v]),
        );
    });

    it("ArrowRight and ArrowLeft move the selection through the native radio group", async function () {
        const radios = await $$(".red-orange-yellow-green-blue-picker input[type=radio]");
        await radios[0].click();
        await browser.keys("ArrowRight");
        expect(await radios[1].isSelected()).toBe(true);
        await browser.keys("ArrowLeft");
        expect(await radios[0].isSelected()).toBe(true);
    });
});
