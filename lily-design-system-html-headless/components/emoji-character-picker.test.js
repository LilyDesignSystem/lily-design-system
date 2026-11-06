// emoji-character-picker.test.js
// EmojiCharacterPicker component test

const path = require("path");

describe("EmojiCharacterPicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "emoji-character-picker.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.emoji-character-picker");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("emoji-character-picker");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("div.emoji-character-picker");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("grid");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("div.emoji-character-picker");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
