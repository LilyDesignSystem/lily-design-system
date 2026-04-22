import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Alert from "./Alert.svelte";

describe("Alert", () => {
    test("renders the component", () => {
        render(Alert, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
