// text-area-input.keyboard.test.js
// TextAreaInput keyboard test, with real keys in a real browser

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

describe("TextAreaInput keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "text-area-input.html"));
    });

    it("Tab reaches it", async function () {
        await browser.keys("Tab");
        const el = await active();
        expect(el.tag).toBe("textarea");
        expect(el.label).not.toBeNull();
    });
});
