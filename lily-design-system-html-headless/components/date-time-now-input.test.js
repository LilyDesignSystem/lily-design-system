// date-time-now-input.test.js
// DateTimeNowInput component test

const path = require("path");

describe("DateTimeNowInput", function () {
    beforeEach(async function () {
        await browser.url("file://" + path.resolve(__dirname, "date-time-now-input.html"));
    });

    it("should render the div element with correct class", async function () {
        const el = await $("div.date-time-now-input");
        await expect(el).toExist();
        const className = await el.getAttribute("class");
        expect(className).toContain("date-time-now-input");
    });

    it("has no English default: unlabelled, the controls carry no name or text", async function () {
        const result = await browser.execute(() => {
            const el = document.querySelector("div.date-time-now-input");
            return {
                count: el.querySelectorAll("input, button").length,
                named: [...el.querySelectorAll("input, button")].filter((c) =>
                    c.hasAttribute("aria-label"),
                ).length,
                text: el.textContent.trim(),
            };
        });
        expect(result).toEqual({ count: 3, named: 0, text: "" });
    });

    it("names the controls from data-*-label, and Now fills both inputs", async function () {
        await browser.execute(() => {
            const el = document.createElement("div");
            el.className = "date-time-now-input labelled";
            el.setAttribute("role", "group");
            el.setAttribute("aria-label", "Cita");
            el.dataset.dateLabel = "Fecha";
            el.dataset.timeLabel = "Hora";
            el.dataset.nowLabel = "Ahora";
            document.body.appendChild(el);
            // Run the snippet's own script again so it builds the new element.
            const script = document.createElement("script");
            script.textContent = document.querySelector("script").textContent;
            document.body.appendChild(script);
        });
        const names = await browser.execute(() =>
            [...document.querySelectorAll(".labelled input, .labelled button")].map((c) =>
                c.getAttribute("aria-label"),
            ),
        );
        expect(names).toEqual(["Fecha", "Hora", "Ahora"]);
        const button = await $(".labelled button");
        await expect(button).toHaveText("Ahora");
        await button.click();
        const values = await browser.execute(() =>
            [...document.querySelectorAll(".labelled input")].map((c) => c.value),
        );
        expect(values[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(values[1]).toMatch(/^\d{2}:\d{2}$/);
    });
});
