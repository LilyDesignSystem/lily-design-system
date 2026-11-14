import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("procedure-record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("procedure-record-list-item", {
            procedure: "Appendectomy",
            status: "completed",
            statusLabel: "Completed",
            performed: "2018-04-22",
            performedLabel: "22 Apr 2018",
        });
        const root = document.querySelector("li.procedure-record-list-item");
        expect(root.getAttribute("data-status")).toBe("completed");
        expect(root.querySelector(".procedure-record-list-item-procedure").textContent).toBe(
            "Appendectomy",
        );
        expect(root.querySelector(".procedure-record-list-item-status").textContent).toBe(
            "Completed",
        );
        expect(
            root
                .querySelector("time.procedure-record-list-item-performed")
                .getAttribute("datetime"),
        ).toBe("2018-04-22");
    });

    it("renders only the parts that are given", () => {
        const { document } = render("procedure-record-list-item", { procedure: "Appendectomy" });
        const root = document.querySelector("li.procedure-record-list-item");
        expect(root.querySelector(".procedure-record-list-item-status")).toBeNull();
        expect(root.querySelector(".procedure-record-list-item-performed")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });
});
