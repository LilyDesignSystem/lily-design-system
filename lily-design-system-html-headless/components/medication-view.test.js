// medication-view.test.js
// MedicationView component test

const path = require("path");

describe("MedicationView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "medication-view.html"));
    });

    it("renders a span with each part, tall man letters marked", async function () {
        await expect($("span.medication-view")).toExist();
        expect(await $(".medication-view-name").getText()).toBe("hydrALAZINE");
        expect(await $(".medication-view-tall-man").getText()).toBe("ALAZINE");
        expect(await $(".medication-view-route").getText()).toBe("oral");
    });
});
