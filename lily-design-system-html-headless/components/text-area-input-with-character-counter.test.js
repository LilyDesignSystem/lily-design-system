// text-area-input-with-character-counter.test.js
// TextAreaInputWithCharacterCounter component test

const path = require("path");

describe("TextAreaInputWithCharacterCounter", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "text-area-input-with-character-counter.html"),
        );
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.text-area-input-with-character-counter");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("text-area-input-with-character-counter");
    });

    it("updates the count as the user types, and announces it only after a pause", async function () {
        const field = await $("div.text-area-input-with-character-counter textarea");
        await field.setValue("hello");
        expect(await $('[aria-hidden="true"]').getText()).toBe("5 / 500");
        expect(await $('[role="status"]').getProperty("textContent")).toBe("0 / 500");
        await browser.pause(1200);
        expect(await $('[role="status"]').getProperty("textContent")).toBe("5 / 500");
    });
});
