import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import SwitchButton from "@lily/SwitchButton";

describe("SwitchButton", () => {
    test("renders a switch", () => {
        render(<SwitchButton label="Dark mode" checked={false} onChange={() => {}} />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl).toBeTruthy();
    });

    test("reflects checked state", () => {
        render(<SwitchButton label="Notifications" checked={true} onChange={() => {}} />);
        const switchEl = screen.getByRole("switch");
        expect(switchEl.getAttribute("aria-checked")).toBe("true");
    });

    test("calls onChange on click", async () => {
        const handleChange = vi.fn();
        const user = userEvent.setup();
        render(<SwitchButton label="Toggle" checked={false} onChange={handleChange} />);
        await user.click(screen.getByRole("switch"));
        expect(handleChange).toHaveBeenCalledOnce();
    });
});
