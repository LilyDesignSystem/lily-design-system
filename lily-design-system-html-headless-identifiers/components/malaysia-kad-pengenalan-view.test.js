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

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.malaysia-kad-pengenalan-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
