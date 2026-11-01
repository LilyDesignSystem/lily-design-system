// malaysia-kad-pengenalan-view.test.js
// MalaysiaKadPengenalanView component test

const path = require("path");

describe("MalaysiaKadPengenalanView", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "malaysia-kad-pengenalan-view.html"));
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.malaysia-kad-pengenalan-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("malaysia-kad-pengenalan-view");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("span.malaysia-kad-pengenalan-view");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });
});
