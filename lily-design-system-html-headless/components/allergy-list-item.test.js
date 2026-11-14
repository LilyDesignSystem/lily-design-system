// allergy-list-item.test.js
// AllergyListItem component test

const path = require("path");

describe("AllergyListItem", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "allergy-list-item.html"));
    });

    it("renders an li with each part", async function () {
        const item = await $("li.allergy-list-item");
        await expect(item).toExist();
        expect(await item.getAttribute("data-severity")).toBe("severe");
        expect(await $(".allergy-list-item-substance").getText()).toBe("Penicillin");
        expect(await $("time.allergy-list-item-updated").getAttribute("datetime")).toBe(
            "2026-11-03",
        );
    });
});
