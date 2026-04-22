import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ReviewDate from "./ReviewDate.svelte";

describe("ReviewDate", () => {
    test("renders the component", () => {
        render(ReviewDate, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
