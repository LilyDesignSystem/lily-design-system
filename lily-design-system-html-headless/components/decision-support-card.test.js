// decision-support-card.test.js
// DecisionSupportCard component test

const path = require("path");

describe("DecisionSupportCard", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "decision-support-card.html"));
    });

    it("renders a group named by its summary, not a live region", async function () {
        const card = await $("div.decision-support-card");
        await expect(card).toExist();
        expect(await card.getAttribute("role")).toBe("group");
        expect(await card.getAttribute("aria-label")).toBe("Penicillin allergy recorded");
        expect(await card.getAttribute("data-indicator")).toBe("critical");
        expect(await card.getAttribute("aria-live")).toBeNull();
    });

    it("refuses to dismiss without a reason, and Enter on a suggestion activates it", async function () {
        const form = await $("form.decision-support-card-override");
        expect(
            await browser.execute(() =>
                document.querySelector("form.decision-support-card-override").checkValidity(),
            ),
        ).toBe(false);
        await $(".decision-support-card-override-reason").selectByAttribute("value", "error");
        expect(
            await browser.execute(() =>
                document.querySelector("form.decision-support-card-override").checkValidity(),
            ),
        ).toBe(true);
        await browser.execute(() =>
            document
                .querySelector(".decision-support-card-suggestion")
                .addEventListener("click", (e) => (e.target.dataset.clicked = "true")),
        );
        await $(".decision-support-card-suggestion").click();
        await browser.keys(["Enter"]);
        expect(await $(".decision-support-card-suggestion").getAttribute("data-clicked")).toBe(
            "true",
        );
        await expect(form).toExist();
    });
});
