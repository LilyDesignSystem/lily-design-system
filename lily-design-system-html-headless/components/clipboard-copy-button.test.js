// clipboard-copy-button.test.js
// ClipboardCopyButton component test

const path = require("path");

describe("ClipboardCopyButton", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "clipboard-copy-button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.clipboard-copy-button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("clipboard-copy-button");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.clipboard-copy-button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
