// tab-bar-button.keyboard.test.js
// TabBarButton keyboard test, with real keys in a real browser

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

describe("TabBarButton keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tab-bar-button.html"));
    });

    it("Tab skips a tab that is not selected", async function () {
        await browser.keys("Tab");
        expect((await active()).tag).toBe("body");
    });

    it("Tab reaches the selected tab, and Enter activates it", async function () {
        await browser.execute(() => {
            const tab = document.querySelector(".tab-bar-button");
            tab.setAttribute("aria-selected", "true");
            tab.setAttribute("tabindex", "0");
            window.clicks = 0;
            tab.addEventListener("click", () => window.clicks++);
        });
        await browser.keys("Tab");
        expect((await active()).role).toBe("tab");
        expect((await active()).label).not.toBeNull();
        await browser.keys("Enter");
        expect(await browser.execute(() => window.clicks)).toBe(1);
    });
});
