// rating-and-feedback.test.js
// Rating and Feedback page test

const path = require("path");

describe("Rating and Feedback", function () {
    beforeEach(async function () {
        await browser.url(
            "file://" + path.resolve(__dirname, "..", "pages", "rating-and-feedback.html"),
        );
    });

    it("should render the feedback form", async function () {
        const el = await $("form.form");
        await expect(el).toExist();
        const label = await el.getAttribute("aria-label");
        expect(label).toBe("Feedback form");
    });

    it("should render the five star rating radio group", async function () {
        const el = await $("fieldset.five-star-rating-radio-group#star-rating");
        await expect(el).toExist();
        const role = await el.getAttribute("role");
        expect(role).toBe("radiogroup");
    });

    it("should render five star radios", async function () {
        const buttons = await $$("input.five-star-rating-radio-input");
        expect(buttons.length).toBe(5);
    });

    it("should select a star on click", async function () {
        const stars = await $$("input.five-star-rating-radio-input");
        await stars[2].click();
        expect(await stars[2].isSelected()).toBe(true);
    });

    it("should render the five face rating radio group", async function () {
        const el = await $("fieldset.five-face-rating-radio-group");
        await expect(el).toExist();
        const role = await el.getAttribute("role");
        expect(role).toBe("radiogroup");
    });

    it("should render five face radios", async function () {
        const buttons = await $$("input.five-face-rating-radio-input");
        expect(buttons.length).toBe(5);
    });

    it("should render the net promoter score radio group", async function () {
        const el = await $("fieldset.net-promoter-score-radio-group");
        await expect(el).toExist();
        const role = await el.getAttribute("role");
        expect(role).toBe("radiogroup");
    });

    it("should render eleven NPS radios", async function () {
        const buttons = await $$("input.net-promoter-score-radio-input");
        expect(buttons.length).toBe(11);
    });

    it("should render the comments text-area-input", async function () {
        const el = await $("textarea.text-area-input#comments");
        await expect(el).toExist();
    });

    it("should show success after form submission", async function () {
        const stars = await $$("input.five-star-rating-radio-input");
        await stars[3].click();
        await $('button[type="submit"]').click();
        const success = await $("div#success-section");
        const hidden = await success.getAttribute("hidden");
        expect(hidden).toBeNull();
    });
});
