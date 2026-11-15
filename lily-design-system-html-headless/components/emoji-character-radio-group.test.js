// emoji-character-radio-group.test.js
// EmojiCharacterRadioGroup component test

const path = require("path");

describe("EmojiCharacterRadioGroup", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "emoji-character-radio-group.html"));
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.emoji-character-radio-group");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("emoji-character-radio-group");
    });

    it("should have the correct ARIA role", async function () {
        const el = await $("fieldset.emoji-character-radio-group");
        const roleAttr = await el.getAttribute("role");
        expect(roleAttr).toBe("radiogroup");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("fieldset.emoji-character-radio-group");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
