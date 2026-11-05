// pagination-nav.keyboard.test.js
// PaginationNav keyboard test, with real keys in a real browser

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

describe("PaginationNav keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "pagination-nav.html"));
    });

    it("Tab walks its links, inside the landmark", async function () {
        await browser.execute(() => {
            document.querySelector(".pagination-nav").innerHTML =
                '<a href="#first">First</a> <a href="#second">Second</a>';
        });
        await browser.keys("Tab");
        expect((await active()).text).toBe("First");
        const label = await browser.execute(() =>
            document.activeElement.closest("nav").getAttribute("aria-label"),
        );
        expect(label).not.toBeNull();
        await browser.keys("Tab");
        expect((await active()).text).toBe("Second");
    });
});
