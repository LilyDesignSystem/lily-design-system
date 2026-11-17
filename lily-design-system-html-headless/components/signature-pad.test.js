// signature-pad.test.js
// SignaturePad component test

const path = require("path");

describe("SignaturePad", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "signature-pad.html"));
    });

    it("is a named group, not an application, described by its attestation", async function () {
        const el = await $("div.signature-pad[aria-describedby]");
        await expect(el).toExist();
        expect(await el.getAttribute("role")).toBe("group");
        expect(await el.getAttribute("aria-label")).toBe("Consent signature");
        const attestation = await el.$(".signature-pad-attestation");
        expect(await el.getAttribute("aria-describedby")).toBe(
            await attestation.getAttribute("id"),
        );
        const applications = await $$('[role="application"]');
        expect(applications.length).toBe(0);
    });

    it("can be completed by keyboard alone, by typing a name", async function () {
        const input = await $(".signature-pad-typed input");
        await input.click();
        await browser.keys("Ada Lovelace");
        expect(await input.getValue()).toBe("Ada Lovelace");
        expect(await input.getAttribute("autocomplete")).toBe("name");
    });

    it("an outcome other than signed is a notice in words, with data-outcome", async function () {
        const declined = await $('div.signature-pad[data-outcome="declined"]');
        expect(await declined.$(".signature-pad-outcome").getText()).toBe("Declined to sign");
    });
});
