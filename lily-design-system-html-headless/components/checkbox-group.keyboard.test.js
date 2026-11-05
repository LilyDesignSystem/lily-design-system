// checkbox-group.keyboard.test.js
// CheckboxGroup keyboard test, with real keys in a real browser

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

describe("CheckboxGroup keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "checkbox-group.html"));
    });

    it("Tab and Space work inside the group", async function () {
        await browser.execute(() => {
            document.querySelector(".checkbox-group").innerHTML =
                '<input type="checkbox" aria-label="Ham" /><input type="checkbox" aria-label="Egg" />';
        });
        await browser.keys("Tab");
        expect((await active()).label).toBe("Ham");
        await browser.keys(" ");
        expect((await active()).checked).toBe(true);
        await browser.keys("Tab");
        expect((await active()).label).toBe("Egg");
    });
});
