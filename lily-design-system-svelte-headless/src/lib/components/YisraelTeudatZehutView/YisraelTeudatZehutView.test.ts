import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import YisraelTeudatZehutView from "./YisraelTeudatZehutView.svelte";

describe("YisraelTeudatZehutView", () => {
    test("renders with content", () => {
        render(YisraelTeudatZehutView, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("yisrael-teudat-zehut-view");
    });
});
