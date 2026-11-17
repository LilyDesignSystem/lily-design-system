// repeatable-fieldset.test.js
// RepeatableFieldset component test

const path = require("path");

describe("RepeatableFieldset", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "repeatable-fieldset.html"));
    });

    it("is a named fieldset with one named fieldset per item", async function () {
        const root = await $("fieldset.repeatable-fieldset");
        await expect(root).toExist();
        const items = await $$(".repeatable-fieldset-item");
        expect(items.length).toBe(2);
        expect(await items[1].$("legend").getText()).toBe("Medicine 2");
    });

    it("its buttons submit the form for a server round trip, with the item's index", async function () {
        const remove = await $$(".repeatable-fieldset-remove");
        expect(await remove[1].getAttribute("type")).toBe("submit");
        expect(await remove[1].getAttribute("name")).toBe("medicines-remove");
        expect(await remove[1].getAttribute("value")).toBe("1");
        expect(await $(".repeatable-fieldset-add").getAttribute("name")).toBe("medicines-add");
    });
});
