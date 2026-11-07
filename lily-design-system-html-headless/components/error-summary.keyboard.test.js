// error-summary.keyboard.test.js
// ErrorSummary keyboard test, with real keys in a real browser

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

describe("ErrorSummary keyboard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "error-summary.html"));
    });

    it("it is an alert that can take focus, and Tab reaches its links", async function () {
        await browser.execute(() => {
            document.querySelector(".error-summary").innerHTML =
                '<h2 id="error-summary-title">There is a problem</h2><a href="#name">Enter your name</a>';
        });
        await browser.execute(() => document.querySelector(".error-summary").focus());
        const root = await active();
        expect(root.className).toContain("error-summary");
        expect(root.role).toBe("alert");
        // Named by its title, as in Svelte.
        const name = await browser.execute(() => {
            const el = document.activeElement;
            return document.getElementById(el.getAttribute("aria-labelledby"))?.textContent;
        });
        expect(name).toBe("There is a problem");
        await browser.keys("Tab");
        expect((await active()).text).toBe("Enter your name");
    });
});
