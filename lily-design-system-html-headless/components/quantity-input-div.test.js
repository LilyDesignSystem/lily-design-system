// quantity-input-div.test.js
// QuantityInputDiv component test

const path = require("path");

describe("QuantityInputDiv", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "quantity-input-div.html"));
    });

    it("is a named group with a labelled number and a labelled unit select", async function () {
        const root = await $("div.quantity-input-div");
        await expect(root).toExist();
        expect(await root.getAttribute("role")).toBe("group");
        expect(await root.getAttribute("aria-label")).toBe("Weight");
        const number = await $("#weight-magnitude");
        expect(await number.getAttribute("type")).toBe("number");
        expect(await number.getAttribute("max")).toBe("300");
        await expect($('label[for="weight-unit"]')).toExist();
    });

    it("each unit's limits sit on its option, for the consumer's script", async function () {
        expect(await $('option[value="[lb_av]"]').getAttribute("data-max")).toBe("660");
    });
});
