import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Icon from "./Icon.svelte";

describe("Icon", () => {
    test("renders the component", () => {
        render(Icon, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
