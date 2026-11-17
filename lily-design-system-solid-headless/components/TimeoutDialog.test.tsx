import { describe, it, expect } from "vitest";
import { render } from "@solidjs/testing-library";
import TimeoutDialog from "./TimeoutDialog";

describe("TimeoutDialog", () => {
    it("renders with class", () => {
        const { container } = render(() => <TimeoutDialog label="Test">content</TimeoutDialog>);
        const el = container.querySelector(".timeout-dialog");
        expect(el).toBeTruthy();
    });
});
