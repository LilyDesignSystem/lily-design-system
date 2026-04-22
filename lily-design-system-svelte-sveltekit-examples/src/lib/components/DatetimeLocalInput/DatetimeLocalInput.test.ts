import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DatetimeLocalInput from "./DatetimeLocalInput.svelte";

describe("DatetimeLocalInput", () => {
    test("renders the component", () => {
        render(DatetimeLocalInput, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
