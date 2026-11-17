// range-fieldset.test.js
// RangeFieldset component test

const path = require("path");

describe("RangeFieldset", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "range-fieldset.html"));
    });

    it("is a fieldset named by its legend, with two range inputs on one scale", async function () {
        const root = await $("fieldset.range-fieldset");
        await expect(root).toExist();
        expect(await root.$("legend.range-fieldset-legend").getText()).toBe("Price");
        for (const selector of [".range-fieldset-minimum", ".range-fieldset-maximum"]) {
            const input = await root.$(selector);
            expect(await input.getAttribute("type")).toBe("range");
            expect(await input.getAttribute("min")).toBe("0");
            expect(await input.getAttribute("max")).toBe("100");
        }
        expect(await root.$(".range-fieldset-minimum").getAttribute("aria-label")).toBe(
            "Lowest price",
        );
        expect(await root.$(".range-fieldset-maximum").getAttribute("aria-label")).toBe(
            "Highest price",
        );
    });

    it("each thumb moves with the browser's own range keys", async function () {
        const lower = await $(".range-fieldset-minimum");
        await lower.click();
        await browser.execute(() => document.querySelector(".range-fieldset-minimum").focus());
        const before = Number(await lower.getProperty("value"));
        await browser.keys(["ArrowLeft"]);
        expect(Number(await lower.getProperty("value"))).toBe(before - 1);
        await browser.keys(["Home"]);
        expect(await lower.getProperty("value")).toBe("0");
    });

    it("both values submit, and a form reset puts both back", async function () {
        const result = await browser.execute(function () {
            const fieldset = document.querySelector("fieldset.range-fieldset");
            const form = document.createElement("form");
            fieldset.replaceWith(form);
            form.append(fieldset);
            const lower = form.querySelector(".range-fieldset-minimum");
            const upper = form.querySelector(".range-fieldset-maximum");
            const data = new FormData(form);
            lower.value = "40";
            upper.value = "50";
            form.reset();
            return [data.get("price-min"), data.get("price-max"), lower.value, upper.value];
        });
        expect(result).toEqual(["20", "80", "20", "80"]);
    });
});
