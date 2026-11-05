// select.keyboard.test.js
// Select keyboard test, with real keys in a real browser

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

describe("Select keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "select.html"));
    });

    it("Tab reaches it", async function () {
        await browser.execute(() => {
            document.querySelector(".select").innerHTML =
                '<option value="a">A</option><option value="b">B</option>';
        });
        await browser.keys("Tab");
        expect((await active()).tag).toBe("select");
        expect((await active()).label).not.toBeNull();
    });
});
