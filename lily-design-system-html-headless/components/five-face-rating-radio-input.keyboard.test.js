// five-face-rating-radio-input.keyboard.test.js
// FiveFaceRatingRadioInput keyboard test, with real keys in a real browser

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

describe("FiveFaceRatingRadioInput keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-radio-input.html"));
    });

    it("Tab reaches it, and Space selects it", async function () {
        await browser.keys("Tab");
        expect((await active()).label).not.toBeNull();
        await browser.keys(" ");
        expect((await active()).checked).toBe(true);
    });
});
