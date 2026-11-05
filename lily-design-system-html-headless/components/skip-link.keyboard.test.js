// skip-link.keyboard.test.js
// SkipLink keyboard test, with real keys in a real browser

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

describe("SkipLink keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "skip-link.html"));
    });

    it("Tab reaches it first, and Enter activates it", async function () {
        await browser.execute(() => {
            const link = document.querySelector(".skip-link");
            link.href = "#main";
            window.clicks = 0;
            link.addEventListener("click", (event) => {
                event.preventDefault();
                window.clicks++;
            });
        });
        await browser.keys("Tab");
        expect((await active()).className).toContain("skip-link");
        await browser.keys("Enter");
        expect(await browser.execute(() => window.clicks)).toBe(1);
    });
});
