// emoji-character-radio-input.test.js
// EmojiCharacterRadioInput component test

const path = require("path");

describe("EmojiCharacterRadioInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "emoji-character-radio-input.html"));
    });

    it("should render the input element with correct class", async function () {
        const el = await $("input.emoji-character-radio-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("emoji-character-radio-input");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("input.emoji-character-radio-input");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("should carry a data-value attribute for consumer CSS", async function () {
        const el = await $("input.emoji-character-radio-input");
        expect(await el.getAttribute("data-value")).not.toBeNull();
    });
});
