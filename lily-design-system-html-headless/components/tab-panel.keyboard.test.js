// tab-panel.keyboard.test.js
// TabPanel keyboard test, with real keys in a real browser

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

describe("TabPanel keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "tab-panel.html"));
    });

    it("Tab skips a hidden panel, and reaches a shown one", async function () {
        await browser.keys("Tab");
        expect((await active()).tag).toBe("body");
        await browser.execute(() => {
            document.querySelector(".tab-panel").hidden = false;
        });
        await browser.keys("Tab");
        expect((await active()).role).toBe("tabpanel");
        expect((await active()).label).not.toBeNull();
    });
});
