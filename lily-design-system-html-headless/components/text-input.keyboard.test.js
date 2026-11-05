// text-input.keyboard.test.js
// TextInput keyboard test, with real keys in a real browser

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

describe("TextInput keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "text-input.html"));
    });

    it("Tab reaches it, and typing fills it", async function () {
        await browser.keys("Tab");
        const el = await active();
        expect(el.tag).toBe("input");
        expect(el.className).toContain("text-input");
        expect(el.label).not.toBeNull();
        await browser.keys(["A", "d", "a"]);
        expect((await active()).value).toBe("Ada");
    });

    it("Tab skips it when disabled", async function () {
        await browser.execute(() => {
            document.querySelector(".text-input").disabled = true;
        });
        await browser.keys("Tab");
        expect((await active()).tag).toBe("body");
    });
});
