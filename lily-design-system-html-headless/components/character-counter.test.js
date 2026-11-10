// character-counter.test.js
// CharacterCounter component test

const path = require("path");

describe("CharacterCounter", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "character-counter.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.character-counter");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("character-counter");
    });

    it("hides the visible count and names the status", async function () {
        expect(await $(".character-counter-text").getAttribute("aria-hidden")).toBe("true");
        const status = await $(".character-counter-status");
        expect(await status.getAttribute("role")).toBe("status");
        expect(await status.getAttribute("aria-label")).not.toBeNull();
    });

    it("follows the field at once, and announces only after a pause", async function () {
        await $("#character-counter-field").setValue("abc");
        expect(await $(".character-counter-text").getText()).toBe("3 / 200");
        expect(await $("span.character-counter").getAttribute("data-count")).toBe("3");
        expect(await $(".character-counter-status").getProperty("textContent")).toBe("0 / 200");
        await browser.pause(1200);
        expect(await $(".character-counter-status").getProperty("textContent")).toBe("3 / 200");
    });
});
