// allergy-list.test.js
// AllergyList component test

const path = require("path");

describe("AllergyList", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "allergy-list.html"));
    });

    it("renders a ul named by its status", async function () {
        const list = await $("ul.allergy-list");
        await expect(list).toExist();
        expect(await list.getAttribute("data-status")).toBe("known");
        expect(await list.getAttribute("aria-label")).toBe("Known allergies");
        await expect($("ul.allergy-list > li.allergy-list-item")).toExist();
    });
});
