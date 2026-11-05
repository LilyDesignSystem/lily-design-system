// button.keyboard.test.js
// Button keyboard test, with real keys in a real browser

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

describe("Button keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "button.html"));
    });

    it("Tab reaches it, and Enter and Space activate it", async function () {
        await browser.execute(() => {
            window.clicks = 0;
            document.querySelector(".button").addEventListener("click", () => window.clicks++);
        });
        await browser.keys("Tab");
        expect((await active()).tag).toBe("button");
        expect((await active()).label).not.toBeNull();
        await browser.keys("Enter");
        await browser.keys(" ");
        expect(await browser.execute(() => window.clicks)).toBe(2);
    });
});
