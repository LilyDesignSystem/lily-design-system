// net-promoter-score-picker.keyboard.test.js
// NetPromoterScorePicker keyboard test, with real keys in a real browser

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

describe("NetPromoterScorePicker keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "net-promoter-score-picker.html"));
    });

    it("arrows walk the scores", async function () {
        await browser.execute(() => {
            document.querySelector(".net-promoter-score-picker").innerHTML =
                '<input type="radio" name="nps" aria-label="0" /><input type="radio" name="nps" aria-label="1" />';
        });
        await browser.keys("Tab");
        expect((await active()).label).toBe("0");
        await browser.keys("ArrowRight");
        const next = await active();
        expect(next.label).toBe("1");
        expect(next.checked).toBe(true);
    });
});
