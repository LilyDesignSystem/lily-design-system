import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import StatusTag from "./StatusTag.svelte";

describe("StatusTag", () => {
    test("renders the component", () => {
        render(StatusTag, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
