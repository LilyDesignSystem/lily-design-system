// brasil-cartao-nacional-de-saude-view.test.js
// BrasilCartaoNacionalDeSaudeView component test

const path = require("path");

describe("BrasilCartaoNacionalDeSaudeView", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "brasil-cartao-nacional-de-saude-view.html"),
        );
    });

    it("should render the span element with correct class", async function () {
        const el = await $("span.brasil-cartao-nacional-de-saude-view");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("brasil-cartao-nacional-de-saude-view");
    });

    it("should not put aria-label on a plain span", async function () {
        const el = await $("span.brasil-cartao-nacional-de-saude-view");
        expect(await el.getAttribute("aria-label")).toBeNull();
    });
});
