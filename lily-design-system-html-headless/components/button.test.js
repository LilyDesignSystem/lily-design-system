// button.test.js
// Button component test

const path = require("path");

describe("Button", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "button.html"));
    });

    it("should render the button element with correct class", async function () {
        const el = await $("button.button");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("button");
    });

    it("should have an aria-label attribute", async function () {
        const el = await $("button.button");
        const label = await el.getAttribute("aria-label");
        expect(label).not.toBeNull();
    });

    it("keeps a pending button focused while a consumer guard ignores a second click", async function () {
        const state = await browser.execute(() => {
            const button = document.querySelector("button.button");
            let pending = false;
            let starts = 0;
            button.setAttribute("aria-busy", "true");
            button.setAttribute("aria-disabled", "true");
            button.addEventListener("click", () => {
                if (pending) return;
                pending = true;
                starts += 1;
            });
            button.focus();
            button.click();
            button.click();
            return {
                disabled: button.disabled,
                busy: button.getAttribute("aria-busy"),
                ariaDisabled: button.getAttribute("aria-disabled"),
                focused: document.activeElement === button,
                starts,
            };
        });

        expect(state).toEqual({
            disabled: false,
            busy: "true",
            ariaDisabled: "true",
            focused: true,
            starts: 1,
        });
    });
});
