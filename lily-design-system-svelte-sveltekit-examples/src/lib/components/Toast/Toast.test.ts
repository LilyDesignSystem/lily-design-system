import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Toast from "./Toast.svelte";

describe("Toast", () => {
    test("renders the component", () => {
        render(Toast, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
