// five-face-rating-radio-group.keyboard.test.js
// FiveFaceRatingRadioGroup keyboard test, with real keys in a real browser

const path = require("path");

const active = () =>
    browser.execute(() => {
        const el = document.activeElement;
        return {
            tag: el.tagName.toLowerCase(),
            className: el.className,
            label: el.getAttribute("aria-label"),
            role: el.getAttribute("role"),
            text: el.textContent.trim(),
            value: el.value,
            checked: el.checked,
        };
    });

describe("FiveFaceRatingRadioGroup keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-radio-group.html"));
    });

    it("arrows walk the radios", async function () {
        await browser.execute(() => {
            document.querySelector(".five-face-rating-radio-group").innerHTML =
                '<input type="radio" name="size" aria-label="S" /><input type="radio" name="size" aria-label="M" />';
        });
        await browser.keys("Tab");
        expect((await active()).label).toBe("S");
        await browser.keys("ArrowDown");
        const next = await active();
        expect(next.label).toBe("M");
        expect(next.checked).toBe(true);
    });
});
