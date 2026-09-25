import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import YisraelTeudatZehutInput from "./YisraelTeudatZehutInput.svelte";

describe("YisraelTeudatZehutInput", () => {
    test("renders with content", () => {
        render(YisraelTeudatZehutInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("yisrael-teudat-zehut-input");
    });
});
