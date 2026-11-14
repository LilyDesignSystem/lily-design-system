import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("device-record-list-item", () => {
    it("renders an li with each part, each status as text and data", () => {
        const { document } = render("device-record-list-item", {
            device: "Cardiac pacemaker",
            status: "active",
            statusLabel: "In use",
            timing: "2021-02-08",
            timingLabel: "Since 8 Feb 2021",
        });
        const root = document.querySelector("li.device-record-list-item");
        expect(root.getAttribute("data-status")).toBe("active");
        expect(root.querySelector(".device-record-list-item-device").textContent).toBe(
            "Cardiac pacemaker",
        );
        expect(root.querySelector(".device-record-list-item-status").textContent).toBe("In use");
        expect(
            root.querySelector("time.device-record-list-item-timing").getAttribute("datetime"),
        ).toBe("2021-02-08");
    });

    it("renders only the parts that are given", () => {
        const { document } = render("device-record-list-item", { device: "Cardiac pacemaker" });
        const root = document.querySelector("li.device-record-list-item");
        expect(root.querySelector(".device-record-list-item-status")).toBeNull();
        expect(root.querySelector(".device-record-list-item-timing")).toBeNull();
        expect(root.hasAttribute("data-status")).toBe(false);
    });
});
