import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Progress from "@lily/Progress";

describe("Progress", () => {
    test("renders a progressbar", () => {
        render(<Progress label="Loading" value={50} max={100} />);
        const progress = screen.getByRole("progressbar");
        expect(progress).toBeTruthy();
    });

    test("sets aria-label", () => {
        render(<Progress label="Upload progress" value={75} max={100} />);
        const progress = screen.getByRole("progressbar");
        expect(progress.getAttribute("aria-label")).toBe("Upload progress");
    });
});
