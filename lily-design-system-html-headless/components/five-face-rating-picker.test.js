// five-face-rating-picker.test.js
// FiveFaceRatingPicker component test

const path = require("path");

describe("FiveFaceRatingPicker", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-picker.html"));
    });

    it("should render the fieldset element with correct class", async function () {
        const el = await $("fieldset.five-face-rating-picker");
        await expect(el).toExist();
    });

    it("should have the correct ARIA role and an aria-label attribute", async function () {
        const el = await $("fieldset.five-face-rating-picker");
        expect(await el.getAttribute("role")).toBe("radiogroup");
        expect(await el.getAttribute("aria-label")).not.toBeNull();
    });

    it("labels the options with the numbers by default", async function () {
        const texts = await browser.execute(() =>
            Array.from(document.querySelectorAll(".five-face-rating-picker label")).map((l) =>
                l.textContent.trim(),
            ),
        );
        expect(texts).toEqual(["1", "2", "3", "4", "5"]);
    });

    it("holds five native radios, values 1 to 5, sharing one name", async function () {
        const radios = await browser.execute(() =>
            Array.from(
                document.querySelectorAll('.five-face-rating-picker input[type="radio"]'),
            ).map((r) => [r.name, r.value]),
        );
        expect(radios).toEqual([1, 2, 3, 4, 5].map((n) => ["face-rating", String(n)]));
    });
});

// Keyboard behaviour (P12-T5a): the native radio group's keys, in a real browser.
describe("FiveFaceRatingPicker keyboard", function () {
    async function checked() {
        return browser.execute(() => {
            const radios = Array.from(
                document.querySelectorAll('.five-face-rating-picker input[type="radio"]'),
            );
            return radios.findIndex((r) => r.checked) + 1;
        });
    }
    it("ArrowRight/ArrowDown and ArrowLeft/ArrowUp move the checked radio", async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-picker.html"));
        await browser.execute(() => {
            const second = document.querySelectorAll(
                '.five-face-rating-picker input[type="radio"]',
            )[1];
            second.checked = true;
            second.focus();
        });
        await browser.keys("ArrowRight");
        expect(await checked()).toBe(3);
        await browser.keys("ArrowDown");
        expect(await checked()).toBe(4);
        await browser.keys("ArrowLeft");
        await browser.keys("ArrowUp");
        await browser.keys("ArrowUp");
        expect(await checked()).toBe(1);
    });
    it("a disabled fieldset disables all its radios", async function () {
        await browser.url("file://" + path.resolve(__dirname, "five-face-rating-picker.html"));
        const disabled = await browser.execute(() => {
            document.querySelector(".five-face-rating-picker").disabled = true;
            return Array.from(
                document.querySelectorAll('.five-face-rating-picker input[type="radio"]'),
            ).every((r) => r.matches(":disabled"));
        });
        expect(disabled).toBe(true);
    });
});
