// date-field.test.js
// DateField component test

const path = require("path");

describe("DateField", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "date-field.html"));
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.date-field");
        await expect(el).toExist();
        expect(await el.getAttribute("class")).toContain("date-field");
        await expect($("fieldset.date-field > legend")).toExist();
    });

    it("has three labelled numeric parts, year first", async function () {
        const parts = await browser.execute(() =>
            [...document.querySelectorAll("fieldset.date-field input")].map((input) => [
                input.className,
                input.getAttribute("inputmode"),
                document.querySelector(`label[for="${input.id}"]`) !== null,
            ]),
        );
        expect(parts).toEqual([
            ["date-field-year", "numeric", true],
            ["date-field-month", "numeric", true],
            ["date-field-day", "numeric", true],
        ]);
    });
});
