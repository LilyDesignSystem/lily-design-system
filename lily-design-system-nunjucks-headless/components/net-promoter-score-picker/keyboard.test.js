// @vitest-environment jsdom
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { render } from "../../test/render.js";

describe("net-promoter-score-picker keyboard", () => {
    test("arrows walk the scores inside the named radio group", async () => {
        document.body.innerHTML = render("net-promoter-score-picker", {
            label: "Score",
            name: "nps",
            html: '<input type="radio" name="nps" aria-label="0" /><input type="radio" name="nps" aria-label="1" />',
        }).html;
        const user = userEvent.setup();
        await user.tab();
        const first = document.activeElement;
        expect(first.closest('[role="radiogroup"]')?.getAttribute("aria-label")).toBe("Score");
        expect(first.getAttribute("aria-label")).toBe("0");
        await user.keyboard("{ArrowRight}");
        const next = document.activeElement;
        expect(next.getAttribute("aria-label")).toBe("1");
        expect(next.checked).toBe(true);
    });
});
