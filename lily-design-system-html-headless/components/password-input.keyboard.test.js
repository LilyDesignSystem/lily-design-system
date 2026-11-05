// password-input.keyboard.test.js
// PasswordInput keyboard test, with real keys in a real browser

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

describe("PasswordInput keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "password-input.html"));
    });

    it("Tab reaches it, and typing fills it", async function () {
        await browser.keys("Tab");
        const el = await active();
        expect(el.tag).toBe("input");
        expect(el.className).toContain("password-input");
        expect(el.label).not.toBeNull();
        await browser.keys(["s", "e", "c", "r", "e", "t"]);
        expect((await active()).value).toBe("secret");
    });

    it("Tab skips it when disabled", async function () {
        await browser.execute(() => {
            document.querySelector(".password-input").disabled = true;
        });
        await browser.keys("Tab");
        expect((await active()).tag).toBe("body");
    });
});
