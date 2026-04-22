import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Editable from "./Editable.svelte";

describe("Editable", () => {
    test("renders the component", () => {
        render(Editable, { props: { label: "Test" }, context: new Map() });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
    });
});
