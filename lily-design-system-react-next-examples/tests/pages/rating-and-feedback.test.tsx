import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import RatingAndFeedbackPage from "../../app/rating-and-feedback/page";

describe("RatingAndFeedback", () => {
    test("renders the heading", () => {
        render(<RatingAndFeedbackPage />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeTruthy();
        expect(heading.textContent).toContain("Feedback");
    });

    test("renders submit button", () => {
        render(<RatingAndFeedbackPage />);
        expect(screen.getByRole("button", { name: "Submit Feedback" })).toBeTruthy();
    });

    test("shows success on submit", async () => {
        const user = userEvent.setup();
        render(<RatingAndFeedbackPage />);
        await user.click(screen.getByRole("button", { name: "Submit Feedback" }));
        expect(screen.getByText("Your feedback has been recorded.")).toBeTruthy();
    });
});
